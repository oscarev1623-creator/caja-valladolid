import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validaciones básicas
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Obtener IP y User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'desconocida'
    const userAgent = request.headers.get('user-agent') || 'desconocido'

    // Guardar mensaje
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        ipAddress,
        userAgent,
        status: 'UNREAD'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: {
        id: newMessage.id,
        createdAt: newMessage.createdAt
      }
    })

  } catch (error) {
    console.error('Error guardando mensaje:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}