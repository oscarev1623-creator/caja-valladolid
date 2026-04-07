import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const conversations = await prisma.chatConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        assignedTo: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    // Contar mensajes no leídos
    const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await prisma.chatMessage.count({
        where: {
          conversationId: conv.id,
          senderType: 'user',
          isRead: false
        }
      })
      return {
        ...conv,
        unreadCount,
        lastMessage: conv.messages[0]?.message || null
      }
    }))

    return NextResponse.json({ success: true, conversations: conversationsWithUnread })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar' }, { status: 500 })
  }
}