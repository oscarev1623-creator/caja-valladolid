import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json()

    // 1. Buscar si ya existe una conversación activa para este email
    const existingConversation = await prisma.chatConversation.findFirst({
      where: {
        userEmail: email,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    })

    if (existingConversation) {
      console.log('✅ Reutilizando conversación existente:', existingConversation.id)

      const updateData: any = {}
      if (name && !existingConversation.userName) updateData.userName = name
      if (phone && !existingConversation.userPhone) updateData.userPhone = phone

      if (Object.keys(updateData).length > 0) {
        await prisma.chatConversation.update({
          where: { id: existingConversation.id },
          data: updateData
        })
      }

      return NextResponse.json({ 
        success: true, 
        conversationId: existingConversation.id,
        isNew: false 
      })
    }

    // 2. Si no existe, crear una nueva
    const conversation = await prisma.chatConversation.create({
      data: {
        userEmail: email,
        userName: name,
        userPhone: phone || null,
        status: 'active'
      }
    })

    return NextResponse.json({ 
      success: true, 
      conversationId: conversation.id,
      isNew: true 
    })
  } catch (error) {
    console.error('Error starting conversation:', error)
    return NextResponse.json({ success: false, error: 'Error al iniciar' }, { status: 500 })
  }
}