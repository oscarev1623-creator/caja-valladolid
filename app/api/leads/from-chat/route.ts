// app/api/leads/from-chat/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json()

    console.log('📥 Creando lead desde chat:', { name, email, phone })

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    const firstName = name.split(' ')[0]
    const lastName = name.split(' ').slice(1).join(' ') || ''

    // Crear el lead
    const lead = await prisma.lead.create({
      data: {
        fullName: name,
        firstName,
        lastName,
        email,
        phone: phone || '',
        estimatedAmount: 0,
        creditType: 'TRADITIONAL',
        status: 'PENDING_CONTACT',
        source: 'CHAT_WIDGET',
        message: `Cliente inició conversación por chat. Teléfono: ${phone || 'No proporcionado'}`
      }
    })

    console.log('✅ Lead creado desde chat:', lead.id)

    return NextResponse.json({
      success: true,
      leadId: lead.id
    })

  } catch (error) {
    console.error('❌ Error creating lead from chat:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear el lead' },
      { status: 500 }
    )
  }
}