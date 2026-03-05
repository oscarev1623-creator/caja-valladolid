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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const userCookie = request.cookies.get('admin_user')?.value
    if (!userCookie) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    const currentUser = JSON.parse(userCookie)
    const { id } = await params

    // Buscar ticket original
    const originalTicket = await prisma.ticket.findUnique({
      where: { id },
      include: { lead: true }
    })

    if (!originalTicket) {
      return NextResponse.json(
        { success: false, error: 'Ticket no encontrado' },
        { status: 404 }
      )
    }

    // Generar nuevo token
    const uniqueToken = generateUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Actualizar lead con nuevo token
    await prisma.lead.update({
      where: { id: originalTicket.leadId },
      data: {
        uniqueToken,
        tokenExpiresAt: expiresAt,
        tokenGeneratedAt: new Date()
      }
    })

    // Crear nuevo ticket
    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        leadId: originalTicket.leadId,
        uniqueToken,
        linkUrl: `${request.headers.get('origin') || ''}/formulario-documentos/${uniqueToken}`,
        expiresAt,
        status: 'SENT',
        priority: originalTicket.priority,
        createdById: currentUser.id
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ticket: newTicket,
        message: 'Ticket reenviado correctamente'
      }
    })

  } catch (error) {
    console.error('Error reenviando ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}