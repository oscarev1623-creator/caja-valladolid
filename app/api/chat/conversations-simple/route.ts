import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Consulta extremadamente simple
    const conversations = await prisma.chatConversation.findMany()
    
    return NextResponse.json({ 
      success: true, 
      count: conversations.length,
      conversations 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}