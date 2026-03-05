// app/api/admin/debug-login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log('🔍 DEBUG LOGIN - Iniciando...')
  
  try {
    const body = await request.json()
    console.log('📦 Body recibido:', body)
    
    const { email, password } = body
    console.log('📧 Email:', email, '🔐 Password:', password ? 'PRESENTE' : 'FALTANTE')

    if (!email || !password) {
      console.log('❌ Faltan email o password')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email y contraseña requeridos',
          debug: { email: !!email, password: !!password }
        },
        { status: 400 }
      )
    }

    console.log('🔎 Buscando usuario en BD...')
    
    // Buscar usuario SIN select para ver todos los campos
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    })

    console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO')
    console.log('📝 Datos usuario:', JSON.stringify(user, null, 2))

    if (!user) {
      console.log('❌ Usuario no existe en BD')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado',
          debug: { emailInDB: false }
        },
        { status: 401 }
      )
    }

    console.log('🔑 Contraseña en BD:', user.password.substring(0, 20) + '...')
    console.log('🔑 Contraseña recibida:', password)
    
    // Verificar contraseña
    console.log('🔍 Comparando contraseñas...')
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('✅ Contraseña válida:', isValidPassword)

    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contraseña incorrecta',
          debug: { passwordMatch: false }
        },
        { status: 401 }
      )
    }

    // Verificar rol
    console.log('👑 Rol del usuario:', user.role)
    if (user.role !== 'ADMIN') {
      console.log('❌ Usuario no es ADMIN')
      return NextResponse.json(
        { 
          success: false, 
          error: 'No tienes permisos de administrador',
          debug: { role: user.role }
        },
        { status: 403 }
      )
    }

    console.log('🎉 Login exitoso!')

    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      debug: {
        passwordLength: user.password.length,
        passwordHash: user.password.substring(0, 10) + '...'
      }
    })

    // Cookie para pruebas
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 horas
    })

    console.log('🍪 Cookie establecida')
    return response

  } catch (error: any) {
    console.error('🔥 ERROR en debug-login:', error)
    console.error('🔥 Stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        debug: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}