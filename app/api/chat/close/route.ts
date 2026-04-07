import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { conversationId } = await req.json()

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status: 'closed' }
    })

    await prisma.chatMessage.create({
      data: {
        conversationId,
        message: 'Conversación cerrada por el asesor',
        senderType: 'system',
        isRead: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error closing conversation:', error)
    return NextResponse.json({ success: false, error: 'Error al cerrar' }, { status: 500 })
  }
}