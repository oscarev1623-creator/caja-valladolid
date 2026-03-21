import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { leadId, baseUrl } = await request.json()
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'ID del lead requerido' },
        { status: 400 }
      )
    }

    // Verificar que el lead existe
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Generar token único
    const uniqueToken = `lead_${leadId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Actualizar lead con el token
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        calculatorToken: uniqueToken,
        calculatorTokenExpiresAt: expiresAt
      }
    })

    const url = `${baseUrl || request.headers.get('origin') || ''}/completar-solicitud/${uniqueToken}`

    return NextResponse.json({
      success: true,
      data: {
        url,
        expiresAt: expiresAt.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error generando enlace:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}