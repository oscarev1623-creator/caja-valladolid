(()=>{var e={};e.id=7951,e.ids=[7951,3897],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{"use strict";e.exports=require("assert")},61282:e=>{"use strict";e.exports=require("child_process")},84770:e=>{"use strict";e.exports=require("crypto")},80665:e=>{"use strict";e.exports=require("dns")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},32694:e=>{"use strict";e.exports=require("http2")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},19801:e=>{"use strict";e.exports=require("os")},55315:e=>{"use strict";e.exports=require("path")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},11825:()=>{},11058:(e,t,o)=>{"use strict";o.r(t),o.d(t,{originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>u,serverHooks:()=>b,staticGenerationAsyncStorage:()=>x});var a={};o.r(a),o.d(a,{GET:()=>g,POST:()=>f});var r=o(49303),n=o(88716),i=o(60670),l=o(87070),s=o(72331),d=o(36119);let c=e=>e.headers.get("authorization")===`Bearer ${process.env.CRON_SECRET}`;function p(e,t){let o=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",a=`${o}/?chat_name=${encodeURIComponent(e)}`;return`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${"docs"===t?"⏳ Completa tu documentaci\xf3n para continuar":"\uD83D\uDCAC Tu solicitud est\xe1 en proceso"}</title>
      <style>
        body { 
          font-family: Arial, Helvetica, sans-serif; 
          background: #f4f7f6; 
          margin: 0; 
          padding: 20px; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
        }
        .header { 
          background: #059669; 
          padding: 40px 20px; 
          text-align: center; 
        }
        .header img {
          height: 80px;
          width: auto;
          margin-bottom: 15px;
        }
        .header h1 { 
          color: white; 
          margin: 10px 0 0; 
          font-size: 28px; 
          font-weight: bold; 
        }
        .header p {
          color: #d1fae5;
          margin: 8px 0 0;
          font-size: 16px;
        }
        .content { 
          padding: 30px; 
        }
        .content h2 {
          color: #059669;
          margin: 0 0 16px;
          font-size: 22px;
        }
        .content p {
          font-size: 16px;
          color: #374151;
          line-height: 1.6;
          margin: 16px 0;
        }
        .content .highlight {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .button { 
          display: inline-block; 
          background: #059669; 
          color: white !important; 
          padding: 14px 36px; 
          text-decoration: none; 
          border-radius: 50px; 
          font-weight: bold; 
          font-size: 16px;
          margin: 20px 0; 
          text-align: center;
        }
        .footer { 
          background: #f9fafb; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 4px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${o}/logotipo.png" alt="Caja Valladolid" />
          <h1>Oficina Virtual</h1>
          <p>Tu aliado financiero de confianza</p>
        </div>
        <div class="content">
          <h2>\xa1Hola ${e}! 👋</h2>
          <p>${"docs"===t?"Tu solicitud de cr\xe9dito est\xe1 en espera. Para continuar con la evaluaci\xf3n, necesitamos que completes la documentaci\xf3n pendiente.":"Tu solicitud de cr\xe9dito est\xe1 siendo procesada. Pronto un asesor se pondr\xe1 en contacto contigo."}</p>
          <div class="highlight">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ No dejes pasar esta oportunidad.</strong><br>
              Tu cr\xe9dito est\xe1 pre-aprobado y solo faltan unos detalles para continuar.
            </p>
          </div>
          <div style="text-align: center;">
            <a href="${a}" class="button">${"docs"===t?"\uD83D\uDCC4 Completar documentaci\xf3n":"\uD83D\uDCAC Hablar con un asesor"}</a>
          </div>
          <p style="font-size: 13px; color: #9ca3af; text-align: center;">
            Tus datos est\xe1n seguros con nosotros. Este es un correo autom\xe1tico, por favor no responder.
          </p>
        </div>
        <div class="footer">
          <p><strong>Caja Popular San Bernardino de Siena Valladolid</strong></p>
          <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          <p>\xa9 ${new Date().getFullYear()} Caja Valladolid. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `}async function g(e){try{if(!c(e))return console.log("❌ Intento de acceso no autorizado a cron de recordatorios"),l.NextResponse.json({error:"No autorizado"},{status:401});console.log("=".repeat(50)),console.log("\uD83D\uDE80 INICIANDO CRON DE RECORDATORIOS"),console.log("=".repeat(50));let t=new Date;t.setDate(t.getDate()-2);let o=new Date;o.setDate(o.getDate()-3);let a={pendingDocuments:0,pendingContact:0,errors:0,skipped:0};console.log("\uD83D\uDCCB Buscando leads con documentos pendientes...");let r=await s._.lead.findMany({where:{status:"PENDING_DOCUMENTS",documentsSubmitted:!1,createdAt:{lt:o},email:{not:null},OR:[{lastReminderSentAt:null},{lastReminderSentAt:{lt:t}}]},take:50});for(let e of(console.log(`📊 Encontrados ${r.length} leads con documentos pendientes`),r))try{if(!e.email){console.log(`⚠️ Lead ${e.id} sin email, saltando...`),a.skipped++;continue}await (0,d.Cz)({to:e.email,subject:"⏳ Tu cr\xe9dito est\xe1 en espera - Completa tu documentaci\xf3n",html:p(e.fullName,"docs")}),await s._.lead.update({where:{id:e.id},data:{lastReminderSentAt:new Date}}),a.pendingDocuments++,console.log(`✅ Recordatorio (docs) enviado a: ${e.email}`),await new Promise(e=>setTimeout(e,500))}catch(t){console.error(`❌ Error enviando a ${e.email}:`,t),a.errors++}console.log("\uD83D\uDCCB Buscando leads sin contactar...");let n=new Date;n.setDate(n.getDate()-2);let i=await s._.lead.findMany({where:{status:"PENDING_CONTACT",contactedAt:null,createdAt:{lt:n},email:{not:null},OR:[{lastReminderSentAt:null},{lastReminderSentAt:{lt:t}}]},take:50});for(let e of(console.log(`📊 Encontrados ${i.length} leads sin contactar`),i))try{if(!e.email){console.log(`⚠️ Lead ${e.id} sin email, saltando...`),a.skipped++;continue}await (0,d.Cz)({to:e.email,subject:"\uD83D\uDCAC Tu solicitud est\xe1 siendo procesada - Caja Valladolid",html:p(e.fullName,"contact")}),await s._.lead.update({where:{id:e.id},data:{lastReminderSentAt:new Date}}),a.pendingContact++,console.log(`✅ Recordatorio (contact) enviado a: ${e.email}`),await new Promise(e=>setTimeout(e,500))}catch(t){console.error(`❌ Error enviando a ${e.email}:`,t),a.errors++}return console.log("=".repeat(50)),console.log("\uD83C\uDFC1 CRON DE RECORDATORIOS COMPLETADO"),console.log(`📊 Resultados:`,a),console.log("=".repeat(50)),l.NextResponse.json({success:!0,message:"Recordatorios enviados correctamente",results:a,timestamp:new Date().toISOString()})}catch(e){return console.error("❌ Error fatal en cron de recordatorios:",e),l.NextResponse.json({success:!1,error:"Error interno del servidor",details:void 0},{status:500})}}async function f(e){return g(e)}let u=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/cron/send-reminders/route",pathname:"/api/cron/send-reminders",filename:"route",bundlePath:"app/api/cron/send-reminders/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\cron\\send-reminders\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:x,serverHooks:b}=u,h="/api/cron/send-reminders/route";function y(){return(0,i.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:x})}},36119:(e,t,o)=>{"use strict";o.d(t,{Cz:()=>g,Xt:()=>d,ir:()=>p,sendDocumentsReceivedEmail:()=>c});var a=o(55245),r=o(72880),n=o.n(r);n().setApiKey(process.env.SENDGRID_API_KEY||"");let i=a.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},tls:{rejectUnauthorized:!1}}),l=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",s=(e,t)=>`
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
              <img src="${l}/logotipo.png" alt="Caja Valladolid" style="height: 120px; width: auto; margin-bottom: 15px;" />
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
`;async function d({to:e,nombre:t,leadId:o,monto:a,tipoCredito:r,chatToken:d}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n v\xeda SendGrid a:",e);let c=a?`$${parseFloat(a.toString()).toLocaleString("es-MX")}`:"No especificado",p=d?`${l}/?chat_token=${d}`:`${l}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,g=`
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
        <td width="50%" align="right" style="border-bottom: 1px solid #e5e7eb;">#${o.slice(-8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid #e5e7eb;"><strong>Monto solicitado:</strong></td>
        <td align="right" style="border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">${c}</td>
      </tr>
      <tr>
        <td style="border-bottom: 1px solid #e5e7eb;"><strong>Tipo de cr\xe9dito:</strong></td>
        <td align="right" style="border-bottom: 1px solid #e5e7eb;">${"crypto"===r||"CRYPTO"===r?"Criptomonedas":"Tradicional"}</td>
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
  `;try{await n().send({to:e,from:"contacto@cajavalladolid.com",subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:s(g,"Solicitud recibida")}),console.log("✅ Correo enviado v\xeda SendGrid a:",e)}catch(t){console.error("❌ SendGrid fall\xf3, intentando con Zoho..."),await i.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:e,subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:s(g,"Solicitud recibida")}),console.log("✅ Correo enviado v\xeda Zoho a:",e)}}async function c({to:e,nombre:t,leadId:o}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n de documentos a:",e);let a=`${l}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,r=`
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
              <td width="50%" align="right">#${o.slice(-8).toUpperCase()}</td>
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
                <a href="${a}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Abrir Oficina Virtual</a>
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
  `;try{await n().send({to:e,from:"contacto@cajavalladolid.com",subject:"\uD83D\uDCC4 \xa1Documentos recibidos! Tu solicitud avanza",html:s(r,"Documentos recibidos")}),console.log("✅ Correo de documentos enviado a:",e)}catch(e){console.error("❌ Error enviando correo de documentos:",e)}}async function p({to:e,name:t,message:o,conversationId:a}){console.log("\uD83D\uDCE7 Enviando notificaci\xf3n de chat con conversationId:",a);let r=`${l}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}&conversation_id=${a}`;console.log("\uD83D\uDD17 chatUrl generado:",r);let n=`
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
                <p style="margin: 0; color: #059669; font-style: italic; font-size: 15px;">"${o}"</p>
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
                <a href="${r}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">💬 Responder en Oficina Virtual</a>
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
  `;try{await i.sendMail({from:'"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',to:e,subject:"\uD83D\uDCE9 Nuevo mensaje de tu asesor",html:s(n,"Nuevo mensaje")}),console.log("✅ Notificaci\xf3n enviada v\xeda Zoho a:",e)}catch(e){console.error("❌ Error enviando notificaci\xf3n:",e)}}async function g({to:e,subject:t,html:o}){try{await n().send({to:e,from:"contacto@cajavalladolid.com",subject:t,html:o})}catch{await i.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:e,subject:t,html:o})}}},72331:(e,t,o)=>{"use strict";o.d(t,{_:()=>a});let a=new(o(53524)).PrismaClient}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),a=t.X(0,[9276,5972,5245,2880],()=>o(11058));module.exports=a})();