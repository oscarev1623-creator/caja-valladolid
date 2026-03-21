import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requerido' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.findFirst({
      where: {
        calculatorToken: token,
        calculatorTokenExpiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        estimatedAmount: true,
        creditType: true,
        plazo: true,
        selectedCrypto: true
      }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead
    })

  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}