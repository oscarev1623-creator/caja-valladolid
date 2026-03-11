import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export async function GET(request: NextRequest) {
  try {
    // ✅ AUTENTICACIÓN ACTIVADA
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let userEmail = 'unknown_user'
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userEmail = decoded.email || 'authenticated_user'
      console.log(`📊 Dashboard API llamada por: ${userEmail}`)
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    // Obtener estadísticas
    const totalLeads = await prisma.lead.count()
    const pendingLeads = await prisma.lead.count({ 
      where: { status: 'PENDING' } 
    })
    const approvedLeads = await prisma.lead.count({ 
      where: { status: 'APPROVED' } 
    })
    const rejectedLeads = await prisma.lead.count({ 
      where: { status: 'REJECTED' } 
    })

    const totalAmountResult = await prisma.lead.aggregate({
      _sum: { estimatedAmount: true },
      where: { status: 'PENDING' }
    })

    const conversionRate = totalLeads > 0 
      ? Math.round((approvedLeads / totalLeads) * 100)
      : 0

    // Leads recientes
    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        estimatedAmount: true,
        creditType: true,
        status: true,
        createdAt: true
      }
    })

    // Formatear con manejo de estimatedAmount null
    const formattedRecentLeads = recentLeads.map(lead => ({
      id: lead.id,
      name: lead.fullName,
      email: lead.email,
      // CORREGIDO: Manejar estimatedAmount que puede ser null
      amount: lead.estimatedAmount 
        ? `$${lead.estimatedAmount.toLocaleString('es-MX')}`
        : '$0',
      type: lead.creditType,
      status: lead.status,
      date: new Date(lead.createdAt).toLocaleDateString('es-MX')
    }))

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        pendingLeads,
        approvedLeads,
        rejectedLeads,
        totalAmount: totalAmountResult._sum.estimatedAmount || 0,
        conversionRate
      },
      recentLeads: formattedRecentLeads
    })

  } catch (error: any) {
    console.error('❌ Error en dashboard stats API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, {
      status: 500
    })
  }
}

// Opcional: método POST no implementado
export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'Método no implementado'
  }, { status: 405 })
}