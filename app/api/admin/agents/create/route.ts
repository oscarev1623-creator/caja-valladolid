import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password, color } = await req.json()

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'El email ya existe' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const agent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'agent',  // 👈 minúsculas
        color: color || 'green',
        isActive: true
      }
    })

    return NextResponse.json({ success: true, agent })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, error: 'Error al crear' }, { status: 500 })
  }
}