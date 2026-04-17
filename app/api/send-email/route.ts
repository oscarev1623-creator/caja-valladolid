import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendDocumentsReceivedEmail, sendApprovalEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { to, nombre, tipo, leadId, monto, creditType } = await request.json()

    console.log('📧 [API] Recibida solicitud de email:', { to, nombre, tipo, leadId })

    // Validar que tengamos los datos mínimos
    if (!to || !nombre || !tipo) {
      console.error('❌ [API] Faltan datos requeridos:', { to, nombre, tipo })
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    if (tipo === 'documentos') {
      // ✅ Usar la función premium de lib/email.ts
      await sendDocumentsReceivedEmail({
        to,
        nombre,
        leadId: leadId || 'N/A'
      })
      
      console.log('✅ [API] Email de documentos enviado a:', to)
      
    } else if (tipo === 'aprobacion') {
      // ✅ Usar la función premium de lib/email.ts
      await sendApprovalEmail({
        to,
        nombre,
        leadId,
        monto: monto || 0,
        tipoCredito: creditType || 'TRADITIONAL',
        mensajePersonalizado: `¡Tu crédito por $${monto?.toLocaleString('es-MX') || '0'} ha sido aprobado! Comunícate a la Oficina Virtual para finalizar el proceso.`
      })
      
      console.log('✅ [API] Email de aprobación enviado a:', to)
      
    } else {
      return NextResponse.json({ error: 'Tipo de email no válido' }, { status: 400 })
    }

    // Actualizar lead si hay leadId
    if (leadId && leadId !== 'N/A') {
      try {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            emailSent: true,
            emailSentAt: new Date()
          }
        })
        console.log('✅ [API] Lead actualizado:', leadId)
      } catch (dbError) {
        console.error('⚠️ [API] Error actualizando lead:', dbError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado correctamente' 
    })

  } catch (error: any) {
    console.error('❌ [API] Error general:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Error al enviar correo' 
    }, { status: 500 })
  }
}