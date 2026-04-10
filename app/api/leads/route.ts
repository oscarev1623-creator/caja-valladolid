import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función para obtener el asesor con MENOS leads asignados
async function getBestAgent() {
  console.log('🔍 Buscando el mejor asesor...')
  
  // ✅ CORREGIDO: 'agent' en minúsculas
  const agents = await prisma.user.findMany({
    where: {
      role: 'agent',
      isActive: true
    }
  })

  console.log(`📊 Asesores encontrados: ${agents.length}`)

  if (agents.length === 0) {
    // ✅ CORREGIDO: 'admin' en minúsculas
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })
    console.log('⚠️ No hay agentes, usando admin:', admin?.name)
    return admin
  }

  // Contar cuántos LEADS tiene asignado cada asesor
  const agentsWithLoad = await Promise.all(agents.map(async (agent) => {
    const leadCount = await prisma.lead.count({
      where: { assignedToId: agent.id }
    })
    console.log(`   📋 ${agent.name} tiene ${leadCount} leads asignados`)
    return { ...agent, currentLoad: leadCount }
  }))

  // Ordenar por menor cantidad de leads
  agentsWithLoad.sort((a, b) => a.currentLoad - b.currentLoad)
  
  const selected = agentsWithLoad[0]
  console.log(`✅ Asesor seleccionado: ${selected.name} (${selected.currentLoad} leads)`)
  
  return selected
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    
    const pageNum = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limitNum = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10') || 10))
    const skip = (pageNum - 1) * limitNum

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

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          estimatedAmount: true,
          creditType: true,
          status: true,
          message: true,
          createdAt: true,
          assignedTo: {
            select: { 
              id: true, 
              name: true, 
              email: true,
              color: true
            }
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
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nombre completo, email y teléfono son requeridos' 
        },
        { status: 400 }
      )
    }

    const estimatedAmount = data.estimatedAmount ? 
      (parseFloat(data.estimatedAmount) || 0) : 0

    // Asignar el asesor con MENOS leads
    const bestAgent = await getBestAgent()
    const assignedToId = bestAgent?.id || null

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        estimatedAmount: estimatedAmount,
        creditType: data.creditType || 'TRADITIONAL',
        message: data.message || '',
        status: data.status || 'PENDING_CONTACT',
        assignedToId: assignedToId
      },
      include: {
        assignedTo: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            color: true
          }
        }
      }
    })

    console.log(`✅ Lead creado y asignado a: ${lead.assignedTo?.name || 'Sin asesor'}`)

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead creado exitosamente'
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error creando lead:', error)
    
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
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}