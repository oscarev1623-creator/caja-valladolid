import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import sgMail from '@sendgrid/mail'

const prisma = new PrismaClient()

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, estimatedAmount, creditType, message } = await request.json()

    console.log('📥 Datos recibidos:', { firstName, lastName, email, phone, estimatedAmount, creditType })

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !phone || !estimatedAmount) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`.trim()
    const uniqueToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const mappedCreditType = creditType === 'crypto' ? 'CRYPTO' : 'TRADITIONAL'

    // Crear el lead
    const lead = await prisma.lead.create({
      data: {
        fullName,
        firstName,
        lastName,
        email,
        phone,
        estimatedAmount: parseFloat(estimatedAmount),
        creditType: mappedCreditType,
        message: message || '',
        uniqueToken,
        tokenExpiresAt: expiresAt,
        status: 'PENDING_DOCUMENTS',
        source: 'CALCULATOR'
      }
    })

    console.log('✅ Lead creado:', lead.id)

    // Crear ticket para el enlace de documentos
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const documentLink = `${process.env.NEXT_PUBLIC_URL || 'https://www.cajavalladolid.com'}/formulario-documentos/${uniqueToken}`

    await prisma.ticket.create({
      data: {
        ticketNumber,
        leadId: lead.id,
        uniqueToken,
        linkUrl: documentLink,
        expiresAt,
        status: 'PENDING',
        priority: 'MEDIUM',
      }
    })

    console.log('✅ Ticket creado:', ticketNumber)

    // ============================================
    // ENVÍO DE CORREO CON SENDGRID
    // ============================================
    console.log('📧 Enviando correo con SendGrid...')
    console.log('📧 Email destino:', email)

    const whatsappNumber = "529541184165"
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola%2C%20soy%20${firstName}%20${lastName}%20y%20quiero%20información%20sobre%20mi%20solicitud`

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Caja Valladolid</h1>
          <p style="color: #e6fffa; margin: 10px 0 0;">Tu aliado financiero de confianza</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1e293b; margin-top: 0;">¡Hola ${firstName}! 👋</h2>
          
          <p style="color: #334155; line-height: 1.6;">¡Gracias por confiar en nosotros! Hemos recibido tu solicitud de crédito por <strong>$${parseFloat(estimatedAmount).toLocaleString('es-MX')}</strong>.</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="color: #065f46; margin: 0 0 10px; font-weight: bold;">📎 ¿Quieres agilizar tu proceso?</p>
            <p style="color: #065f46; margin: 0;">Sube tus documentos aquí:</p>
            <a href="${documentLink}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 15px 0 10px;">
              📄 Subir documentación
            </a>
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #1e40af; margin-bottom: 15px;">¿Prefieres hablar con un asesor?</p>
            <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold;">
              💬 Contactar por WhatsApp
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px;">
          
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            Caja Popular San Bernardino de Siena Valladolid<br>
            Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
            <span style="font-size: 10px;">Este es un correo automático, por favor no responder.</span>
          </p>
        </div>
      </div>
    `

    try {
      const msg = {
        to: email,
        from: 'contacto@cajavalladolid.com',
        subject: `✨ ¡Hola ${firstName}! Hemos recibido tu solicitud`,
        html: emailHtml,
      }

      await sgMail.send(msg)
      console.log('✅ Correo enviado con SendGrid!')
      
    } catch (emailError) {
      console.error('❌ Error enviando correo con SendGrid:', emailError)
      // No lanzamos error para que la solicitud no falle
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      token: uniqueToken,
      documentLink,
      message: 'Solicitud recibida. Revisa tu correo para continuar.'
    })

  } catch (error: any) {
    console.error('❌ Error general:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}