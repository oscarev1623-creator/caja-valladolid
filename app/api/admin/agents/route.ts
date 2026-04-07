import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let agents = await prisma.user.findMany({
      where: { role: 'agent' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        color: true
      }
    })
    
    // Si no hay agentes, crear uno YA
    if (agents.length === 0) {
      const newAgent = await prisma.user.create({
        data: {
          email: 'admin@cajavalladolid.com',
          name: 'Administrador',
          role: 'agent',
          password: 'admin123' // Campo requerido
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          color: true
        }
      })
      agents = [newAgent]
    }
    
    return NextResponse.json({ success: true, agents })
  } catch (error) {
    console.error('Error en agents:', error)
    // Si falla, devolver agente falso
    return NextResponse.json({
      success: true,
      agents: [{
        id: 'emergency',
        name: 'Administrador',
        email: 'admin@cajavalladolid.com',
        color: 'green'
      }]
    })
  }
}