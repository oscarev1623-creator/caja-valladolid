exports.id=3897,exports.ids=[3897],exports.modules={11825:()=>{},36119:(a,e,t)=>{"use strict";t.d(e,{Cz:()=>g,Xt:()=>r,ir:()=>p,sendDocumentsReceivedEmail:()=>c,sv:()=>f});var o=t(55245),i=t(72880),s=t.n(i);s().setApiKey(process.env.SENDGRID_API_KEY||"");let n=o.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},tls:{rejectUnauthorized:!1}}),d=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",l=(a,e,t="default")=>{let o={default:"linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)",success:"linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",warning:"linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",crypto:"linear-gradient(135deg, #f7931a 0%, #f1c40f 50%, #e67e22 100%)"},i=o[t]||o.default;return`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${e} | Caja Valladolid</title>
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
      background: ${i};
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
      background: ${i};
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
          <img src="${d}/logotipo.png" alt="Caja Valladolid" class="logo" />
        </div>
        <div class="company-name">Caja Valladolid</div>
        <div class="company-tagline">Tu Aliado Financiero</div>
      </div>
      
      <!-- Contenido -->
      <div class="content">
        ${a}
      </div>
      
      <!-- Footer - 100% Compatible con todos los clientes de email -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            
            <!-- Logo y nombre en footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <img src="${d}/logotipo.png" alt="Caja Valladolid" width="50" style="width: 50px; height: auto; display: inline-block;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="font-family: Arial, Helvetica, sans-serif; font-weight: 700; color: #1f2937; font-size: 16px;">Caja Popular Valladolid</span>
                </td>
              </tr>
            </table>
            
            <!-- Informaci\xf3n de registro -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom: 4px;">
                  <span style="font-family: Arial, Helvetica, sans-serif; color: #64748b; font-size: 13px;">San Bernardino de Siena</span>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <span style="font-family: Arial, Helvetica, sans-serif; color: #64748b; font-size: 13px;">Registro Oficial: 29198 &nbsp;&nbsp;|&nbsp;&nbsp; CONDUSEF ID: 4930</span>
                </td>
              </tr>
            </table>
            
            <!-- Links de navegaci\xf3n -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <a href="${d}" style="font-family: Arial, Helvetica, sans-serif; color: #059669; text-decoration: none; font-weight: 500; font-size: 13px; margin: 0 8px;">Inicio</a>
                  <span style="color: #cbd5e1; font-size: 10px;">●</span>
                  <a href="${d}/privacidad" style="font-family: Arial, Helvetica, sans-serif; color: #059669; text-decoration: none; font-weight: 500; font-size: 13px; margin: 0 8px;">Privacidad</a>
                  <span style="color: #cbd5e1; font-size: 10px;">●</span>
                  <a href="${d}/terminos" style="font-family: Arial, Helvetica, sans-serif; color: #059669; text-decoration: none; font-weight: 500; font-size: 13px; margin: 0 8px;">T\xe9rminos</a>
                  <span style="color: #cbd5e1; font-size: 10px;">●</span>
                  <a href="${d}/contacto" style="font-family: Arial, Helvetica, sans-serif; color: #059669; text-decoration: none; font-weight: 500; font-size: 13px; margin: 0 8px;">Contacto</a>
                </td>
              </tr>
            </table>
            
            <!-- Copyright -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-top: 16px; border-top: 1px solid #e2e8f0;">
                  <span style="font-family: Arial, Helvetica, sans-serif; color: #94a3b8; font-size: 11px;">
                    \xa9 ${new Date().getFullYear()} Caja Popular San Bernardino de Siena Valladolid.
                  </span>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 4px;">
                  <span style="font-family: Arial, Helvetica, sans-serif; color: #94a3b8; font-size: 11px;">
                    Todos los derechos reservados.
                  </span>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
      
    </div>
  </div>
</body>
</html>
`};async function r({to:a,nombre:e,leadId:t,monto:o,tipoCredito:i,chatToken:r}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n v\xeda SendGrid a:",a);let c=o?`$${parseFloat(o.toString()).toLocaleString("es-MX")}`:"No especificado",p=r?`${d}/?chat_token=${r}`:`${d}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`,g=`
    <div class="greeting-box">
      <div class="greeting-title">✨ \xa1Hola ${e}!</div>
      <div class="greeting-subtitle">Hemos recibido exitosamente tu solicitud de cr\xe9dito</div>
    </div>
    
    <div style="margin: 24px 0;">
      <h3 style="color: #1f2937; font-size: 18px; font-weight: 700; margin-bottom: 16px;">📋 Detalles de tu solicitud</h3>
    </div>
    
    <div class="details-card">
      <div class="details-row">
        <span class="details-label">N\xfamero de solicitud</span>
        <span class="details-value">#${t.slice(-8).toUpperCase()}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Monto solicitado</span>
        <span class="details-value amount-highlight">${c}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Tipo de cr\xe9dito</span>
        <span class="details-value">${"crypto"===i||"CRYPTO"===i?"Criptomonedas":"Tradicional"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-pending">En evaluaci\xf3n</span></span>
      </div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">💬 Oficina Virtual</div>
      <div class="cta-subtitle">Habla directamente con un asesor en tiempo real</div>
      <a href="${p}" class="cta-button">Iniciar conversaci\xf3n</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">⏳</span>
      <span class="guarantee-text"><strong>Caja Valladolid est\xe1 evaluando tu solicitud.</strong><br>Te notificaremos pronto.</span>
    </div>
  `,f="crypto"===i||"CRYPTO"===i?"crypto":"default";try{await s().send({to:a,from:"contacto@cajavalladolid.com",subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:l(g,"Solicitud recibida",f)}),console.log("✅ Correo enviado v\xeda SendGrid a:",a)}catch(e){console.error("❌ SendGrid fall\xf3, intentando con Zoho..."),await n.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:a,subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:l(g,"Solicitud recibida",f)}),console.log("✅ Correo enviado v\xeda Zoho a:",a)}}async function c({to:a,nombre:e,leadId:t}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n de documentos a:",a);let o=`${d}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`,i=`
    <div class="greeting-box">
      <div class="greeting-title">📄 \xa1Documentos recibidos, ${e}!</div>
      <div class="greeting-subtitle">Hemos recibido correctamente toda tu documentaci\xf3n</div>
    </div>
    
    <div class="details-card">
      <div class="details-row">
        <span class="details-label">N\xfamero de solicitud</span>
        <span class="details-value">#${t.slice(-8).toUpperCase()}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Fecha de recepci\xf3n</span>
        <span class="details-value">${new Date().toLocaleDateString("es-MX")}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-pending">En an\xe1lisis</span></span>
      </div>
    </div>
    
    <div class="message-box">
      <div class="message-label">✅ Pr\xf3ximos pasos</div>
      <div class="message-content">
        Nuestro equipo analizar\xe1 tu informaci\xf3n y te contactar\xe1 en <strong>24-48 horas</strong>.
      </div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">💬 \xbfTienes dudas?</div>
      <div class="cta-subtitle">Habla directamente con tu asesor en la Oficina Virtual</div>
      <a href="${o}" class="cta-button">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">🎯</span>
      <span class="guarantee-text"><strong>Caja Valladolid est\xe1 procesando tu solicitud.</strong></span>
    </div>
  `;try{await n.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:a,subject:"\uD83D\uDCC4 \xa1Documentos recibidos! Tu solicitud avanza",html:l(i,"Documentos recibidos","success")}),console.log("✅ Correo de documentos enviado v\xeda Zoho a:",a)}catch(e){console.error("❌ Zoho fall\xf3, intentando con SendGrid..."),await s().send({to:a,from:"contacto@cajavalladolid.com",subject:"\uD83D\uDCC4 \xa1Documentos recibidos! Tu solicitud avanza",html:l(i,"Documentos recibidos","success")}),console.log("✅ Correo de documentos enviado v\xeda SendGrid a:",a)}}async function p({to:a,name:e,message:t,conversationId:o}){console.log("\uD83D\uDCE7 Enviando notificaci\xf3n de chat con conversationId:",o);let i=`${d}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}&conversation_id=${o}`,s=`
    <div class="greeting-box">
      <div class="greeting-title">💬 \xa1${e}, tienes un nuevo mensaje!</div>
      <div class="greeting-subtitle">Tu asesor te ha respondido en la Oficina Virtual</div>
    </div>
    
    <div class="message-box">
      <div class="message-label">📩 Mensaje de tu asesor</div>
      <div class="message-content">"${t}"</div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">Responder ahora</div>
      <div class="cta-subtitle">Contin\xfaa la conversaci\xf3n en la Oficina Virtual</div>
      <a href="${i}" class="cta-button">Responder en Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">💡</span>
      <span class="guarantee-text">Tus mensajes quedan guardados. Puedes volver cuando quieras.</span>
    </div>
  `;try{await n.sendMail({from:'"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',to:a,subject:"\uD83D\uDCE9 Nuevo mensaje de tu asesor",html:l(s,"Nuevo mensaje","default")}),console.log("✅ Notificaci\xf3n enviada v\xeda Zoho a:",a)}catch(a){console.error("❌ Error enviando notificaci\xf3n:",a)}}async function g({to:a,subject:e,html:t}){try{await s().send({to:a,from:"contacto@cajavalladolid.com",subject:e,html:t})}catch{await n.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:a,subject:e,html:t})}}async function f({to:a,nombre:e,leadId:t,monto:o,tipoCredito:i,mensajePersonalizado:r}){console.log("\uD83D\uDCE7 Enviando correo de APROBACI\xd3N a:",a);let c=o?`$${parseFloat(o.toString()).toLocaleString("es-MX")}`:"No especificado",p=`${d}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`,g=`
    <div class="greeting-box" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-color: #6ee7b7;">
      <div class="greeting-title" style="color: #065f46; font-size: 28px;">🎉 \xa1Felicidades, ${e}!</div>
      <div class="greeting-subtitle" style="color: #047857; font-size: 18px; font-weight: 600;">Tu cr\xe9dito ha sido <strong>APROBADO</strong></div>
    </div>
    
    <div class="details-card" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
      ${t?`
      <div class="details-row">
        <span class="details-label">N\xfamero de solicitud</span>
        <span class="details-value">#${t.slice(-8).toUpperCase()}</span>
      </div>
      `:""}
      <div class="details-row">
        <span class="details-label">Monto aprobado</span>
        <span class="details-value amount-highlight" style="font-size: 26px;">${c}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Tipo de cr\xe9dito</span>
        <span class="details-value">${"crypto"===i||"CRYPTO"===i?"Criptomonedas":"Tradicional"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-approved">✅ APROBADO</span></span>
      </div>
    </div>
    
    <div class="message-box" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
      <div class="message-label">📝 Mensaje de tu asesor</div>
      <div class="message-content" style="font-size: 16px;">${r||"\xa1Felicidades! Tu cr\xe9dito ha sido aprobado. Un asesor te contactar\xe1 para finalizar el proceso."}</div>
    </div>
    
    <div class="cta-box" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 36px 24px;">
      <div class="cta-title" style="font-size: 22px;">💬 Comun\xedcate a la Oficina Virtual</div>
      <div class="cta-subtitle" style="font-size: 15px;">Habla directamente con tu asesor para finalizar el proceso</div>
      <a href="${p}" class="cta-button" style="font-size: 20px; padding: 20px 48px;">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-color: #059669;">
      <span class="guarantee-icon" style="font-size: 28px;">🎯</span>
      <span class="guarantee-text" style="font-size: 15px; font-weight: 700;">\xa1Est\xe1s a un paso de recibir tu cr\xe9dito!</span>
    </div>
  `,f="crypto"===i||"CRYPTO"===i?"crypto":"success";try{await s().send({to:a,from:"Caja Valladolid <contacto@cajavalladolid.com>",subject:"\uD83C\uDF89 \xa1Felicidades! Tu cr\xe9dito ha sido APROBADO",html:l(g,"Cr\xe9dito Aprobado",f)}),console.log("✅ Correo de aprobaci\xf3n enviado v\xeda SendGrid a:",a)}catch(e){console.error("❌ SendGrid fall\xf3, intentando con Zoho..."),await n.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:a,subject:"\uD83C\uDF89 \xa1Felicidades! Tu cr\xe9dito ha sido APROBADO",html:l(g,"Cr\xe9dito Aprobado",f)}),console.log("✅ Correo de aprobaci\xf3n enviado v\xeda Zoho a:",a)}}}};