import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import sgMail from '@sendgrid/mail'

const prisma = new PrismaClient()

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// Función para obtener el asesor con menos leads asignados
async function getBestAgent() {
  console.log('🔍 ====================')
  console.log('🔍 Buscando el mejor asesor para el lead...')
  
  const agents = await prisma.user.findMany({
    where: {
      role: 'agent',
      isActive: true
    }
  })

  const agentsWithLoad = await Promise.all(agents.map(async (agent) => {
    const leadCount = await prisma.lead.count({
      where: { assignedToId: agent.id }
    })
    console.log(`   📋 ${agent.name} tiene ${leadCount} leads asignados`)
    return { ...agent, currentLoad: leadCount }
  }))

  agentsWithLoad.sort((a, b) => a.currentLoad - b.currentLoad)
  
  const selected = agentsWithLoad[0]
  console.log(`✅ Asesor seleccionado: ${selected.name} (${selected.currentLoad} leads)`)
  console.log('🔍 ====================')
  
  return selected
}

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

    // Asignar asesor automáticamente
    const bestAgent = await getBestAgent()
    const assignedToId = bestAgent?.id || null

    // Crear el lead con asesor asignado
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
        source: 'CALCULATOR',
        assignedToId: assignedToId
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, color: true }
        }
      }
    })

    console.log(`✅ Lead creado con asesor: ${lead.assignedTo?.name || 'Sin asesor'}`)

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

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.cajavalladolid.com'

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de solicitud</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" style="height: 60px; margin-bottom: 10px;" />
          <h1 style="color: #059669; margin: 0;">Caja Valladolid</h1>
          <p style="color: #065f46;">Tu aliado financiero de confianza</p>
        </div>

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
          <h2 style="color: #059669; margin-top: 0;">¡Hola ${firstName} ${lastName}! 👋</h2>
          <p style="font-size: 16px;">Hemos recibido exitosamente tu solicitud de crédito por <strong>$${parseFloat(estimatedAmount).toLocaleString('es-MX')}</strong>.</p>
        </div>

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #065f46;">📎 ¿Quieres agilizar tu proceso?</h3>
          <p>Sube tus documentos aquí:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${documentLink}" style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
              📄 Subir documentación
            </a>
          </div>
        </div>

        <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-top: 0;">💬 Oficina Virtual</h3>
          <p>Puedes chatear directamente con tu asesor en nuestra Oficina Virtual:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
              💬 Abrir Oficina Virtual
            </a>
          </div>
        </div>

        <div style="background-color: #fef3c7; border-radius: 10px; padding: 16px; text-align: center;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ⏳ <strong>Próximos pasos:</strong> Un asesor evaluará tu solicitud en <strong>24-48 horas</strong>
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Caja Popular San Bernardino de Siena Valladolid</p>
          <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          <p>Este es un correo automático, por favor no responder.</p>
        </div>
      </body>
      </html>
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