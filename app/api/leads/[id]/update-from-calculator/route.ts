import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { token, estimatedAmount, plazo, creditType, selectedCrypto } = await request.json()

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        calculatorToken: token,
        calculatorTokenExpiresAt: {
          gt: new Date()
        }
      }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        estimatedAmount,
        plazo,
        creditType,
        ...(selectedCrypto && { selectedCrypto }),
        status: 'PENDING_DOCUMENTS',
        calculatorToken: null,
        calculatorTokenExpiresAt: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitud actualizada correctamente',
      lead: updatedLead
    })

  } catch (error) {
    console.error('Error actualizando lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}