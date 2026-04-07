// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Probar conexión a la base de datos
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'API funcionando',
      database: 'conectada',
      users: userCount,
      dbUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      dbUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
    }, { status: 500 })
  }
}