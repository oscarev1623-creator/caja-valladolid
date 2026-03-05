import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }  // ← CORREGIDO: Promise
) {
  try {
    // OBTENER token con await (NUEVO)
    const { token } = await params
    
    console.log('🔍 Buscando lead con token único:', token)  // ← usar token, no params.token
    
    // Buscar lead por uniqueToken
    const lead = await prisma.lead.findFirst({
      where: { 
        uniqueToken: token,  // ← usar token
        // Opcional: verificar expiración
        OR: [
          { tokenExpiresAt: null },
          { tokenExpiresAt: { gt: new Date() } }
        ]
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        estimatedAmount: true,
        creditType: true,
        status: true,
        documentsSubmitted: true,
        createdAt: true,
        uniqueToken: true,
        tokenExpiresAt: true
      }
    })

    console.log('📋 Lead encontrado:', lead ? 'SÍ' : 'NO')

    if (!lead) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Enlace inválido o expirado. Contacta a tu asesor.' 
        },
        { status: 404 }
      )
    }

    // Verificar que el token no haya expirado
    if (lead.tokenExpiresAt && lead.tokenExpiresAt < new Date()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Este enlace ha expirado. Contacta a tu asesor para un nuevo enlace.' 
        },
        { status: 410 }
      )
    }

    // Verificar si ya envió documentos
    if (lead.documentsSubmitted) {
      return NextResponse.json({
        success: true,
        lead,
        message: 'Ya has enviado tu documentación',
        documentsSubmitted: true
      })
    }

    return NextResponse.json({
      success: true,
      lead,
      documentsSubmitted: false,
      tokenValid: true
    })

  } catch (error: any) {
    console.error('❌ Error verificando token:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()  // ← Buena práctica
  }
}