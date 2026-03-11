import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 [formulario-externo-cripto] Datos recibidos:', data)
    
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

    // Preparar datos para el schema Lead - SOLO USDT
    const fullName = data.fullName || data.nombre || 'Cliente'
    const phone = data.phone || data.telefono
    const email = data.email || null
    const montoUSDT = data.monto ? parseFloat(data.monto) : 10000 // ← SOLO USDT
    const plazo = data.plazo ? parseInt(data.plazo) : 12
    const contactoPreferido = data.preferredContact || data.contactoPreferido || 'whatsapp'
    const message = data.message || data.mensaje || 'Solicitud de crédito en USDT'
    
    console.log('💾 Creando lead cripto con datos:', {
      fullName, 
      phone, 
      email, 
      montoUSDT, 
      plazo, 
      contactoPreferido
    })
    
    const lead = await prisma.lead.create({
      data: {
        fullName,
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || null,
        phone,
        email,
        estimatedAmount: montoUSDT,
        creditType: 'CRYPTO',
        selectedCrypto: 'USDT', // ← SIEMPRE USDT
        plazo,
        contactoPreferido,
        message,
        formType: 'CRYPTO_EVALUATION',
        status: 'PENDING_CONTACT',
        source: 'CRYPTO_FORM'
      }
    })

    console.log('✅ Lead cripto creado ID:', lead.id)
    console.log('📊 Resumen:', {
      montoUSDT: montoUSDT,
      plazo: `${plazo} meses`
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Solicitud registrada correctamente. Un asesor especializado se pondrá en contacto pronto.',
      data: {
        nombre: fullName,
        tipo: 'Crédito en USDT',
        montoUSDT: montoUSDT,
        plazo: plazo,
        asesorAsignado: 'Próximamente'
      }
    })

  } catch (error: any) {
    console.error('❌ Error en formulario-externo-cripto:', error)
    
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