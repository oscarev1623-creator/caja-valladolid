import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// GET /api/tickets - Obtener todos los tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { lead: { fullName: { contains: search, mode: 'insensitive' } } },
        { lead: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lead: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true
            }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          notes: {
            include: {
              author: {
                select: { id: true, name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }),
      prisma.ticket.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/tickets - Crear un nuevo ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    if (!body.leadId) {
      return NextResponse.json(
        { error: 'Lead ID es requerido' },
        { status: 400 }
      )
    }

    // Generar número de ticket único
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    const uniqueToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expira en 7 días

    // Obtener información del lead
    const lead = await prisma.lead.findUnique({
      where: { id: body.leadId },
      select: { fullName: true, email: true }
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Crear ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        leadId: body.leadId,
        status: body.status || 'PENDING',
        priority: body.priority || 'MEDIUM',
        uniqueToken,
        linkUrl: `${process.env.APP_URL}/formulario-completo/${uniqueToken}`,
        assignedToId: body.assignedToId,
        createdById: body.createdById || 'admin',
        expiresAt
      }
    })

    // Enviar email al lead (si está configurado)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: lead.email,
          subject: 'Caja Valladolid - Solicitud de Documentación',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981;">Caja Valladolid</h2>
              <p>Estimado/a ${lead.fullName},</p>
              <p>Para continuar con el proceso de tu solicitud de crédito, necesitamos que completes la siguiente documentación:</p>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Número de Ticket:</strong> ${ticketNumber}</p>
                <p><strong>Enlace único:</strong> <a href="${process.env.APP_URL}/formulario-completo/${uniqueToken}">Completar formulario</a></p>
                <p><strong>Válido hasta:</strong> ${expiresAt.toLocaleDateString('es-MX')}</p>
              </div>
              <p>Este enlace es personal e intransferible.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                Caja Popular San Bernardino de Siena Valladolid<br>
                Registro Oficial: 29198 • CONDUSEF ID: 4930
              </p>
            </div>
          `
        })
        console.log(`✅ Email enviado a: ${lead.email}`)
      } catch (emailError) {
        console.error('❌ Error enviando email:', emailError)
        // Continuar aunque falle el email
      }
    }

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket creado exitosamente'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}