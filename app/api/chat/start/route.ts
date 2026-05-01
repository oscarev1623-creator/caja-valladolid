import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json()

    // 1. Buscar si ya existe un lead con este email
    let existingLead = await prisma.lead.findFirst({
      where: { email: email }
    })

    let leadId: string | null = null

    if (existingLead) {
      // Si ya existe, usar ese lead
      leadId = existingLead.id
      console.log('✅ Reutilizando lead existente:', leadId)
    } else {
      // Si NO existe, crear un nuevo lead
      const newLead = await prisma.lead.create({
        data: {
          fullName: name,
          email: email,
          phone: phone || '',
          status: 'PENDING_CONTACT',
          source: 'CHAT_WIDGET',
          message: message || 'Contacto desde ChatWidget'
        }
      })
      leadId = newLead.id
      console.log('✅ Nuevo lead creado:', leadId)
    }

    // 2. Buscar si ya existe una conversación activa para este email
    const existingConversation = await prisma.chatConversation.findFirst({
      where: {
        userEmail: email,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    })

    if (existingConversation) {
      console.log('✅ Reutilizando conversación existente:', existingConversation.id)
      return NextResponse.json({ 
        success: true, 
        conversationId: existingConversation.id,
        isNew: false,
        leadId: existingConversation.leadId || leadId
      })
    }

    // 3. Si no existe, crear una nueva conversación VINCULADA al lead
    const conversation = await prisma.chatConversation.create({
      data: {
        userEmail: email,
        userName: name,
        userPhone: phone || null,
        status: 'active',
        leadId: leadId  // ✅ Vincular al lead
      }
    })

    return NextResponse.json({ 
      success: true, 
      conversationId: conversation.id,
      isNew: true,
      leadId: leadId
    })
  } catch (error) {
    console.error('Error starting conversation:', error)
    return NextResponse.json({ success: false, error: 'Error al iniciar' }, { status: 500 })
  }
}