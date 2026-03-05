import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// SOLO GET PARA LISTAR TICKETS (SIN params)
export async function GET(request: NextRequest) {
  try {
    // Verificar sesión
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Construir filtros
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { lead: { fullName: { contains: search, mode: 'insensitive' } } },
        { lead: { email: { contains: search, mode: 'insensitive' } } },
        { lead: { phone: { contains: search, mode: 'insensitive' } } },
        { ticketNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: tickets
    })

  } catch (error) {
    console.error('Error obteniendo tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}