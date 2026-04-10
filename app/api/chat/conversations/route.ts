import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const conversations = await prisma.chatConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        assignedTo: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    })

    const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await prisma.chatMessage.count({
        where: { conversationId: conv.id, senderType: 'user', isRead: false }
      })
      return { ...conv, unreadCount, lastMessage: conv.messages[0]?.message || null }
    }))

    return new NextResponse(JSON.stringify({ success: true, conversations: conversationsWithUnread }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}