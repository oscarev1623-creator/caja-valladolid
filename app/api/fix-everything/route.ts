import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Buscar asesor existente
    let agent = await prisma.user.findFirst({
      where: { role: 'agent' }
    })
    
    // Si no hay asesor, crear uno
    if (!agent) {
      agent = await prisma.user.create({
        data: {
          email: 'admin@cajavalladolid.com',
          name: 'Administrador',
          role: 'agent',
          password: 'admin123' // Campo requerido
        }
      })
    }
    
    // Asignar conversaciones huérfanas
    const updated = await prisma.chatConversation.updateMany({
      where: { assignedToId: null },
      data: { assignedToId: agent.id }
    })
    
    // Marcar mensajes como leídos
    await prisma.chatMessage.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    })
    
    return NextResponse.json({
      success: true,
      message: 'TODO ARREGLADO',
      agent: {
        id: agent.id,
        email: agent.email,
        name: agent.name,
        role: agent.role
      },
      conversationsFixed: updated.count
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    })
  }
}