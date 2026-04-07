// app/api/chat/conversations/route.ts
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

    const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await prisma.chatMessage.count({
        where: {
          conversationId: conv.id,
          senderType: 'user',
          isRead: false
        }
      })
      
      return {
        id: conv.id,
        userEmail: conv.userEmail,
        userName: conv.userName,
        userPhone: conv.userPhone,
        status: conv.status,
        updatedAt: conv.updatedAt,
        assignedTo: conv.assignedTo,
        unreadCount,
        lastMessage: conv.messages[0]?.message || null
      }
    }))

    return NextResponse.json(
      { success: true, conversations: conversationsWithUnread },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cargar' }, 
      { 
        status: 500,
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  }
}