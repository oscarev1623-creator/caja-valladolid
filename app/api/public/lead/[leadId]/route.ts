import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        estimatedAmount: true,
        creditType: true,
        selectedCrypto: true, // ← CAMPO NUEVO (para cripto)
        plazo: true,           // ← CAMPO NUEVO (para cripto)
        status: true
      }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: lead
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    )
  }
}