import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 [formulario-externo-simple] Datos recibidos:', data)
    
    // Validaciones básicas
    if (!data.fullName && !data.nombre) {
      return NextResponse.json(
        { success: false, error: 'Nombre completo es requerido' },
        { status: 400 }
      )
    }
    
    if (!data.phone && !data.telefono) {
      return NextResponse.json(
        { success: false, error: 'Teléfono es requerido' },
        { status: 400 }
      )
    }

    // Preparar datos para el schema Lead
    const fullName = data.fullName || data.nombre || 'Cliente'
    const phone = data.phone || data.telefono
    const email = data.email || null
    const estimatedAmount = data.estimatedAmount || data.monto ? parseFloat(data.estimatedAmount || data.monto) : null
    const creditType = data.creditType || data.tipoCredito || 'TRADITIONAL'
    const selectedCrypto = data.selectedCrypto || null
    const plazo = data.plazo ? parseInt(data.plazo) : null
    const contactoPreferido = data.preferredContact || data.contactoPreferido || 'whatsapp'
    const message = data.message || data.mensaje || 'Pre-evaluación de crédito'
    
    // Determinar formType basado en creditType
    const formType = (creditType === 'crypto' || creditType === 'CRYPTO') 
      ? 'CRYPTO_PRE_EVALUATION' 
      : 'PRE_EVALUATION'
    
    // Mapear status inicial
    const status = 'PENDING_CONTACT'
    
    console.log('💾 Creando lead con datos:', {
      fullName, phone, email, estimatedAmount, creditType,
      selectedCrypto, plazo, contactoPreferido, formType, status
    })
    
    const lead = await prisma.lead.create({
      data: {
        fullName,
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || null,
        phone,
        email,
        estimatedAmount,
        creditType: creditType.toUpperCase(),
        selectedCrypto,
        plazo,
        contactoPreferido,
        message,
        formType,
        status,
        source: 'WEB_FORM'
      }
    })

    console.log('✅ Lead creado ID:', lead.id)

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Solicitud registrada correctamente. Un asesor se pondrá en contacto pronto.',
      data: {
        nombre: fullName,
        tipo: formType === 'CRYPTO_PRE_EVALUATION' ? 'Crédito en Criptomonedas' : 'Crédito Tradicional',
        asesorAsignado: 'Próximamente',
        siguientePaso: 'Recibirás un formulario completo para documentación'
      }
    })

  } catch (error: any) {
    console.error('❌ Error en formulario-externo-simple:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando la solicitud',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}