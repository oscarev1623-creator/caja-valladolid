import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const result = await prisma.user.updateMany({
      where: {
        email: {
          not: 'oscarev1623@gmail.com'
        }
      },
      data: {
        role: 'AGENT'
      }
    })

    return NextResponse.json({ 
      success: true, 
      updated: result.count,
      message: `${result.count} usuarios actualizados a AGENT`
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}