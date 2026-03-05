import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: Obtener todos los leads
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    
    // VALIDACIÓN MEJORADA: page y limit
    const pageNum = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limitNum = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10') || 10))
    const skip = (pageNum - 1) * limitNum

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    // Obtener leads y total
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.lead.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })

  } catch (error: any) {
    console.error('❌ Error obteniendo leads:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST: Crear nuevo lead
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nombre completo, email y teléfono son requeridos' 
        },
        { status: 400 }
      )
    }

    // VALIDACIÓN MEJORADA: estimatedAmount
    const estimatedAmount = data.estimatedAmount ? 
      (parseFloat(data.estimatedAmount) || 0) : 0

    // Crear lead (SIN STAGE)
    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        estimatedAmount: estimatedAmount,
        creditType: data.creditType || 'TRADITIONAL',
        message: data.message || '',
        status: data.status || 'PENDING',
        assignedToId: data.assignedToId || null
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead creado exitosamente'
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error creando lead:', error)
    
    // Error de duplicado (si agregamos constraint único)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Ya existe un lead con este email' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}