(()=>{var e={};e.id=7333,e.ids=[7333,3897],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{"use strict";e.exports=require("assert")},61282:e=>{"use strict";e.exports=require("child_process")},84770:e=>{"use strict";e.exports=require("crypto")},80665:e=>{"use strict";e.exports=require("dns")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},32694:e=>{"use strict";e.exports=require("http2")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},19801:e=>{"use strict";e.exports=require("os")},55315:e=>{"use strict";e.exports=require("path")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},11825:()=>{},20528:(e,t,a)=>{"use strict";a.r(t),a.d(t,{originalPathname:()=>x,patchFetch:()=>b,requestAsyncStorage:()=>f,routeModule:()=>p,serverHooks:()=>u,staticGenerationAsyncStorage:()=>g});var o={};a.r(o),a.d(o,{POST:()=>c});var r=a(49303),i=a(88716),l=a(60670),n=a(87070),s=a(72331),d=a(36119);async function c(e){try{let{conversationId:t,message:a,senderType:o,fileUrl:r,fileType:i,fileName:l}=await e.json(),c=await s._.chatMessage.create({data:{conversationId:t,message:a||null,senderType:o,fileUrl:r||null,fileType:i||null,fileName:l||null,isRead:"agent"===o}});if(await s._.chatConversation.update({where:{id:t},data:{updatedAt:new Date}}),"agent"===o){let e=await s._.chatConversation.findUnique({where:{id:t},select:{userEmail:!0,userName:!0}});e?.userEmail&&await (0,d.ir)({to:e.userEmail,name:e.userName||"cliente",message:a||"Se ha adjuntado un documento",conversationId:t})}return n.NextResponse.json({success:!0,message:c},{headers:{"Cache-Control":"no-store, no-cache, must-revalidate",Pragma:"no-cache",Expires:"0"}})}catch(e){return console.error("Error sending message:",e),n.NextResponse.json({success:!1,error:"Error al enviar"},{status:500})}}let p=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/chat/send/route",pathname:"/api/chat/send",filename:"route",bundlePath:"app/api/chat/send/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\chat\\send\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:f,staticGenerationAsyncStorage:g,serverHooks:u}=p,x="/api/chat/send/route";function b(){return(0,l.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:g})}},36119:(e,t,a)=>{"use strict";a.d(t,{Xt:()=>d,ir:()=>p,sendDocumentsReceivedEmail:()=>c});var o=a(55245),r=a(72880),i=a.n(r);i().setApiKey(process.env.SENDGRID_API_KEY||"");let l=o.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},tls:{rejectUnauthorized:!1}}),n=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",s=(e,t)=>`
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
              <img src="${n}/logotipo.png" alt="Caja Valladolid" style="height: 120px; width: auto; margin-bottom: 15px;" />
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
`;async function d({to:e,nombre:t,leadId:a,monto:o,tipoCredito:r,chatToken:d}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n v\xeda SendGrid a:",e);let c=o?`$${parseFloat(o.toString()).toLocaleString("es-MX")}`:"No especificado",p=d?`${n}/?chat_token=${d}`:`${n}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,f=`
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
  `;try{await i().send({to:e,from:"contacto@cajavalladolid.com",subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:s(f,"Solicitud recibida")}),console.log("✅ Correo enviado v\xeda SendGrid a:",e)}catch(t){console.error("❌ SendGrid fall\xf3, intentando con Zoho..."),await l.sendMail({from:'"Caja Valladolid" <contacto@cajavalladolid.com>',to:e,subject:"✨ \xa1Hola! Hemos recibido tu solicitud de cr\xe9dito",html:s(f,"Solicitud recibida")}),console.log("✅ Correo enviado v\xeda Zoho a:",e)}}async function c({to:e,nombre:t,leadId:a}){console.log("\uD83D\uDCE7 Enviando confirmaci\xf3n de documentos a:",e);let o=`${n}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,r=`
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
  `;try{await i().send({to:e,from:"contacto@cajavalladolid.com",subject:"\uD83D\uDCC4 \xa1Documentos recibidos! Tu solicitud avanza",html:s(r,"Documentos recibidos")}),console.log("✅ Correo de documentos enviado a:",e)}catch(e){console.error("❌ Error enviando correo de documentos:",e)}}async function p({to:e,name:t,message:a,conversationId:o}){console.log("\uD83D\uDCE7 Enviando notificaci\xf3n de chat v\xeda Zoho a:",e);let r=`${n}/?chat_name=${encodeURIComponent(t)}&chat_email=${encodeURIComponent(e)}`,i=`
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
  `;try{await l.sendMail({from:'"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',to:e,subject:"\uD83D\uDCE9 Nuevo mensaje de tu asesor",html:s(i,"Nuevo mensaje")}),console.log("✅ Notificaci\xf3n enviada v\xeda Zoho a:",e)}catch(e){console.error("❌ Error enviando notificaci\xf3n:",e)}}},72331:(e,t,a)=>{"use strict";a.d(t,{_:()=>o});let o=new(a(53524)).PrismaClient}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),o=t.X(0,[9276,5972,5245,2880],()=>a(20528));module.exports=o})();