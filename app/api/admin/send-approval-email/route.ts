import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendApprovalEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json()

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID requerido' },
        { status: 400 }
      )
    }

    // Obtener datos del lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    if (!lead.email) {
      return NextResponse.json(
        { success: false, error: 'El lead no tiene un email registrado' },
        { status: 400 }
      )
    }

    // ✅ USAR plazo DEL LEAD (o 36 por defecto)
    const monto = lead.estimatedAmount || 50000
    const plazo = (lead as any).plazo || 36
    const tasa = lead.creditType === 'CRYPTO' ? 5.4 : 11.0
    
    const tasaMensual = tasa / 100 / 12
    const pagoMensual = (monto * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                        (Math.pow(1 + tasaMensual, plazo) - 1)

    console.log('📊 Valores calculados:', {
      monto,
      plazo,
      tasa,
      pagoMensual: Math.round(pagoMensual)
    })

    const mensajePersonalizado = `
      ¡Tu crédito por $${monto.toLocaleString('es-MX')} ha sido aprobado!
      
      📋 Detalles de tu crédito:
      • Monto aprobado: $${monto.toLocaleString('es-MX')}
      • Pago mensual estimado: $${Math.round(pagoMensual).toLocaleString('es-MX')}
      • Plazo: ${plazo} meses
      • Tasa de interés anual: ${tasa}%
      
      Comunícate a la Oficina Virtual para recibir los detalles finales y completar el proceso.
    `.trim()

    // Enviar correo
    try {
      await sendApprovalEmail({
        to: lead.email,
        nombre: lead.fullName,
        leadId: lead.id,
        monto: monto,
        tipoCredito: lead.creditType || 'TRADITIONAL',
        mensajePersonalizado: mensajePersonalizado
      })
      
      console.log('✅ Correo de aprobación enviado a:', lead.email)
    } catch (emailError: any) {
      console.error('❌ Error enviando correo:', emailError)
      return NextResponse.json({
        success: false,
        error: `Error al enviar el correo: ${emailError.message}`
      }, { status: 500 })
    }

    // Actualizar estado del lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        status: 'APPROVED',
        approvedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Correo de aprobación enviado correctamente'
    })

  } catch (error) {
    console.error('❌ Error en aprobación:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}