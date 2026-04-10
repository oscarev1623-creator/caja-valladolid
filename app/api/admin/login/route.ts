import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Buscar usuario sin importar mayúsculas/minúsculas
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Verificar rol (case-insensitive)
    const role = user.role.toLowerCase()
    if (role !== 'admin' && role !== 'agent') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado' },
        { status: 403 }
      )
    }

    // Login exitoso
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role
      }
    })

    // Cookie de sesión
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    // Cookie para frontend
    response.cookies.set('admin_user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: role
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}