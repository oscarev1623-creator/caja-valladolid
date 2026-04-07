import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Convertir todos los usuarios que NO sean el admin principal a AGENT
    const updated = await prisma.user.updateMany({
      where: {
        email: { not: 'oscarev1623@gmail.com' }, // Tu email de admin
        role: 'ADMIN'
      },
      data: {
        role: 'AGENT'
      }
    })

    return NextResponse.json({ 
      success: true, 
      updated: updated.count,
      message: `${updated.count} usuarios convertidos a AGENT`
    })
  } catch (error) {
    console.error('Error fixing agents:', error)
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}