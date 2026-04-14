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

// ============================================
// TEMPLATE BASE - OPTIMIZADO PARA OUTLOOK
// ============================================
const getEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e7eb;">
          <!-- Header con logo -->
          <tr>
            <td bgcolor="#059669" style="padding: 40px 20px; text-align: center; background-color: #059669;">
              <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" style="height: 120px; width: auto; margin-bottom: 15px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 28px; font-weight: bold;">Oficina Virtual</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">Tu aliado financiero de confianza</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">${content}</td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                Caja Popular San Bernardino de Siena Valladolid
              </p>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                Registro Oficial: 29198 • CONDUSEF ID: 4930
              </p>
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

// ============================================
// 1. CORREO DE CONFIRMACIÓN DE SOLICITUD
// ============================================
export async function sendConfirmationEmail({ 
  to, 
  nombre, 
  leadId, 
  monto, 
  tipoCredito,
  chatToken  // ✅ NUEVO PARÁMETRO
}: { 
  to: string
  nombre: string
  leadId: string
  monto?: number | string
  tipoCredito?: string
  chatToken?: string  // ✅ NUEVO TIPO
}) {
  console.log('📧 Enviando confirmación vía SendGrid a:', to)
  
  const montoFormateado = monto 
    ? `$${parseFloat(monto.toString()).toLocaleString('es-MX')}` 
    : 'No especificado'
  
  const tipo = tipoCredito === 'crypto' || tipoCredito === 'CRYPTO' 
    ? 'Criptomonedas' 
    : 'Tradicional'

  // ✅ Enlace con token para chat automático (prioridad) o fallback a nombre/email
  const chatUrl = chatToken 
    ? `${baseUrl}/?chat_token=${chatToken}`
    : `${baseUrl}/?chat_name=${encodeURIComponent(nombre)}&chat_email=${encodeURIComponent(to)}`

  const content = `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 10px 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 20px;">
            <tr>
              <td align="center">
                <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 22px;">¡Hola ${nombre}! 👋</h2>
                <p style="color: #065f46; margin: 0; font-size: 16px;">Hemos recibido exitosamente tu solicitud de crédito.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 20px 0;">
      <tr>
        <td>
          <h3 style="color: #065f46; margin: 0 0 12px 0; font-size: 18px;">📋 Detalles de tu solicitud</h3>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="12" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; border: 1px solid #e5e7eb;">
      <tr>
        <td width="50%" style="border-bottom: 1px solid #e5e7eb;"><strong>Número de solicitud:</strong></td>
        <td width="50%" align="right" style="border-bottom: 1px solid #e5e7eb;">#${leadId.slice(-8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid #e5e7eb;"><strong>Monto solicitado:</strong></td>
        <td align="right" style="border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">${montoFormateado}</td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid #e5e7eb;"><strong>Tipo de crédito:</strong></td>
        <td align="right" style="border-bottom: 1px solid #e5e7eb;">${tipo}</td>
      </tr>
      <tr>
        <td><strong>Estado:</strong></td>
        <td align="right"><span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; font-size: 12px;">En evaluación</span></td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 24px 0;">
      <tr>
        <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px;" align="center">
          <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">💬 Oficina Virtual</h3>
          <p style="color: #1e40af; margin: 0 0 16px 0;">Habla directamente con un asesor en tiempo real:</p>
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" bgcolor="#059669" style="padding: 14px 36px; background-color: #059669;">
                <a href="${chatUrl}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Iniciar conversación</a>
              </td>
            </tr>
          </table>
          <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 13px;">
            Tus datos ya estarán listos. Solo haz clic en "Iniciar conversación".
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 16px;" align="center">
          <p style="color: #065f46; margin: 0; font-size: 14px;">
            ⏳ <strong>Caja Valladolid está evaluando tu solicitud.</strong>
          </p>
        </td>
      </tr>
    </table>
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

// ============================================
// 2. CORREO DE DOCUMENTOS RECIBIDOS (NUEVO - PROFESIONAL)
// ============================================
export async function sendDocumentsReceivedEmail({ 
  to, 
  nombre, 
  leadId 
}: { 
  to: string
  nombre: string
  leadId: string 
}) {
  console.log('📧 Enviando confirmación de documentos a:', to)
  
  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(nombre)}&chat_email=${encodeURIComponent(to)}`

  const content = `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 10px 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 20px;">
            <tr>
              <td align="center">
                <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 22px;">📄 ¡Documentos recibidos, ${nombre}!</h2>
                <p style="color: #065f46; margin: 0; font-size: 16px;">Hemos recibido correctamente toda tu documentación.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 20px 0;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px;">
          <table width="100%" cellpadding="8">
            <tr>
              <td width="50%"><strong>Número de solicitud:</strong></td>
              <td width="50%" align="right">#${leadId.slice(-8).toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Fecha de recepción:</strong></td>
              <td align="right">${new Date().toLocaleDateString('es-MX')}</td>
            </tr>
            <tr>
              <td><strong>Estado:</strong></td>
              <td align="right"><span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; font-size: 12px;">En análisis</span></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 20px 0;">
      <tr>
        <td style="background-color: #fef3c7; border: 1px solid #fde68a; padding: 16px;" align="center">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ✅ <strong>Próximos pasos:</strong> Nuestro equipo analizará tu información y te contactará en <strong>24-48 horas</strong>.
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 24px 0;">
      <tr>
        <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px;" align="center">
          <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">💬 ¿Tienes dudas?</h3>
          <p style="color: #1e40af; margin: 0 0 16px 0;">Habla directamente con tu asesor en la Oficina Virtual:</p>
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" bgcolor="#059669" style="padding: 14px 36px; background-color: #059669;">
                <a href="${chatUrl}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Abrir Oficina Virtual</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 16px;" align="center">
          <p style="color: #065f46; margin: 0; font-size: 14px;">
            🎯 <strong>Caja Valladolid está procesando tu solicitud.</strong>
          </p>
        </td>
      </tr>
    </table>
  `

  try {
    await sgMail.send({
      to,
      from: 'contacto@cajavalladolid.com',
      subject: '📄 ¡Documentos recibidos! Tu solicitud avanza',
      html: getEmailTemplate(content, 'Documentos recibidos')
    })
    console.log('✅ Correo de documentos enviado a:', to)
  } catch (error) {
    console.error('❌ Error enviando correo de documentos:', error)
  }
}

