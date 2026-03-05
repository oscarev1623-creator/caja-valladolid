import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 Datos recibidos del formulario 2:', data)
    
    // Validar datos
    if (!data.fullName || !data.phone || !data.email) {
      return NextResponse.json(
        { success: false, error: 'Nombre completo, teléfono y email son requeridos' },
        { status: 400 }
      )
    }

    // Determinar tipo de crédito
    const creditType = data.creditType === 'crypto' ? 'CRYPTO' : 
                      data.tipoCredito ? data.tipoCredito.toUpperCase() : 'TRADITIONAL'
    
    // Crear lead
    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        estimatedAmount: data.estimatedAmount ? parseFloat(data.estimatedAmount) : null,
        creditType: creditType,
        message: data.message || `Crédito ${creditType === 'CRYPTO' ? 'en criptomonedas' : 'tradicional'}. Contacto: ${data.preferredContact}`,
        contactoPreferido: data.preferredContact,
        selectedCrypto: data.selectedCrypto,
        plazo: data.plazo ? parseInt(data.plazo) : null,
        formType: 'CREDIT_DETAILED',
        source: 'LEAD_CAPTURE_FORM',
        status: creditType === 'CRYPTO' ? 'CRYPTO_INQUIRY' : 'PENDING_CONTACT'
      }
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Pre-evaluación recibida. Un asesor especializado se pondrá en contacto contigo.',
      data: {
        nombre: lead.fullName,
        tipo: creditType,
        asesor: creditType === 'CRYPTO' ? 'Especialista en Criptomonedas' : 'Asesor Financiero',
        contacto: lead.contactoPreferido
      }
    })

  } catch (error: any) {
    console.error('❌ Error en formulario-detallado:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando la pre-evaluación',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}