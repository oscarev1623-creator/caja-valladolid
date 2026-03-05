// app/api/leads/verify-token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando token...')
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    console.log('📋 Token recibido:', token)

    if (!token) {
      console.log('❌ Token requerido')
      return NextResponse.json(
        { success: false, error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Buscar lead por token
    const lead = await prisma.lead.findFirst({
      where: {
        uniqueToken: token,
        tokenExpiresAt: {
          gt: new Date() // Token no expirado
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        estimatedAmount: true,
        creditType: true,
        documentsSubmitted: true,
        tokenExpiresAt: true,
        status: true,
        createdAt: true
      }
    })

    console.log('🔎 Lead encontrado:', lead?.id || 'No encontrado')

    if (!lead) {
      console.log('❌ Token inválido o expirado')
      return NextResponse.json(
        { success: false, error: 'Enlace inválido o expirado' },
        { status: 404 }
      )
    }

    if (lead.documentsSubmitted) {
      console.log('⚠️ Documentos ya enviados para lead:', lead.id)
    }

    console.log('✅ Token válido para:', lead.fullName)
    
    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        estimatedAmount: lead.estimatedAmount,
        creditType: lead.creditType,
        documentsSubmitted: lead.documentsSubmitted,
        expiresAt: lead.tokenExpiresAt,
        status: lead.status,
        createdAt: lead.createdAt
      }
    })

  } catch (error) {
    console.error('🔥 Error verificando token:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}