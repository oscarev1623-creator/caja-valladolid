import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { compareSync } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Intentando login...')
    
    const { email, password } = await request.json()
    console.log('📧 Email recibido:', email)

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true
      }
    })

    console.log('👤 Usuario encontrado:', user?.email || 'NO ENCONTRADO')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = compareSync(password, user.password)
    console.log('🔐 Contraseña válida:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Verificar que sea admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos de administrador' },
        { status: 403 }
      )
    }

    console.log('✅ Login exitoso para:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error: any) {
    console.error('🔥 Error en login:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}