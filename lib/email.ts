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
// 🎨 TEMPLATE BASE - DISEÑO PREMIUM
// ============================================
const getEmailTemplate = (content: string, title: string, variant: 'default' | 'success' | 'warning' | 'crypto' = 'default') => {
  
  const gradients = {
    default: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
    crypto: 'linear-gradient(135deg, #f7931a 0%, #f1c40f 50%, #e67e22 100%)'
  }

  const gradient = gradients[variant] || gradients.default

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title} | Caja Valladolid</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
    }
    
    .email-wrapper {
      background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%);
      padding: 40px 20px;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      border: 1px solid rgba(5, 150, 105, 0.1);
    }
    
    .header {
      background: ${gradient};
      padding: 48px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
      border-radius: 50%;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -5%;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      border-radius: 50%;
    }
    
    .logo-wrapper {
      position: relative;
      z-index: 10;
      margin-bottom: 24px;
    }
    
    .logo {
      max-width: 180px;
      height: auto;
      filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
      transition: transform 0.3s ease;
    }
    
    .logo:hover {
      transform: scale(1.02);
    }
    
    .company-name {
      color: #ffffff;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 8px;
    }
    
    .company-tagline {
      color: rgba(255, 255, 255, 0.95);
      font-size: 16px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 3px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .content {
      padding: 40px 32px;
      background: #ffffff;
    }
    
    .footer {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .footer-icon {
      width: 40px;
      height: 40px;
      background: ${gradient};
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 4px 10px rgba(5, 150, 105, 0.3);
    }
    
    .footer-text {
      color: #64748b;
      font-size: 13px;
      line-height: 1.8;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin: 16px 0;
      flex-wrap: wrap;
    }
    
    .footer-link {
      color: #059669;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .footer-link:hover {
      color: #047857;
      text-decoration: underline;
    }
    
    .copyright {
      color: #94a3b8;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    
    /* Estilos para el contenido */
    .greeting-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #86efac;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 28px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(5, 150, 105, 0.1);
    }
    
    .greeting-title {
      color: #065f46;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .greeting-subtitle {
      color: #047857;
      font-size: 15px;
      font-weight: 500;
    }
    
    .details-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 24px;
      margin: 24px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    
    .details-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .details-row:last-child {
      border-bottom: none;
    }
    
    .details-label {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }
    
    .details-value {
      color: #1f2937;
      font-size: 15px;
      font-weight: 600;
    }
    
    .amount-highlight {
      color: #059669;
      font-size: 22px;
      font-weight: 800;
    }
    
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-approved {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    
    .status-pending {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    
    .message-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
      border: 1px solid #fde68a;
      border-radius: 20px;
      padding: 24px;
      margin: 24px 0;
      position: relative;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
    }
    
    .message-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #92400e;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    
    .message-content {
      color: #78350f;
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    
    .cta-box {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #93c5fd;
      border-radius: 24px;
      padding: 32px 24px;
      margin: 32px 0 16px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
    }
    
    .cta-title {
      color: #1e40af;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .cta-subtitle {
      color: #3b82f6;
      font-size: 14px;
      margin-bottom: 24px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: #ffffff !important;
      text-decoration: none !important;
      font-weight: 700;
      font-size: 18px;
      padding: 18px 42px;
      border-radius: 60px;
      box-shadow: 0 10px 25px rgba(5, 150, 105, 0.35);
      transition: all 0.3s ease;
      border: none;
      text-align: center;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(5, 150, 105, 0.45);
      background: linear-gradient(135deg, #047857 0%, #065f46 100%);
    }
    
    .guarantee-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 24px;
      padding: 16px;
      background: #f0fdf4;
      border-radius: 16px;
      border: 1px dashed #6ee7b7;
    }
    
    .guarantee-icon {
      font-size: 24px;
    }
    
    .guarantee-text {
      color: #065f46;
      font-size: 13px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      
      <!-- Header Premium -->
      <div class="header">
        <div class="logo-wrapper">
          <img src="${baseUrl}/logotipo.png" alt="Caja Valladolid" class="logo" />
        </div>
        <div class="company-name">Caja Valladolid</div>
        <div class="company-tagline">Tu Aliado Financiero</div>
      </div>
      
      <!-- Contenido -->
      <div class="content">
        ${content}
      </div>
      
      <!-- Footer Premium -->
      <div class="footer">
        <div class="footer-logo">
          <div class="footer-icon">CV</div>
          <span style="font-weight: 700; color: #1f2937; font-size: 16px;">Caja Popular Valladolid</span>
        </div>
        
        <div class="footer-text">
          San Bernardino de Siena<br>
          Registro Oficial: 29198 • CONDUSEF ID: 4930
        </div>
        
               <div class="footer-links" style="display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin: 16px 0;">
          <a href="${baseUrl}" class="footer-link" style="color: #059669; text-decoration: none; font-weight: 500;">Inicio</a>
          <span style="color: #cbd5e1; font-size: 8px; margin: 0 4px;">●</span>
          <a href="${baseUrl}/privacidad" class="footer-link" style="color: #059669; text-decoration: none; font-weight: 500;">Privacidad</a>
          <span style="color: #cbd5e1; font-size: 8px; margin: 0 4px;">●</span>
          <a href="${baseUrl}/terminos" class="footer-link" style="color: #059669; text-decoration: none; font-weight: 500;">Términos</a>
          <span style="color: #cbd5e1; font-size: 8px; margin: 0 4px;">●</span>
          <a href="${baseUrl}/contacto" class="footer-link" style="color: #059669; text-decoration: none; font-weight: 500;">Contacto</a>
        </div>
        
        <div class="copyright">
          © ${new Date().getFullYear()} Caja Popular San Bernardino de Siena Valladolid.<br>
          Todos los derechos reservados.
        </div>
      </div>
      
    </div>
  </div>
</body>
</html>
`
}

// ============================================
// 1. CORREO DE CONFIRMACIÓN DE SOLICITUD
// ============================================
export async function sendConfirmationEmail({ 
  to, 
  nombre, 
  leadId, 
  monto, 
  tipoCredito,
  chatToken
}: { 
  to: string
  nombre: string
  leadId: string
  monto?: number | string
  tipoCredito?: string
  chatToken?: string
}) {
  console.log('📧 Enviando confirmación vía SendGrid a:', to)
  
  const montoFormateado = monto 
    ? `$${parseFloat(monto.toString()).toLocaleString('es-MX')}` 
    : 'No especificado'
  
  const tipo = tipoCredito === 'crypto' || tipoCredito === 'CRYPTO' 
    ? 'Criptomonedas' 
    : 'Tradicional'

  const chatUrl = chatToken 
    ? `${baseUrl}/?chat_token=${chatToken}`
    : `${baseUrl}/?chat_name=${encodeURIComponent(nombre)}&chat_email=${encodeURIComponent(to)}`

  const content = `
    <div class="greeting-box">
      <div class="greeting-title">✨ ¡Hola ${nombre}!</div>
      <div class="greeting-subtitle">Hemos recibido exitosamente tu solicitud de crédito</div>
    </div>
    
    <div style="margin: 24px 0;">
      <h3 style="color: #1f2937; font-size: 18px; font-weight: 700; margin-bottom: 16px;">📋 Detalles de tu solicitud</h3>
    </div>
    
    <div class="details-card">
      <div class="details-row">
        <span class="details-label">Número de solicitud</span>
        <span class="details-value">#${leadId.slice(-8).toUpperCase()}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Monto solicitado</span>
        <span class="details-value amount-highlight">${montoFormateado}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Tipo de crédito</span>
        <span class="details-value">${tipo}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-pending">En evaluación</span></span>
      </div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">💬 Oficina Virtual</div>
      <div class="cta-subtitle">Habla directamente con un asesor en tiempo real</div>
      <a href="${chatUrl}" class="cta-button">Iniciar conversación</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">⏳</span>
      <span class="guarantee-text"><strong>Caja Valladolid está evaluando tu solicitud.</strong><br>Te notificaremos pronto.</span>
    </div>
  `

  const variant = tipoCredito === 'crypto' || tipoCredito === 'CRYPTO' ? 'crypto' : 'default'

  try {
    await sgMail.send({
      to,
      from: 'contacto@cajavalladolid.com',
      subject: '✨ ¡Hola! Hemos recibido tu solicitud de crédito',
      html: getEmailTemplate(content, 'Solicitud recibida', variant)
    })
    console.log('✅ Correo enviado vía SendGrid a:', to)
  } catch (error: any) {
    console.error('❌ SendGrid falló, intentando con Zoho...')
    await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to,
      subject: '✨ ¡Hola! Hemos recibido tu solicitud de crédito',
      html: getEmailTemplate(content, 'Solicitud recibida', variant)
    })
    console.log('✅ Correo enviado vía Zoho a:', to)
  }
}

// ============================================
// 2. CORREO DE DOCUMENTOS RECIBIDOS
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
    <div class="greeting-box">
      <div class="greeting-title">📄 ¡Documentos recibidos, ${nombre}!</div>
      <div class="greeting-subtitle">Hemos recibido correctamente toda tu documentación</div>
    </div>
    
    <div class="details-card">
      <div class="details-row">
        <span class="details-label">Número de solicitud</span>
        <span class="details-value">#${leadId.slice(-8).toUpperCase()}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Fecha de recepción</span>
        <span class="details-value">${new Date().toLocaleDateString('es-MX')}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-pending">En análisis</span></span>
      </div>
    </div>
    
    <div class="message-box">
      <div class="message-label">✅ Próximos pasos</div>
      <div class="message-content">
        Nuestro equipo analizará tu información y te contactará en <strong>24-48 horas</strong>.
      </div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">💬 ¿Tienes dudas?</div>
      <div class="cta-subtitle">Habla directamente con tu asesor en la Oficina Virtual</div>
      <a href="${chatUrl}" class="cta-button">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">🎯</span>
      <span class="guarantee-text"><strong>Caja Valladolid está procesando tu solicitud.</strong></span>
    </div>
  `

  try {
    await sgMail.send({
      to,
      from: 'contacto@cajavalladolid.com',
      subject: '📄 ¡Documentos recibidos! Tu solicitud avanza',
      html: getEmailTemplate(content, 'Documentos recibidos', 'success')
    })
    console.log('✅ Correo de documentos enviado a:', to)
  } catch (error) {
    console.error('❌ Error enviando correo de documentos:', error)
  }
}

// ============================================
// 3. CORREO DE NOTIFICACIÓN DE CHAT
// ============================================
export async function sendChatNotificationEmail({ to, name, message, conversationId }: { to: string; name: string; message: string; conversationId: string }) {
  console.log('📧 Enviando notificación de chat con conversationId:', conversationId)
  
  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(name)}&chat_email=${encodeURIComponent(to)}&conversation_id=${conversationId}`
  
  const content = `
    <div class="greeting-box">
      <div class="greeting-title">💬 ¡${name}, tienes un nuevo mensaje!</div>
      <div class="greeting-subtitle">Tu asesor te ha respondido en la Oficina Virtual</div>
    </div>
    
    <div class="message-box">
      <div class="message-label">📩 Mensaje de tu asesor</div>
      <div class="message-content">"${message}"</div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">Responder ahora</div>
      <div class="cta-subtitle">Continúa la conversación en la Oficina Virtual</div>
      <a href="${chatUrl}" class="cta-button">Responder en Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">💡</span>
      <span class="guarantee-text">Tus mensajes quedan guardados. Puedes volver cuando quieras.</span>
    </div>
  `

  try {
    await transporter.sendMail({
      from: '"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',
      to,
      subject: '📩 Nuevo mensaje de tu asesor',
      html: getEmailTemplate(content, 'Nuevo mensaje', 'default')
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

// ============================================
// 5. 🎉 CORREO DE APROBACIÓN DE CRÉDITO (PREMIUM)
// ============================================
export async function sendApprovalEmail({ 
  to, 
  nombre, 
  leadId,
  monto, 
  tipoCredito,
  mensajePersonalizado 
}: { 
  to: string
  nombre: string
  leadId?: string
  monto?: number | string
  tipoCredito?: string
  mensajePersonalizado?: string
}) {
  console.log('📧 Enviando correo de APROBACIÓN a:', to)
  
  const montoFormateado = monto 
    ? `$${parseFloat(monto.toString()).toLocaleString('es-MX')}` 
    : 'No especificado'
  
  const tipo = tipoCredito === 'crypto' || tipoCredito === 'CRYPTO' 
    ? 'Criptomonedas' 
    : 'Tradicional'

  const chatUrl = `${baseUrl}/?chat_name=${encodeURIComponent(nombre)}&chat_email=${encodeURIComponent(to)}`

  const contenidoMensaje = mensajePersonalizado || '¡Felicidades! Tu crédito ha sido aprobado. Un asesor te contactará para finalizar el proceso.'

  const content = `
    <div class="greeting-box" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-color: #6ee7b7;">
      <div class="greeting-title" style="color: #065f46; font-size: 28px;">🎉 ¡Felicidades, ${nombre}!</div>
      <div class="greeting-subtitle" style="color: #047857; font-size: 18px; font-weight: 600;">Tu crédito ha sido <strong>APROBADO</strong></div>
    </div>
    
    <div class="details-card" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
      ${leadId ? `
      <div class="details-row">
        <span class="details-label">Número de solicitud</span>
        <span class="details-value">#${leadId.slice(-8).toUpperCase()}</span>
      </div>
      ` : ''}
      <div class="details-row">
        <span class="details-label">Monto aprobado</span>
        <span class="details-value amount-highlight" style="font-size: 26px;">${montoFormateado}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Tipo de crédito</span>
        <span class="details-value">${tipo}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-approved">✅ APROBADO</span></span>
      </div>
    </div>
    
    <div class="message-box" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
      <div class="message-label">📝 Mensaje de tu asesor</div>
      <div class="message-content" style="font-size: 16px;">${contenidoMensaje}</div>
    </div>
    
    <div class="cta-box" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 36px 24px;">
      <div class="cta-title" style="font-size: 22px;">💬 Comunícate a la Oficina Virtual</div>
      <div class="cta-subtitle" style="font-size: 15px;">Habla directamente con tu asesor para finalizar el proceso</div>
      <a href="${chatUrl}" class="cta-button" style="font-size: 20px; padding: 20px 48px;">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-color: #059669;">
      <span class="guarantee-icon" style="font-size: 28px;">🎯</span>
      <span class="guarantee-text" style="font-size: 15px; font-weight: 700;">¡Estás a un paso de recibir tu crédito!</span>
    </div>
  `

  const variant = tipoCredito === 'crypto' || tipoCredito === 'CRYPTO' ? 'crypto' : 'success'

  try {
    await sgMail.send({
      to,
      from: 'Caja Valladolid <contacto@cajavalladolid.com>',
      subject: '🎉 ¡Felicidades! Tu crédito ha sido APROBADO',
      html: getEmailTemplate(content, 'Crédito Aprobado', variant)
    })
    console.log('✅ Correo de aprobación enviado vía SendGrid a:', to)
  } catch (error: any) {
    console.error('❌ SendGrid falló, intentando con Zoho...')
    await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to,
      subject: '🎉 ¡Felicidades! Tu crédito ha sido APROBADO',
      html: getEmailTemplate(content, 'Crédito Aprobado', variant)
    })
    console.log('✅ Correo de aprobación enviado vía Zoho a:', to)
  }
}


// Última actualización: Abril 2026 - Sistema de emails premium