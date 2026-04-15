exports.id=3897,exports.ids=[3897],exports.modules={11825:()=>{},36119:(e,t,a)=>{"use strict";a.d(t,{Xt:()=>s,ir:()=>p,sendDocumentsReceivedEmail:()=>c});var o=a(55245),l=a(72880),i=a.n(l);i().setApiKey(process.env.SENDGRID_API_KEY||"");let n=o.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},tls:{rejectUnauthorized:!1}}),r=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",d=(e,t)=>`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e7eb;">
          <!-- Header con logo -->
          <tr>
            <td bgcolor="#059669" style="padding: 40px 20px; text-align: center; background-color: #059669;">
              <img src="${r}/logotipo.png" alt="Caja Valladolid" style="height: 120px; width: auto; margin-bottom: 15px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 28px; font-weight: bold;">Oficina Virtual</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">Tu aliado financiero de confianza</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">${e}</td>
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
                \xa9 ${new Date().getFullYear()} Caja Valladolid. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;async function s({to:e,nombre:t,leadId:a,monto:o,tipoCredito:l,chatToken:s}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n v\xeda SendGrid a:",e);let c=o?`$${parseFloat(o.toString()).toLocaleString("es-MX")}`:"No especificado",p=s?`${r}/?chat_token=${s}`:`${r}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,f=`
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 10px 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 20px;">
            <tr>
              <td align="center">
                <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 22px;">\xa1Hola ${t}! 👋</h2>
                <p style="color: #065f46; margin: 0; font-size: 16px;">Hemos recibido exitosamente tu solicitud de cr\xe9dito.</p>
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
        <td width="50%" style="border-bottom: 1px solid #e5e7eb;"><strong>N\xfamero de solicitud:</strong></td>
        <td width="50%" align="right" style="border-bottom: 1px solid #e5e7eb;">#${a.slice(-8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid #e5e7eb;"><strong>Monto solicitado:</strong></td>
        <td align="right" style="border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">${c}</td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid #e5e7eb;"><strong>Tipo de cr\xe9dito:</strong></td>
        <td align="right" style="border-bottom: 1px solid #e5e7eb;">${"crypto"===l||"CRYPTO"===l?"Criptomonedas":"Tradicional"}</td>
      </tr>
      <tr>
        <td><strong>Estado:</strong></td>
        <td align="right"><span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; font-size: 12px;">En evaluaci\xf3n</span></td>
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
                <a href="${p}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Iniciar conversaci\xf3n</a>
              </td>
            </tr>
          </table>
          <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 13px;">
            Tus datos ya estar\xe1n listos. Solo haz clic en "Iniciar conversaci\xf3n".
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 16px;" align="center">
          <p style="color: #065f46; margin: 0; font-size: 14px;">
            ⏳ <strong>Caja Valladolid est\xe1 evaluando tu solicitud.</strong>
          </p>
        </td>
      </tr>
    </table>
  `;try{await i().send({to:e,from:"contacto@cajavalladolid.com",subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:d(f,"Solicitud recibida")}),console.log("✅ Correo enviado v\xeda SendGrid a:",e)}catch(t){console.error("❌ SendGrid fall\xf3, intentando con Zoho..."),await n.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:e,subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:d(f,"Solicitud recibida")}),console.log("✅ Correo enviado v\xeda Zoho a:",e)}}async function c({to:e,nombre:t,leadId:a}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n de documentos a:",e);let o=`${r}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,l=`
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 10px 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 20px;">
            <tr>
              <td align="center">
                <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 22px;">📄 \xa1Documentos recibidos, ${t}!</h2>
                <p style="color: #065f46; margin: 0; font-size: 16px;">Hemos recibido correctamente toda tu documentaci\xf3n.</p>
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
              <td width="50%"><strong>N\xfamero de solicitud:</strong></td>
              <td width="50%" align="right">#${a.slice(-8).toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Fecha de recepci\xf3n:</strong></td>
              <td align="right">${new Date().toLocaleDateString("es-MX")}</td>
            </tr>
            <tr>
              <td><strong>Estado:</strong></td>
              <td align="right"><span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; font-size: 12px;">En an\xe1lisis</span></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 20px 0;">
      <tr>
        <td style="background-color: #fef3c7; border: 1px solid #fde68a; padding: 16px;" align="center">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ✅ <strong>Pr\xf3ximos pasos:</strong> Nuestro equipo analizar\xe1 tu informaci\xf3n y te contactar\xe1 en <strong>24-48 horas</strong>.
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; margin: 24px 0;">
      <tr>
        <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px;" align="center">
          <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">💬 \xbfTienes dudas?</h3>
          <p style="color: #1e40af; margin: 0 0 16px 0;">Habla directamente con tu asesor en la Oficina Virtual:</p>
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td align="center" bgcolor="#059669" style="padding: 14px 36px; background-color: #059669;">
                <a href="${o}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Abrir Oficina Virtual</a>
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
            🎯 <strong>Caja Valladolid est\xe1 procesando tu solicitud.</strong>
          </p>
        </td>
      </tr>
    </table>
  `;try{await i().send({to:e,from:"contacto@cajavalladolid.com",subject:"\uD83D\uDCC4 \xa1Documentos recibidos! Tu solicitud avanza",html:d(l,"Documentos recibidos")}),console.log("✅ Correo de documentos enviado a:",e)}catch(e){console.error("❌ Error enviando correo de documentos:",e)}}async function p({to:e,name:t,message:a,conversationId:o}){console.log("\uD83D\uDCE7 Enviando notificaci\xf3n de chat v\xeda Zoho a:",e);let l=`${r}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,i=`
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 10px 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 20px;">
            <tr>
              <td align="center">
                <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 22px;">💬 \xa1${t}, tienes un nuevo mensaje!</h2>
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
                <p style="margin: 0; color: #059669; font-style: italic; font-size: 15px;">"${a}"</p>
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
                <a href="${l}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Responder en Oficina Virtual</a>
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
  `;try{await n.sendMail({from:'"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',to:e,subject:"\uD83D\uDCE9 Nuevo mensaje de tu asesor",html:d(i,"Nuevo mensaje")}),console.log("✅ Notificaci\xf3n enviada v\xeda Zoho a:",e)}catch(e){console.error("❌ Error enviando notificaci\xf3n:",e)}}}};