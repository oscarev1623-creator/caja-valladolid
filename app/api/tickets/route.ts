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

    // Enviar email al lead (si está configurado y el lead tiene email)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && lead.email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"Caja Valladolid" <${process.env.EMAIL_USER}>`,
          to: lead.email,
          subject: 'Caja Valladolid - Solicitud de Documentación',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Caja Valladolid</h1>
              </div>
              
              <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1e293b; margin-top: 0;">Estimado/a ${lead.fullName},</h2>
                
                <p style="color: #334155; line-height: 1.6;">Para continuar con el proceso de tu solicitud de crédito, necesitamos que completes la siguiente documentación:</p>
                
                <div style="background: white; border-left: 4px solid #0d9488; padding: 20px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>📋 Número de Ticket:</strong> ${ticketNumber}</p>
                  <p style="margin: 5px 0;"><strong>🔗 Enlace único:</strong> <a href="${process.env.APP_URL}/formulario-completo/${uniqueToken}" style="color: #0d9488;">Completar formulario</a></p>
                  <p style="margin: 5px 0;"><strong>⏰ Válido hasta:</strong> ${expiresAt.toLocaleDateString('es-MX')}</p>
                </div>
                
                <p style="color: #334155;">Este enlace es personal e intransferible.</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 20px;">
                
                <p style="font-size: 12px; color: #64748b; text-align: center;">
                  Caja Popular San Bernardino de Siena Valladolid<br>
                  Registro Oficial: 29198 • CONDUSEF ID: 4930
                </p>
              </div>
            </div>
          `
        })
        console.log(`✅ Email enviado a: ${lead.email}`)
      } catch (emailError) {
        console.error('❌ Error enviando email:', emailError)
        // Continuar aunque falle el email
      }
    } else if (!lead.email) {
      console.log('⚠️ No se envió email: El lead no tiene email registrado')
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