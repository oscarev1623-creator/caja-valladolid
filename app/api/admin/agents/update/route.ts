import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request) {
  try {
    const { id, name, email, password, color } = await req.json()

    const updateData: any = { 
      name, 
      email, 
      color,
      role: 'AGENT'  // 👈 Asegurar que siga siendo AGENT
    }
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const agent = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, agent })
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500 })
  }
}