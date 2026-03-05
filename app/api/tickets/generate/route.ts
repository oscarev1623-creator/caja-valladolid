import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json()
    
    // Generar token único
    const token = crypto.randomBytes(32).toString('hex')
    
    // Crear ticket para formulario 2
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-${Date.now()}`,
        leadId,
        uniqueToken: token,
        linkUrl: `${process.env.APP_URL}/formulario-completo/${token}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        createdById: 'admin_id', // Cambiar por ID real
        status: 'PENDING'
      }
    })

    // Enviar email con link
    await enviarEmailFormulario2(ticket)

    return NextResponse.json({
      success: true,
      token,
      link: ticket.linkUrl,
      message: 'Link generado exitosamente'
    })

  } catch (error: any) {
    console.error('Error generando ticket:', error)
    return NextResponse.json(
      { error: 'Error generando enlace' },
      { status: 500 }
    )
  }
}

async function enviarEmailFormulario2(ticket: any) {
  // Implementar envío de email con el link
  console.log('📧 Email enviado con link:', ticket.linkUrl)
}