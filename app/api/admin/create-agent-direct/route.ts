import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const agents = [
      {
        email: 'david@cajavalladolid.com',
        name: 'David Garcia',
        color: 'blue',
        password: '123456'
      },
      {
        email: 'alberto@cajavalladolid.com',
        name: 'Alberto Acosta',
        color: 'green',
        password: '123456'
      }
    ]

    const results = []

    for (const agent of agents) {
      const existing = await prisma.user.findUnique({ where: { email: agent.email } })
      
      if (!existing) {
        const hashedPassword = await bcrypt.hash(agent.password, 10)
        const newAgent = await prisma.user.create({
          data: {
            email: agent.email,
            name: agent.name,
            password: hashedPassword,
            role: 'AGENT',
            color: agent.color,
            isActive: true
          }
        })
        results.push({ email: agent.email, success: true, id: newAgent.id })
      } else {
        // Si existe, actualizar rol a AGENT
        const updated = await prisma.user.update({
          where: { email: agent.email },
          data: { role: 'AGENT', isActive: true }
        })
        results.push({ email: agent.email, success: true, updated: true })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}