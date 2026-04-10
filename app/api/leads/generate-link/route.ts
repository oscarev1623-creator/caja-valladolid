import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function POST(request: NextRequest) {
  try {
    const { leadId, baseUrl } = await request.json()
    console.log('📦 generate-link llamado con leadId:', leadId)

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'ID del lead requerido' },
        { status: 400 }
      )
    }

    // Verificar si viene del chat público (no tiene cookie)
    const session = request.cookies.get('admin_session')?.value
    const isPublicChat = !session || session !== 'authenticated'
    
    console.log('🔐 ¿Es chat público?:', isPublicChat)

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Generar o usar token existente
    const uniqueToken = lead.uniqueToken || generateUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Actualizar lead si no tenía token
    if (!lead.uniqueToken) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          uniqueToken,
          tokenExpiresAt: expiresAt,
          tokenGeneratedAt: new Date(),
          status: 'PENDING_DOCUMENTS'
        }
      })
    }

    // Crear o actualizar ticket (sin createdById para chat público)
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const documentLink = `${baseUrl || request.headers.get('origin') || 'https://www.cajavalladolid.com'}/formulario-documentos/${uniqueToken}`

    const existingTicket = await prisma.ticket.findFirst({
      where: { leadId }
    })

    let ticket
    const ticketData: any = {
      ticketNumber,
      leadId,
      uniqueToken,
      linkUrl: documentLink,
      expiresAt,
      status: 'PENDING',
      priority: 'MEDIUM'
    }

    // Solo agregar createdById si hay sesión de admin
    if (!isPublicChat) {
      const userCookie = request.cookies.get('admin_user')?.value
      if (userCookie) {
        try {
          const currentUser = JSON.parse(userCookie)
          ticketData.createdById = currentUser.id
        } catch (e) {
          console.error('Error parseando user cookie:', e)
        }
      }
    }

    if (existingTicket) {
      ticket = await prisma.ticket.update({
        where: { id: existingTicket.id },
        data: { uniqueToken, linkUrl: documentLink, expiresAt }
      })
    } else {
      ticket = await prisma.ticket.create({ data: ticketData })
    }

    console.log('✅ Ticket creado/actualizado:', ticket.id)

    return NextResponse.json({
      success: true,
      data: {
        lead: { id: lead.id, fullName: lead.fullName, email: lead.email, phone: lead.phone },
        ticket: { id: ticket.id, number: ticket.ticketNumber },
        token: uniqueToken,
        url: documentLink,
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