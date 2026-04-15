import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const messageId = params.messageId
    
    if (!messageId) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 })
    }

    // Verificar que el mensaje existe y es del asesor
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return NextResponse.json({ success: false, error: 'Mensaje no encontrado' }, { status: 404 })
    }

    // Solo permitir eliminar mensajes del asesor
    if (message.senderType !== 'agent') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
    }

    await prisma.chatMessage.delete({
      where: { id: messageId }
    })

    return NextResponse.json({ success: true, message: 'Mensaje eliminado' })

  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}