import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendApprovalEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log('🚀 CORREO CRIPTO - INICIANDO...')
  
  try {
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { leadId } = await request.json()

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // ✅ VALIDAR QUE EL LEAD TENGA EMAIL
    if (!lead.email) {
      return NextResponse.json(
        { success: false, error: 'El lead no tiene un email registrado' },
        { status: 400 }
      )
    }

    // Obtener la criptomoneda seleccionada
    const criptoMoneda = lead.selectedCrypto || 'USDT'
    const montoUSDT = lead.estimatedAmount || 10000
    const plazo = lead.plazo || 12
    const tasa = 5.4 // 5.4% anual

    // Calcular pago mensual (SIN ANTICIPO)
    const tasaMensual = tasa / 100 / 12
    const pagoMensualUSDT = (montoUSDT * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                            (Math.pow(1 + tasaMensual, plazo) - 1)

    console.log('💰 Valores calculados:', {
      criptoMoneda,
      montoUSDT,
      plazo,
      tasa,
      pagoMensualUSDT: Math.round(pagoMensualUSDT)
    })

    // ✅ MENSAJE PERSONALIZADO
    const mensajePersonalizado = `
      ¡Tu crédito en ${criptoMoneda} por ${montoUSDT.toLocaleString('es-MX')} USDT ha sido aprobado!
      
      📋 Detalles de tu crédito:
      • Monto aprobado: ${montoUSDT.toLocaleString('es-MX')} USDT
      • Pago mensual estimado: ${Math.round(pagoMensualUSDT).toLocaleString('es-MX')} USDT
      • Plazo: ${plazo} meses
      • Tasa de interés anual: ${tasa}%
      
      Comunícate a la Oficina Virtual para recibir los detalles finales y completar el proceso.
    `.trim()

    // ✅ ENVIAR CORREO USANDO LA FUNCIÓN DE lib/email.ts
    try {
      await sendApprovalEmail({
        to: lead.email,
        nombre: lead.fullName,
        leadId: lead.id,
        monto: montoUSDT,
        tipoCredito: 'CRYPTO',
        mensajePersonalizado: mensajePersonalizado
      })
      
      console.log('✅ Correo cripto enviado a:', lead.email)
    } catch (emailError) {
      console.error('❌ Error enviando correo:', emailError)
      return NextResponse.json({
        success: false,
        error: 'Error al enviar el correo. Intenta de nuevo.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Correo cripto enviado correctamente'
    })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}