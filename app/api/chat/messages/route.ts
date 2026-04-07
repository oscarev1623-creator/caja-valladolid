import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const markAsRead = searchParams.get('markAsRead') === 'true' // 👈 NUEVO: parámetro opcional

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'Conversation ID required' }, { status: 400 })
    }

    const conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        assignedTo: true
      }
    })

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 })
    }

    // 🔴 SOLO marcar como leídos si se envía el parámetro markAsRead=true
    if (markAsRead) {
      await prisma.chatMessage.updateMany({
        where: {
          conversationId,
          senderType: 'user',
          isRead: false
        },
        data: { isRead: true }
      })
    }

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        userEmail: conversation.userEmail,
        userName: conversation.userName,
        userPhone: conversation.userPhone,
        status: conversation.status,
        assignedTo: conversation.assignedTo
      },
      messages: conversation.messages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar' }, { status: 500 })
  }
}