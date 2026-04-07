// app/api/chat/send/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendChatNotificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { conversationId, message, senderType, fileUrl, fileType, fileName } = await req.json()

    const newMessage = await prisma.chatMessage.create({
      data: {
        conversationId,
        message: message || null,
        senderType,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        fileName: fileName || null,
        isRead: senderType === 'agent'
      }
    })

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    // Si el mensaje es del asesor, enviar correo al cliente
    if (senderType === 'agent') {
      const conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        select: { userEmail: true, userName: true }
      })

      if (conversation?.userEmail) {
        await sendChatNotificationEmail({
          to: conversation.userEmail,
          name: conversation.userName || 'cliente',
          message: message || 'Se ha adjuntado un documento',
          conversationId
        })
      }
    }

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ success: false, error: 'Error al enviar' }, { status: 500 })
  }
}