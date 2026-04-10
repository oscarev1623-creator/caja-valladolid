import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 })
    }

    // Eliminar mensajes
    await prisma.chatMessage.deleteMany({
      where: { conversationId: id }
    })

    // Eliminar conversación
    await prisma.chatConversation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
  }
}