import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type AgentWithLoad = {
  id: string
  email: string
  password: string
  name: string
  role: string
  isActive: boolean
  color: string | null
  createdAt: Date
  updatedAt: Date
  currentLoad: number
}

export async function POST(req: Request) {
  try {
    const { conversationId } = await req.json()

    const agents = await prisma.user.findMany({
      where: {
        role: 'AGENT',
        isActive: true
      }
    })

    let selectedAgent: any = null

    if (agents.length > 0) {
      const agentsWithLoad: AgentWithLoad[] = await Promise.all(agents.map(async (agent) => {
        const activeChats = await prisma.chatConversation.count({
          where: {
            assignedToId: agent.id,
            status: 'active'
          }
        })
        return { ...agent, currentLoad: activeChats }
      }))
      
      agentsWithLoad.sort((a, b) => a.currentLoad - b.currentLoad)
      selectedAgent = agentsWithLoad[0]
    } else {
      const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })
      
      if (admin) {
        selectedAgent = admin
      } else {
        await prisma.chatMessage.create({
          data: {
            conversationId,
            message: '⚠️ No hay asesores disponibles. Te contactaremos a la brevedad.',
            senderType: 'system',
            isRead: true
          }
        })
        
        return NextResponse.json({ 
          success: false, 
          error: 'No hay asesores disponibles',
          agent: null 
        })
      }
    }

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: {
        assignedToId: selectedAgent.id,
        assignedAt: new Date()
      }
    })

    await prisma.chatMessage.create({
      data: {
        conversationId,
        message: `Asignado a ${selectedAgent.name}${selectedAgent.role === 'ADMIN' ? ' (Administrador)' : ''}`,
        senderType: 'system',
        isRead: true
      }
    })

    return NextResponse.json({
      success: true,
      agent: {
        id: selectedAgent.id,
        name: selectedAgent.name,
        email: selectedAgent.email,
        color: selectedAgent.color || 'green',
        role: selectedAgent.role
      }
    })
  } catch (error) {
    console.error('Error assigning agent:', error)
    return NextResponse.json({ success: false, error: 'Error al asignar' }, { status: 500 })
  }
}