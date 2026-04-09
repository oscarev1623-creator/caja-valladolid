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
    
    // Si no hay agentes, devolver array vacío (NO crear fantasma)
    return NextResponse.json({ success: true, agents })
  } catch (error) {
    console.error('Error en agents:', error)
    // Devolver array vacío, NO un fantasma
    return NextResponse.json({ success: true, agents: [] })
  }
}