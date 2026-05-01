import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendReminderEmail } from '@/lib/email'

const prisma = new PrismaClient()

export const maxDuration = 300 // 5 minutos máximo

export async function GET(request: NextRequest) {
  try {
    // Verificar CRON_SECRET
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ CRON_SECRET inválido o faltante')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTestMode = process.env.TEST_MODE === 'true'
    const testEmail = process.env.TEST_EMAIL || 'oscarv1623@gmail.com'

    console.log('🚀 Iniciando envío de recordatorios automáticos')
    console.log('🧪 Modo prueba:', isTestMode ? 'ACTIVADO' : 'DESACTIVADO')

    // Buscar leads elegibles para recordatorio
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const eligibleLeads = await prisma.lead.findMany({
      where: {
        status: {
          in: ['PENDING', 'PENDING_DOCUMENTS', 'CONTACTED', 'APPROVED']
        },
        email: {
          not: null
        },
        OR: [
          { lastReminderSentAt: null },
          { lastReminderSentAt: { lt: threeDaysAgo } }
        ]
      },
      take: 25, // Máximo 25 por ejecución
      orderBy: {
        lastReminderSentAt: 'asc' // Priorizar los que nunca han recibido o los más antiguos
      }
    })

    console.log(`📧 Encontrados ${eligibleLeads.length} leads elegibles para recordatorio`)

    if (eligibleLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay leads elegibles para recordatorio',
        processed: 0
      })
    }

    // Procesar en lotes de 5 con pausa de 1 minuto entre lotes
    const batchSize = 5
    const batches: typeof eligibleLeads[] = []
    for (let i = 0; i < eligibleLeads.length; i += batchSize) {
      batches.push(eligibleLeads.slice(i, i + batchSize))
    }

    let totalProcessed = 0
    let totalSent = 0
    const results: Array<{
      leadId: string
      email: string | null
      status: string
      timestamp: string
      error?: string
    }> = []

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`📦 Procesando lote ${batchIndex + 1}/${batches.length} (${batch.length} leads)`)

      for (const lead of batch) {
        try {
          const emailToSend = isTestMode ? testEmail : lead.email!
          const recipientName = lead.fullName || 'Cliente'

          console.log(`📧 Enviando recordatorio a: ${emailToSend} (Lead: ${lead.id})`)

          await sendReminderEmail({
            to: emailToSend,
            nombre: recipientName
          })

          // Actualizar lastReminderSentAt
          await prisma.lead.update({
            where: { id: lead.id },
            data: { lastReminderSentAt: new Date() }
          })

          results.push({
            leadId: lead.id,
            email: isTestMode ? `${lead.email} → ${testEmail}` : lead.email,
            status: 'sent',
            timestamp: new Date().toISOString()
          })

          totalSent++
          console.log(`✅ Recordatorio enviado exitosamente a: ${emailToSend}`)

        } catch (error) {
          console.error(`❌ Error enviando recordatorio a lead ${lead.id}:`, error)
          results.push({
            leadId: lead.id,
            email: lead.email,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
        }

        totalProcessed++
      }

      // Pausa de 1 minuto entre lotes (excepto el último)
      if (batchIndex < batches.length - 1) {
        console.log('⏳ Esperando 1 minuto antes del siguiente lote...')
        await new Promise(resolve => setTimeout(resolve, 60000)) // 1 minuto
      }
    }

    console.log(`🎉 Proceso completado: ${totalSent}/${totalProcessed} recordatorios enviados exitosamente`)

    return NextResponse.json({
      success: true,
      message: `Recordatorios procesados: ${totalSent}/${totalProcessed} enviados`,
      processed: totalProcessed,
      sent: totalSent,
      testMode: isTestMode,
      results
    })

  } catch (error) {
    console.error('💥 Error en cron de recordatorios:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}