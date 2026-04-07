import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const { id, isActive } = await req.json()

    const agent = await prisma.user.update({
      where: { id },
      data: { isActive }
    })

    return NextResponse.json({ success: true, agent })
  } catch (error) {
    console.error('Error toggling agent:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500 })
  }
}