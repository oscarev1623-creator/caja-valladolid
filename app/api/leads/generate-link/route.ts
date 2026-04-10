import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

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

    // Verificar que el lead existe
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      console.log('❌ Lead no encontrado:', leadId)
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Lead encontrado:', lead.email)

    // Generar o usar token existente
    const uniqueToken = lead.uniqueToken || uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

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
      console.log('✅ Token generado para lead:', uniqueToken)
    }

    // Crear o actualizar ticket
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const documentLink = `${baseUrl || process.env.NEXTAUTH_URL || 'https://www.cajavalladolid.com'}/formulario-documentos/${uniqueToken}`

    const existingTicket = await prisma.ticket.findFirst({
      where: { leadId }
    })

    let ticket
    if (existingTicket) {
      ticket = await prisma.ticket.update({
        where: { id: existingTicket.id },
        data: { uniqueToken, linkUrl: documentLink, expiresAt }
      })
      console.log('✅ Ticket actualizado:', ticket.id)
    } else {
      ticket = await prisma.ticket.create({
        data: {
          ticketNumber,
          leadId,
          uniqueToken,
          linkUrl: documentLink,
          expiresAt,
          status: 'PENDING',
          priority: 'MEDIUM'
        }
      })
      console.log('✅ Ticket creado:', ticket.id)
    }

    return NextResponse.json({
      success: true,
      data: {
        lead: { id: lead.id, fullName: lead.fullName, email: lead.email },
        ticket: { id: ticket.id, number: ticket.ticketNumber },
        token: uniqueToken,
        url: documentLink,
        expiresAt: expiresAt.toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ Error en generate-link:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}