// ============================================
// 3. CORREO DE NOTIFICACIÓN DE CHAT (ASESOR RESPONDE)
// ============================================
export async function sendChatNotificationEmail({ to, name, message, conversationId }: { to: string; name: string; message: string; conversationId: string }) {
  console.log('📧 Enviando notificación de chat vía Zoho a:', to)
  
  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(name)}&chat_email=${encodeURIComponent(to)}`

  const content = `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 10px 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 20px;">
            <tr>
              <td align="center">
                <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 22px;">💬 ¡${name}, tienes un nuevo mensaje!</h2>
                <p style="color: #065f46; margin: 0; font-size: 16px;">Tu asesor te ha respondido en la Oficina Virtual.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 20px 0;">
      <tr>
        <td style="background-color: #f3f4f6; border: 1px solid #e5e7eb; padding: 20px;">
          <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold;">📩 Mensaje de tu asesor:</p>
          <table width="100%" cellpadding="16" style="background-color: #ffffff; border: 1px solid #e5e7eb;">
            <tr>
              <td>
                <p style="margin: 0; color: #059669; font-style: italic; font-size: 15px;">"${message}"</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 24px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" bgcolor="#059669" style="padding: 14px 36px; background-color: #059669;">
                <a href="${chatUrl}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Responder en Oficina Virtual</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px;">
          <p style="color: #1e40af; margin: 0; font-size: 13px; text-align: center;">
            💡 Tus mensajes quedan guardados. Puedes volver cuando quieras.
          </p>
        </td>
      </tr>
    </table>
  `

  try {
    await transporter.sendMail({
      from: '"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',
      to,
      subject: '📩 Nuevo mensaje de tu asesor',
      html: getEmailTemplate(content, 'Nuevo mensaje')
    })
    console.log('✅ Notificación enviada vía Zoho a:', to)
  } catch (error) {
    console.error('❌ Error enviando notificación:', error)
  }
}

// ============================================
// 4. CORREO GENÉRICO
// ============================================
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await sgMail.send({ to, from: 'contacto@cajavalladolid.com', subject, html })
  } catch {
    await transporter.sendMail({ from: '"Caja Valladolid" <contacto@cajavalladolid.com>', to, subject, html })
  }
}