import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Buscar el administrador
    const admin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@cajavalladolid.com' },
          { role: 'ADMIN' }
        ]
      }
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'No se encontró ningún administrador'
      })
    }

    // Nueva contraseña
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña
    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      success: true,
      message: '✅ Contraseña restablecida exitosamente',
      credentials: {
        email: updatedAdmin.email,
        password: newPassword,
        name: updatedAdmin.name
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}