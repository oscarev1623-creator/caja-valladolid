import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

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
    // 📧 ENVIAR CORREO DE CONFIRMACIÓN AL CLIENTE
    // ============================================
    try {
      const whatsappNumber = "529541184165"
      const whatsappMessage = encodeURIComponent(
        `Hola, soy ${data.firstName}. Me contacté a través del formulario de la página web. Me gustaría obtener más información sobre los créditos.`
      )
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

      await transporter.sendMail({
        from: `"Caja Valladolid" <${process.env.SMTP_USER}>`,
        to: data.email,
        subject: `✨ Hola ${data.firstName}, hemos recibido tu mensaje`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Caja Valladolid</h1>
              <p style="color: #e6fffa; margin: 10px 0 0;">Tu aliado financiero de confianza</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1e293b; margin-top: 0;">¡Hola ${data.firstName}! 👋</h2>
              
              <p style="color: #334155; line-height: 1.6;">Hemos recibido tu mensaje correctamente. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.</p>
              
              <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 8px;">
                <p style="color: #065f46; margin: 0 0 10px; font-weight: bold;">📋 ¿Quieres agilizar el proceso?</p>
                <p style="color: #065f46; margin: 0;">Escríbenos directamente por WhatsApp para atención personalizada:</p>
                
                <a href="${whatsappLink}" 
                   style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0 10px;">
                  💬 Contactar por WhatsApp
                </a>
              </div>
              
              <p style="color: #334155;">Mientras tanto, si tienes más preguntas, no dudes en escribirnos.</p>
              
              <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
              
              <p style="font-size: 12px; color: #64748b; text-align: center;">
                Caja Popular San Bernardino de Siena Valladolid<br>
                Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
                <span style="font-size: 10px;">Este es un correo automático, por favor no responder.</span>
              </p>
            </div>
          </div>
        `
      })
      console.log('✅ Correo de confirmación enviado a:', data.email)
    } catch (emailError) {
      console.error('❌ Error enviando correo de confirmación:', emailError)
      // No fallamos la petición si el correo falla
    }

    // ============================================
    // 📧 ENVIAR CORREO AL ADMIN (NOTIFICACIÓN)
    // ============================================
    try {
      await transporter.sendMail({
        from: `"Formulario Web" <${process.env.SMTP_USER}>`,
        to: 'contacto@cajavalladolid.com',
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
              <a href="https://wa.me/${data.phone}" style="color: #059669;">💬 Contactar por WhatsApp</a>
            </div>
          </div>
        `
      })
      console.log('✅ Correo de notificación enviado al admin')
    } catch (emailError) {
      console.error('❌ Error enviando correo al admin:', emailError)
    }

    // ============================================
    // 📊 RESPUESTA EXITOSA
    // ============================================
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