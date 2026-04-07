import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json()

    const conversation = await prisma.chatConversation.create({
      data: {
        userEmail: email,
        userName: name,
        userPhone: phone || null,
        status: 'active'
      }
    })

    return NextResponse.json({ success: true, conversationId: conversation.id })
  } catch (error) {
    console.error('Error starting conversation:', error)
    return NextResponse.json({ success: false, error: 'Error al iniciar' }, { status: 500 })
  }
}