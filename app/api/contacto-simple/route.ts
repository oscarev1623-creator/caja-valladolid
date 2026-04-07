import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import sgMail from '@sendgrid/mail'

const prisma = new PrismaClient()

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 Datos recibidos del formulario:', data)
    
    // Validar campos requeridos
    if (!data.firstName || !data.email || !data.phone) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email y teléfono son requeridos' },
        { status: 400 }
      )
    }

    const fullName = `${data.firstName} ${data.lastName || ''}`.trim()
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.cajavalladolid.com'
    
    // Guardar en base de datos
    const lead = await prisma.lead.create({
      data: {
        fullName: fullName,
        firstName: data.firstName,
        lastName: data.lastName || null,
        phone: data.phone,
        email: data.email,
        message: data.message || 'Consulta general',
        formType: 'CONTACT_INQUIRY',
        source: 'CONTACT_FORM',
        status: 'CONTACT_INQUIRY'
      }
    })

    console.log('✅ Lead guardado:', lead.id)

    // ============================================
    // 📧 ENVIAR CORREO DE CONFIRMACIÓN AL CLIENTE (SendGrid)
    // ============================================
    try {
      const msg = {
        to: data.email,
        from: 'contacto@cajavalladolid.com',
        subject: `✨ Hola ${data.firstName}, hemos recibido tu mensaje`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de contacto</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" style="height: 60px; margin-bottom: 10px;" />
              <h1 style="color: #059669; margin: 0;">Caja Valladolid</h1>
              <p style="color: #065f46;">Tu aliado financiero de confianza</p>
            </div>

            <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
              <h2 style="color: #059669; margin-top: 0;">¡Hola ${data.firstName}! 👋</h2>
              <p style="font-size: 16px;">Hemos recibido tu mensaje correctamente.</p>
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

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>Caja Popular San Bernardino de Siena Valladolid</p>
              <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </body>
          </html>
        `
      }

      await sgMail.send(msg)
      console.log('✅ Correo de confirmación enviado a:', data.email)
      
    } catch (emailError) {
      console.error('❌ Error enviando correo de confirmación:', emailError)
    }

    // ============================================
    // 📧 ENVIAR CORREO AL ADMIN (NOTIFICACIÓN)
    // ============================================
    try {
      const adminMsg = {
        to: 'contacto@cajavalladolid.com',
        from: 'contacto@cajavalladolid.com',
        subject: `📩 Nuevo mensaje de ${fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #0d9488;">Nuevo mensaje de contacto</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Nombre:</td>
                <td style="padding: 8px 0;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Teléfono:</td>
                <td style="padding: 8px 0;">${data.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Mensaje:</td>
                <td style="padding: 8px 0;">${data.message || 'Consulta general'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">ID Lead:</td>
                <td style="padding: 8px 0;">${lead.id}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
              <a href="${baseUrl}/admin/chat?leadId=${lead.id}&email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(data.phone)}" style="color: #059669;">
                💬 Abrir conversación en Oficina Virtual
              </a>
            </div>
          </div>
        `
      }

      await sgMail.send(adminMsg)
      console.log('✅ Correo de notificación enviado al admin')
      
    } catch (emailError) {
      console.error('❌ Error enviando correo al admin:', emailError)
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Mensaje recibido. Nos pondremos en contacto pronto.',
      data: {
        nombre: fullName,
        tipo: 'Consulta general',
        prioridad: 'BAJA'
      }
    })

  } catch (error: any) {
    console.error('❌ Error en contacto-simple:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando el mensaje',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}