// app/api/leads/generate-link/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// UUID simple
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function POST(request: NextRequest) {
  try {
    // Verificar sesión con request.cookies
    const session = request.cookies.get('admin_session')?.value
    console.log('🔐 Session:', session)

    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener el usuario actual desde la cookie admin_user
    const userCookie = request.cookies.get('admin_user')?.value
    console.log('👤 User cookie:', userCookie)

    if (!userCookie) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado en sesión' },
        { status: 401 }
      )
    }

    // Parsear el usuario
    let currentUser
    try {
      currentUser = JSON.parse(userCookie)
    } catch (e) {
      console.error('Error parseando user cookie:', e)
      return NextResponse.json(
        { success: false, error: 'Error con datos de usuario' },
        { status: 401 }
      )
    }

    console.log('👤 Usuario actual:', currentUser)

    const { leadId, baseUrl } = await request.json()
    console.log('📦 leadId:', leadId)

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'ID del lead requerido' },
        { status: 400 }
      )
    }

    // Verificar que el lead existe
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Generar token único
    const uniqueToken = generateUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

    // Primero actualizar el lead
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        uniqueToken,
        tokenExpiresAt: expiresAt,
        tokenGeneratedAt: new Date(),
        status: 'PENDING_DOCUMENTS'
      }
    })

    // CREAR TICKET con el ID del usuario actual
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    console.log('🎫 Creando ticket con:', {
      ticketNumber,
      leadId,
      uniqueToken,
      createdById: currentUser.id,
      linkUrl: `${baseUrl || request.headers.get('origin') || ''}/formulario-documentos/${uniqueToken}`,
      expiresAt
    })

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        leadId: lead.id,
        uniqueToken,
        linkUrl: `${baseUrl || request.headers.get('origin') || ''}/formulario-documentos/${uniqueToken}`,
        expiresAt,
        status: 'PENDING',
        priority: 'MEDIUM',
        createdById: currentUser.id // ← AHORA SÍ TENEMOS EL ID
      }
    })

    console.log('✅ Ticket creado:', ticket.id)

    const url = `${baseUrl || request.headers.get('origin') || ''}/formulario-documentos/${uniqueToken}`

    return NextResponse.json({
      success: true,
      data: {
        lead: {
          id: lead.id,
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone
        },
        ticket: {
          id: ticket.id,
          number: ticket.ticketNumber
        },
        token: uniqueToken,
        url,
        shortUrl: `/formulario-documentos/${uniqueToken}`,
        expiresAt: expiresAt.toISOString(),
        isNewToken: true,
        message: 'Enlace generado exitosamente'
      }
    })

  } catch (error) {
    console.error('❌ Error generando enlace:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}