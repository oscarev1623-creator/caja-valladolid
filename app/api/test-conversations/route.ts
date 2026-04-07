import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const conversations = await prisma.chatConversation.findMany({
      include: {
        assignedTo: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ success: true, conversations })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}