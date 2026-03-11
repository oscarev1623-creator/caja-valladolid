import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, telefono, email, curp, monto, tipoCredito, contactoPreferido, mensaje } = body

    // Validaciones básicas
    if (!nombre || !telefono || !email || !curp) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Generar token único
    const uniqueToken = randomBytes(20).toString('hex')
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30)

    // Crear lead
    const lead = await prisma.lead.create({
      data: {
        fullName: nombre,
        firstName: nombre.split(' ')[0] || '',
        lastName: nombre.split(' ').slice(1).join(' ') || null,
        phone: telefono,
        email: email,
        curp: curp,
        estimatedAmount: monto ? parseFloat(monto.replace(/[^0-9]/g, '')) : null,
        creditType: tipoCredito === 'crypto' ? 'CRYPTO' : 'TRADITIONAL',
        contactoPreferido: contactoPreferido,
        message: mensaje || 'Solicitud desde formulario unificado',
        formType: 'UNIFIED',
        status: 'PENDING_CONTACT',
        source: 'UNIFIED_FORM',
        uniqueToken: uniqueToken,
        tokenExpiresAt: tokenExpiresAt,
        tokenGeneratedAt: new Date(),
        documentsSubmitted: false
      }
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      token: uniqueToken,
      message: 'Lead creado exitosamente'
    })

  } catch (error: any) {
    console.error('Error creando lead:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}