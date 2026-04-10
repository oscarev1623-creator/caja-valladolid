import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'

// Configurar SendGrid (más confiable para Vercel)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// Configurar transporter SMTP (Zoho) como respaldo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
})

const baseUrl = process.env.NEXTAUTH_URL || 'https://cajavalladolid.com'

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
          <!-- Header con logo GRANDE -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669, #047857); padding: 40px 20px; text-align: center;">
              <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" style="height: 180px; width: auto; margin-bottom: 15px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 28px; font-weight: bold;">Oficina Virtual</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">Tu aliado financiero de confianza</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">${content}</td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
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

// Email de confirmación - VERSIÓN FINAL
export async function sendConfirmationEmail({ 
  to, 
  nombre, 
  leadId, 
  monto, 
  tipoCredito 
}: { 
  to: string
  nombre: string
  leadId: string
  monto?: number | string
  tipoCredito?: string 
}) {
  console.log('📧 Enviando confirmación vía SendGrid a:', to)
  
  // Formatear monto
  const montoFormateado = monto 
    ? `$${parseFloat(monto.toString()).toLocaleString('es-MX')}` 
    : 'No especificado'
  
  const tipo = tipoCredito === 'crypto' || tipoCredito === 'CRYPTO' 
    ? 'Criptomonedas' 
    : 'Tradicional'

  // Enlace simple con datos en URL
  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(nombre)}&chat_email=${encodeURIComponent(to)}`

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
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;"><strong>Número de solicitud:</strong></td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">#${leadId.slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;"><strong>Monto solicitado:</strong></td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">${montoFormateado}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;"><strong>Tipo de crédito:</strong></td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">${tipo}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px;"><strong>Estado:</strong></td>
          <td style="padding: 12px 16px; text-align: right;"><span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 20px; font-size: 12px;">En evaluación</span></td>
        </tr>
      </table>
    </div>

    <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">💬 Oficina Virtual</h3>
      <p style="color: #1e40af; margin: 0 0 16px 0;">Habla directamente con un asesor en tiempo real:</p>
      <div style="text-align: center;">
        <a href="${chatUrl}" style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 14px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px;">
          💬 Iniciar conversación
        </a>
      </div>
      <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 13px; text-align: center;">
        Tus datos ya estarán listos. Solo haz clic en "Iniciar conversación".
      </p>
    </div>

    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 16px; text-align: center;">
      <p style="color: #065f46; margin: 0; font-size: 14px;">
        ⏳ <strong>Caja Valladolid está evaluando tu solicitud.</strong>
      </p>
    </div>
  `

  try {
    await sgMail.send({
      to,
      from: 'contacto@cajavalladolid.com',
      subject: '✨ ¡Hola! Hemos recibido tu solicitud de crédito',
      html: getEmailTemplate(content, 'Solicitud recibida')
    })
    console.log('✅ Correo enviado vía SendGrid a:', to)
  } catch (error: any) {
    console.error('❌ SendGrid falló, intentando con Zoho...')
    await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to,
      subject: '✨ ¡Hola! Hemos recibido tu solicitud de crédito',
      html: getEmailTemplate(content, 'Solicitud recibida')
    })
    console.log('✅ Correo enviado vía Zoho a:', to)
  }
}

// Chat - USA ZOHO
export async function sendChatNotificationEmail({ to, name, message, conversationId }: { to: string; name: string; message: string; conversationId: string }) {
  console.log('📧 Enviando notificación de chat vía Zoho a:', to)
  
  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(name)}&chat_email=${encodeURIComponent(to)}`

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: #059669; margin: 0 0 8px 0;">¡Hola ${name}! 👋</h2>
      <p style="color: #065f46; margin: 0; font-size: 16px;">Has recibido un nuevo mensaje de tu asesor.</p>
      <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0; color: #059669; font-style: italic;">"${message}"</p>
      </div>
      <a href="${chatUrl}" style="background: #059669; color: white; padding: 14px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
        💬 Responder en Oficina Virtual
      </a>
    </div>
  `

  try {
    await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to,
      subject: '📩 Nuevo mensaje de tu asesor',
      html: getEmailTemplate(content, 'Nuevo mensaje')
    })
    console.log('✅ Notificación enviada vía Zoho a:', to)
  } catch (error) {
    console.error('❌ Error enviando notificación:', error)
  }
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await sgMail.send({ to, from: 'contacto@cajavalladolid.com', subject, html })
  } catch {
    await transporter.sendMail({ from: '"Caja Valladolid" <contacto@cajavalladolid.com>', to, subject, html })
  }
}