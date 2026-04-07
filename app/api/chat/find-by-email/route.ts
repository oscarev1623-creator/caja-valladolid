import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const phone = searchParams.get('phone')

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 })
    }

    // Buscar conversación existente
    let conversation = await prisma.chatConversation.findFirst({
      where: {
        userEmail: email,
        status: 'active'
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Si existe y no tiene nombre, actualizarla
    if (conversation) {
      const updateData: any = {}
      if (name && !conversation.userName) updateData.userName = name
      if (phone && !conversation.userPhone) updateData.userPhone = phone
      
      if (Object.keys(updateData).length > 0) {
        conversation = await prisma.chatConversation.update({
          where: { id: conversation.id },
          data: updateData
        })
        console.log('✅ Conversación actualizada:', updateData)
      }
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation?.id || null
    })
  } catch (error) {
    console.error('Error finding conversation:', error)
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}