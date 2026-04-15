import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

// Verificar que la petición viene del cron job de Vercel
const isValidCronRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

// ============================================
// TEMPLATE DE CORREO DE RECORDATORIO
// ============================================
function getReminderEmailTemplate(nombre: string, type: 'docs' | 'contact') {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cajavalladolid.com'
  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(nombre)}`
  
  const title = type === 'docs' 
    ? '⏳ Completa tu documentación para continuar'
    : '💬 Tu solicitud está en proceso'
  
  const message = type === 'docs'
    ? 'Tu solicitud de crédito está en espera. Para continuar con la evaluación, necesitamos que completes la documentación pendiente.'
    : 'Tu solicitud de crédito está siendo procesada. Pronto un asesor se pondrá en contacto contigo.'
  
  const buttonText = type === 'docs'
    ? '📄 Completar documentación'
    : '💬 Hablar con un asesor'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, Helvetica, sans-serif; 
          background: #f4f7f6; 
          margin: 0; 
          padding: 20px; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
        }
        .header { 
          background: #059669; 
          padding: 40px 20px; 
          text-align: center; 
        }
        .header img {
          height: 80px;
          width: auto;
          margin-bottom: 15px;
        }
        .header h1 { 
          color: white; 
          margin: 10px 0 0; 
          font-size: 28px; 
          font-weight: bold; 
        }
        .header p {
          color: #d1fae5;
          margin: 8px 0 0;
          font-size: 16px;
        }
        .content { 
          padding: 30px; 
        }
        .content h2 {
          color: #059669;
          margin: 0 0 16px;
          font-size: 22px;
        }
        .content p {
          font-size: 16px;
          color: #374151;
          line-height: 1.6;
          margin: 16px 0;
        }
        .content .highlight {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .button { 
          display: inline-block; 
          background: #059669; 
          color: white !important; 
          padding: 14px 36px; 
          text-decoration: none; 
          border-radius: 50px; 
          font-weight: bold; 
          font-size: 16px;
          margin: 20px 0; 
          text-align: center;
        }
        .footer { 
          background: #f9fafb; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 4px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" />
          <h1>Oficina Virtual</h1>
          <p>Tu aliado financiero de confianza</p>
        </div>
        <div class="content">
          <h2>¡Hola ${nombre}! 👋</h2>
          <p>${message}</p>
          <div class="highlight">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ No dejes pasar esta oportunidad.</strong><br>
              Tu crédito está pre-aprobado y solo faltan unos detalles para continuar.
            </p>
          </div>
          <div style="text-align: center;">
            <a href="${chatUrl}" class="button">${buttonText}</a>
          </div>
          <p style="font-size: 13px; color: #9ca3af; text-align: center;">
            Tus datos están seguros con nosotros. Este es un correo automático, por favor no responder.
          </p>
        </div>
        <div class="footer">
          <p><strong>Caja Popular San Bernardino de Siena Valladolid</strong></p>
          <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          <p>© ${new Date().getFullYear()} Caja Valladolid. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ============================================
// ENDPOINT PRINCIPAL
// ============================================
export async function GET(request: NextRequest) {
  try {
    // Verificar autorización
    if (!isValidCronRequest(request)) {
      console.log('❌ Intento de acceso no autorizado a cron de recordatorios')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('='.repeat(50))
    console.log('🚀 INICIANDO CRON DE RECORDATORIOS')
    console.log('='.repeat(50))
    
    const today = new Date()
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    const results = {
      pendingDocuments: 0,
      pendingContact: 0,
      errors: 0,
      skipped: 0
    }

    // ============================================
    // 1. RECORDATORIO PARA LEADS CON DOCUMENTOS PENDIENTES
    // (Creados hace más de 3 días, sin documentos, último recordatorio hace más de 2 días o nunca)
    // ============================================
    console.log('📋 Buscando leads con documentos pendientes...')
    
    const pendingDocsLeads = await prisma.lead.findMany({
      where: {
        status: 'PENDING_DOCUMENTS',
        documentsSubmitted: false,
        createdAt: {
          lt: threeDaysAgo // Creados hace más de 3 días
        },
        email: { not: null },
        OR: [
          { lastReminderSentAt: null }, // Nunca se ha enviado recordatorio
          { lastReminderSentAt: { lt: twoDaysAgo } } // Último recordatorio hace más de 2 días
        ]
      },
      take: 50 // Límite por ejecución para no sobrecargar
    })

    console.log(`📊 Encontrados ${pendingDocsLeads.length} leads con documentos pendientes`)

    for (const lead of pendingDocsLeads) {
      try {
        if (!lead.email) {
          console.log(`⚠️ Lead ${lead.id} sin email, saltando...`)
          results.skipped++
          continue
        }
        
        await sendEmail({
          to: lead.email,
          subject: '⏳ Tu crédito está en espera - Completa tu documentación',
          html: getReminderEmailTemplate(lead.fullName, 'docs')
        })
        
        await prisma.lead.update({
          where: { id: lead.id },
          data: { lastReminderSentAt: new Date() }
        })
        
        results.pendingDocuments++
        console.log(`✅ Recordatorio (docs) enviado a: ${lead.email}`)
        
        // Pequeña pausa para no saturar el servidor de correo
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`❌ Error enviando a ${lead.email}:`, error)
        results.errors++
      }
    }

    // ============================================
    // 2. RECORDATORIO PARA LEADS SIN CONTACTAR
    // (Creados hace más de 2 días, sin contacto, último recordatorio hace más de 2 días o nunca)
    // ============================================
    console.log('📋 Buscando leads sin contactar...')
    
    const twoDaysAgoForContact = new Date()
    twoDaysAgoForContact.setDate(twoDaysAgoForContact.getDate() - 2)
    
    const pendingContactLeads = await prisma.lead.findMany({
      where: {
        status: 'PENDING_CONTACT',
        contactedAt: null,
        createdAt: {
          lt: twoDaysAgoForContact // Creados hace más de 2 días
        },
        email: { not: null },
        OR: [
          { lastReminderSentAt: null },
          { lastReminderSentAt: { lt: twoDaysAgo } }
        ]
      },
      take: 50
    })

    console.log(`📊 Encontrados ${pendingContactLeads.length} leads sin contactar`)

    for (const lead of pendingContactLeads) {
      try {
        if (!lead.email) {
          console.log(`⚠️ Lead ${lead.id} sin email, saltando...`)
          results.skipped++
          continue
        }
        
        await sendEmail({
          to: lead.email,
          subject: '💬 Tu solicitud está siendo procesada - Caja Valladolid',
          html: getReminderEmailTemplate(lead.fullName, 'contact')
        })
        
        await prisma.lead.update({
          where: { id: lead.id },
          data: { lastReminderSentAt: new Date() }
        })
        
        results.pendingContact++
        console.log(`✅ Recordatorio (contact) enviado a: ${lead.email}`)
        
        // Pequeña pausa para no saturar el servidor de correo
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`❌ Error enviando a ${lead.email}:`, error)
        results.errors++
      }
    }

    console.log('='.repeat(50))
    console.log('🏁 CRON DE RECORDATORIOS COMPLETADO')
    console.log(`📊 Resultados:`, results)
    console.log('='.repeat(50))

    return NextResponse.json({
      success: true,
      message: 'Recordatorios enviados correctamente',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error fatal en cron de recordatorios:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}

// ============================================
// También permitir POST para pruebas manuales
// ============================================
export async function POST(request: NextRequest) {
  return GET(request)
}