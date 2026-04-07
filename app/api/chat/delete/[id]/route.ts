import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 })
    }

    // Primero eliminar todos los mensajes de la conversación
    await prisma.chatMessage.deleteMany({
      where: { conversationId: id }
    })

    // Luego eliminar la conversación
    await prisma.chatConversation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
  }
}