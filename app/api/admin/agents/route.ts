import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const agents = await prisma.user.findMany({
      where: { 
        role: 'AGENT'  // 👈 Solo mostrar AGENT, excluir ADMIN
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        color: true,
        role: true,
        _count: {
          select: {
            chatConversations: {
              where: { status: 'active' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const agentsWithChats = agents.map(agent => ({
      ...agent,
      activeChats: agent._count.chatConversations
    }))

    return NextResponse.json({ success: true, agents: agentsWithChats })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar' }, { status: 500 })
  }
}