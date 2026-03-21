import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Probar conexión a la base de datos
    const userCount = await prisma.user.count()
    const leadCount = await prisma.lead.count()
    
    return NextResponse.json({
      success: true,
      database: 'conectada',
      users: userCount,
      leads: leadCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}