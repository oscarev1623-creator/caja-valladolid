"use strict";exports.id=6119,exports.ids=[6119],exports.modules={36119:(a,e,t)=>{t.d(e,{Xt:()=>r,Y3:()=>c,cC:()=>g,ir:()=>p,kd:()=>f,sv:()=>u});var s=t(55245);let o=s.createTransport({host:"smtp.zeptomail.com",port:587,secure:!1,auth:{user:"emailapikey",pass:process.env.ZEPTOMAIL_TOKEN||""},tls:{rejectUnauthorized:!1,minVersion:"TLSv1.2"}}),i=s.createTransport({host:process.env.SMTP_HOST||"smtp.zoho.com",port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER||"contacto@cajavalladolid.com",pass:process.env.SMTP_PASSWORD||"cjbC5QBeSFd6"},tls:{rejectUnauthorized:!1}}),n=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",d=(a,e,t="default")=>{let s={default:"linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)",success:"linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",warning:"linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",crypto:"linear-gradient(135deg, #f7931a 0%, #f1c40f 50%, #e67e22 100%)"},o=s[t]||s.default;return`
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
      background: ${o};
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
          <img src="${n}/logotipo.png" alt="Caja Valladolid" class="logo" />
        </div>
        <div class="company-name">Caja Valladolid</div>
        <div class="company-tagline">Tu Aliado Financiero</div>
      </div>
      
      <!-- Contenido -->
      <div class="content">
        ${a}
      </div>
      
      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <img src="${n}/logotipo.png" alt="Caja Valladolid" width="50" style="width: 50px; height: auto; display: inline-block;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="font-family: Arial, Helvetica, sans-serif; font-weight: 700; color: #1f2937; font-size: 16px;">Caja Popular Valladolid</span>
                </td>
              </tr>
            </table>
            
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
            
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-top: 16px; border-top: 1px solid #e2e8f0;">
                  <span style="font-family: Arial, Helvetica, sans-serif; color: #94a3b8; font-size: 11px;">
                    \xa9 ${new Date().getFullYear()} Caja Popular San Bernardino de Siena Valladolid.
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
`};async function l(a,e,t){console.log("\uD83D\uDCE7 Intentando enviar correo v\xeda ZeptoMail a:",a);try{return await o.sendMail({from:'"Caja Valladolid" <noreply@cajavalladolid.com>',to:a,subject:e,html:t}),console.log("✅ Correo enviado exitosamente v\xeda ZeptoMail a:",a),!0}catch(s){console.error("⚠️ ZeptoMail fall\xf3, intentando con Zoho...",s.message);try{return await i.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:a,subject:e,html:t}),console.log("✅ Correo enviado exitosamente v\xeda Zoho (respaldo) a:",a),!0}catch(a){throw console.error("❌ Ambos proveedores fallaron:",a.message),Error(`ZeptoMail: ${s.message} | Zoho: ${a.message}`)}}}async function r({to:a,nombre:e,leadId:t,monto:s,tipoCredito:o,chatToken:i}){console.log("\uD83D\uDCE7 Preparando confirmaci\xf3n para:",a);let r=s?`$${parseFloat(s.toString()).toLocaleString("es-MX")}`:"No especificado",c=i?`${n}/?chat_token=${i}`:`${n}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`;return l(a,"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",d(`
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
        <span class="details-value amount-highlight">${r}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Tipo de cr\xe9dito</span>
        <span class="details-value">${"crypto"===o||"CRYPTO"===o?"Criptomonedas":"Tradicional"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-pending">En evaluaci\xf3n</span></span>
      </div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">💬 Oficina Virtual</div>
      <div class="cta-subtitle">Habla directamente con un asesor en tiempo real</div>
      <a href="${c}" class="cta-button">Iniciar conversaci\xf3n</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">⏳</span>
      <span class="guarantee-text"><strong>Caja Valladolid est\xe1 evaluando tu solicitud.</strong><br>Te notificaremos pronto.</span>
    </div>
  `,"Solicitud recibida","crypto"===o||"CRYPTO"===o?"crypto":"default"))}async function c({to:a,nombre:e,leadId:t}){console.log("\uD83D\uDCE7 Preparando confirmaci\xf3n de documentos para:",a);let s=`${n}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`;return l(a,"\uD83D\uDCC4 \xa1Documentos recibidos! Tu solicitud avanza",d(`
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
      <a href="${s}" class="cta-button">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">🎯</span>
      <span class="guarantee-text"><strong>Caja Valladolid est\xe1 procesando tu solicitud.</strong></span>
    </div>
  `,"Documentos recibidos","success"))}async function p({to:a,name:e,message:t,conversationId:s}){console.log("\uD83D\uDCE7 Preparando notificaci\xf3n de chat para:",a);let o=`${n}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}&conversation_id=${s}`;return l(a,"\uD83D\uDCE9 Nuevo mensaje de tu asesor",d(`
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
      <a href="${o}" class="cta-button">Responder en Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">💡</span>
      <span class="guarantee-text">Tus mensajes quedan guardados. Puedes volver cuando quieras.</span>
    </div>
  `,"Nuevo mensaje","default"))}async function g({to:a,nombre:e}){console.log("\uD83D\uDCE7 Preparando recordatorio autom\xe1tico para:",a);let t=`${n}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`;return l(a,"⏳ Tu cr\xe9dito sigue activo - Caja Valladolid",d(`
    <div class="greeting-box" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-color: #86efac;">
      <div class="greeting-title" style="color: #065f46;">⏳ \xa1Hola ${e}!</div>
      <div class="greeting-subtitle" style="color: #047857;">Tu cr\xe9dito sigue activo en Caja Valladolid</div>
    </div>

    <div class="message-box" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
      <div class="message-label">📋 Estado de tu solicitud</div>
      <div class="message-content" style="font-size: 16px;">
        Tu solicitud de cr\xe9dito contin\xfaa en proceso de evaluaci\xf3n.
        Estamos trabajando para darte una respuesta lo antes posible.
      </div>
    </div>

    <div class="cta-box" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
      <div class="cta-title">💬 Oficina Virtual</div>
      <div class="cta-subtitle">Revisa el estado de tu solicitud o habla con un asesor</div>
      <a href="${t}" class="cta-button">Ir a la Oficina Virtual</a>
    </div>

    <div class="guarantee-badge" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-color: #6ee7b7;">
      <span class="guarantee-icon">⏱️</span>
      <span class="guarantee-text"><strong>Caja Valladolid est\xe1 evaluando tu solicitud.</strong><br>Te notificaremos pronto con una respuesta definitiva.</span>
    </div>
  `,"Recordatorio de cr\xe9dito activo","default"))}async function u({to:a,nombre:e,leadId:t,monto:s,tipoCredito:o,mensajePersonalizado:i}){console.log("\uD83D\uDCE7 Preparando correo de APROBACI\xd3N para:",a);let r=s?`$${parseFloat(s.toString()).toLocaleString("es-MX")}`:"No especificado",c=`${n}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`;return l(a,"\uD83C\uDF89 \xa1Felicidades! Tu cr\xe9dito ha sido APROBADO",d(`
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
        <span class="details-value amount-highlight" style="font-size: 26px;">${r}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Tipo de cr\xe9dito</span>
        <span class="details-value">${"crypto"===o||"CRYPTO"===o?"Criptomonedas":"Tradicional"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Estado</span>
        <span class="details-value"><span class="status-badge status-approved">✅ APROBADO</span></span>
      </div>
    </div>
    
    <div class="message-box" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
      <div class="message-label">📝 Mensaje de tu asesor</div>
      <div class="message-content" style="font-size: 16px;">${i||"\xa1Felicidades! Tu cr\xe9dito ha sido aprobado. Un asesor te contactar\xe1 para finalizar el proceso."}</div>
    </div>
    
    <div class="cta-box" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 36px 24px;">
      <div class="cta-title" style="font-size: 22px;">💬 Comun\xedcate a la Oficina Virtual</div>
      <div class="cta-subtitle" style="font-size: 15px;">Habla directamente con tu asesor para finalizar el proceso</div>
      <a href="${c}" class="cta-button" style="font-size: 20px; padding: 20px 48px;">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-color: #059669;">
      <span class="guarantee-icon" style="font-size: 28px;">🎯</span>
      <span class="guarantee-text" style="font-size: 15px; font-weight: 700;">\xa1Est\xe1s a un paso de recibir tu cr\xe9dito!</span>
    </div>
  `,"Cr\xe9dito Aprobado","crypto"===o||"CRYPTO"===o?"crypto":"success"))}async function f({to:a,nombre:e,leadId:t,pdfBuffer:s,filename:o}){console.log("\uD83D\uDCE7 Preparando env\xedo de contrato para:",a);let i=`${n}/?chat_name=${encodeURIComponent(e)}&chat_email=${encodeURIComponent(a)}`;return v(a,"\uD83D\uDCC4 Contrato de Cr\xe9dito - Caja Valladolid",d(`
    <div class="greeting-box">
      <div class="greeting-title">📄 \xa1${e}, aqu\xed est\xe1 tu contrato!</div>
      <div class="greeting-subtitle">Adjunto encontrar\xe1s el documento oficial de tu cr\xe9dito</div>
    </div>
    
    <div class="details-card">
      <div class="details-row">
        <span class="details-label">N\xfamero de solicitud</span>
        <span class="details-value">#${t.slice(-8).toUpperCase()}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Documento</span>
        <span class="details-value">${o}</span>
      </div>
    </div>
    
    <div class="message-box">
      <div class="message-label">📝 Instrucciones</div>
      <div class="message-content">
        Por favor revisa el contrato adjunto. Si tienes dudas, comun\xedcate con tu asesor en la Oficina Virtual.
      </div>
    </div>
    
    <div class="cta-box">
      <div class="cta-title">💬 \xbfDudas sobre el contrato?</div>
      <div class="cta-subtitle">Habla directamente con tu asesor</div>
      <a href="${i}" class="cta-button">Abrir Oficina Virtual</a>
    </div>
    
    <div class="guarantee-badge">
      <span class="guarantee-icon">🔒</span>
      <span class="guarantee-text"><strong>Documento oficial de Caja Valladolid.</strong></span>
    </div>
  `,"Contrato de Cr\xe9dito","success"),s,o)}async function v(a,e,t,s,n){console.log("\uD83D\uDCE7 Enviando correo con adjunto v\xeda ZeptoMail a:",a);try{return await o.sendMail({from:'"Caja Valladolid" <noreply@cajavalladolid.com>',to:a,subject:e,html:t,attachments:[{filename:n,content:s,contentType:"application/pdf"}]}),console.log("✅ Contrato enviado exitosamente v\xeda ZeptoMail a:",a),!0}catch(o){console.error("⚠️ ZeptoMail fall\xf3 con adjunto, intentando Zoho...");try{return await i.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:a,subject:e,html:t,attachments:[{filename:n,content:s,contentType:"application/pdf"}]}),console.log("✅ Contrato enviado v\xeda Zoho a:",a),!0}catch(a){throw console.error("❌ Ambos proveedores fallaron con adjunto"),Error("Error enviando contrato")}}}}};