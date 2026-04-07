// app/api/chat/messages/route.ts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const markAsRead = searchParams.get('markAsRead') === 'true'

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

    // 🔴 IMPORTANTE: Headers para evitar cache en Vercel
    return NextResponse.json(
      {
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
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar' }, { status: 500 })
  }
}