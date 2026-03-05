import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Contar usuarios
    const userCount = await prisma.user.count()
    
    // Obtener primer usuario
    const firstUser = await prisma.user.findFirst()
    
    return NextResponse.json({
      success: true,
      message: '✅ API funcionando',
      database: {
        connected: true,
        userCount,
        firstUser: firstUser ? {
          id: firstUser.id,
          email: firstUser.email,
          name: firstUser.name,
          role: firstUser.role
        } : null
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: '❌ Error en la base de datos',
      details: error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}