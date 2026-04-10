import nodemailer from 'nodemailer'

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Para evitar errores de certificado en Vercel
  }
})

// Verificar conexión al iniciar (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Error conectando al servidor SMTP:', error)
    } else {
      console.log('✅ Servidor SMTP listo para enviar mensajes')
    }
  })
}

// URL base para imágenes
const baseUrl = process.env.NEXTAUTH_URL || 'https://cajavalladolid.com'

// Template base para todos los correos
const getEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header con logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669, #047857); padding: 30px 20px; text-align: center;">
              <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" style="height: 60px; width: auto; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">Oficina Virtual</h1>
              <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 14px;">Tu aliado financiero de confianza</p>
            </td>
          </tr>
          
          <!-- Contenido -->
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                Caja Popular San Bernardino de Siena Valladolid
              </p>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                Registro Oficial: 29198 • CONDUSEF ID: 4930
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                Este es un correo automático, por favor no responder.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Aviso de privacidad -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
          <tr>
            <td style="text-align: center; padding: 10px;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                © ${new Date().getFullYear()} Caja Valladolid. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// Email de confirmación de solicitud
export async function sendConfirmationEmail({ to, nombre, leadId }: { to: string; nombre: string; leadId: string }) {
  console.log('📧 ========================================')
  console.log('📧 Intentando enviar correo de confirmación')
  console.log('📧 Destinatario:', to)
  console.log('📧 Nombre:', nombre)
  console.log('📧 Lead ID:', leadId)
  console.log('📧 SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD ? '***CONFIGURADO***' : '❌ NO CONFIGURADO'
  })
  
  const whatsappNumber = "529541184165"
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #059669; margin: 0 0 8px 0;">¡Hola ${nombre}! 👋</h2>
        <p style="color: #065f46; margin: 0; font-size: 16px;">Hemos recibido exitosamente tu solicitud de crédito.</p>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="color: #065f46; margin: 0 0 12px 0; font-size: 18px;">📋 Detalles de tu solicitud</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
            <strong>Número de solicitud:</strong>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            #${leadId.slice(-8).toUpperCase()}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
            <strong>Fecha de recepción:</strong>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${new Date().toLocaleDateString('es-MX')}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px;">
            <strong>Estado:</strong>
          </td>
          <td style="padding: 12px 16px; text-align: right;">
            <span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 20px; font-size: 12px;">En evaluación</span>
          </td>
        </tr>
      </table>
    </div>

<div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
  <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">💬 Oficina Virtual</h3>
  <p style="color: #1e40af; margin: 0 0 16px 0;">Habla directamente con un asesor en tiempo real:</p>
  <div style="text-align: center;">
    <a href="${baseUrl}" style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px;">
      💬 Abrir Oficina Virtual
    </a>
  </div>
</div>

    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 16px; text-align: center;">
      <p style="color: #065f46; margin: 0; font-size: 14px;">
        ⏳ <strong>Próximos pasos:</strong> Un asesor evaluará tu solicitud en <strong>24-48 horas</strong>
      </p>
    </div>
  `

  try {
    const info = await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to,
      subject: '✨ ¡Hola! Hemos recibido tu solicitud de crédito',
      html: getEmailTemplate(content, 'Solicitud de crédito recibida')
    })
    console.log('✅ Correo enviado exitosamente!')
    console.log('📧 Message ID:', info.messageId)
    console.log('📧 ========================================')
    return info
  } catch (error: any) {
    console.error('❌ ERROR SMTP DETALLADO:')
    console.error('❌ Mensaje:', error.message)
    console.error('❌ Código:', error.code)
    console.error('❌ Comando:', error.command)
    console.error('❌ Stack:', error.stack)
    console.error('📧 ========================================')
    throw error
  }
}

// Email de notificación de nuevo mensaje en el chat
export async function sendChatNotificationEmail({ to, name, message, conversationId }: { to: string; name: string; message: string; conversationId: string }) {
  console.log('📧 Enviando notificación de chat a:', to)
  
  const chatUrl = `${baseUrl}/`

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #059669; margin: 0 0 8px 0;">¡Hola ${name}! 👋</h2>
        <p style="color: #065f46; margin: 0; font-size: 16px;">Has recibido un nuevo mensaje de tu asesor en tu <strong>Oficina Virtual</strong>.</p>
      </div>
    </div>

    <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold;">📩 Mensaje:</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 16px; margin-top: 8px;">
        <p style="margin: 0; color: #059669; font-style: italic; font-size: 15px;">"${message}"</p>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${chatUrl}" style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px;">
        💬 Abrir Oficina Virtual
      </a>
    </div>

    <div style="background-color: #eff6ff; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px;">💡 Recuerda:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px;">
        <li style="margin-bottom: 8px;">✅ Tus mensajes quedan guardados</li>
        <li style="margin-bottom: 8px;">✅ Puedes volver cuando quieras</li>
        <li>✅ Los documentos que compartas están protegidos</li>
      </ul>
    </div>

    <div style="background-color: #fef3c7; border-radius: 12px; padding: 12px; text-align: center;">
      <p style="color: #92400e; margin: 0; font-size: 12px;">
        💡 <strong>Consejo:</strong> Puedes responder directamente desde la Oficina Virtual
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: '"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',
      to,
      subject: '📩 Nuevo mensaje de tu asesor',
      html: getEmailTemplate(content, 'Nuevo mensaje en tu Oficina Virtual')
    })
    console.log('✅ Notificación de chat enviada a:', to)
  } catch (error) {
    console.error('❌ Error enviando notificación de chat:', error)
  }
}

// Función genérica para enviar cualquier email
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to,
      subject,
      html: getEmailTemplate(html, subject)
    })
    console.log('✅ Email genérico enviado a:', to)
  } catch (error) {
    console.error('❌ Error enviando email genérico:', error)
  }
}