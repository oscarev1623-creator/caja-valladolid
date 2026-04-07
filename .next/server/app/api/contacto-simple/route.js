(()=>{var e={};e.id=1255,e.ids=[1255],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{"use strict";e.exports=require("assert")},84770:e=>{"use strict";e.exports=require("crypto")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},32694:e=>{"use strict";e.exports=require("http2")},35240:e=>{"use strict";e.exports=require("https")},55315:e=>{"use strict";e.exports=require("path")},76162:e=>{"use strict";e.exports=require("stream")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},11825:()=>{},87911:(e,t,o)=>{"use strict";o.r(t),o.d(t,{originalPathname:()=>h,patchFetch:()=>b,requestAsyncStorage:()=>x,routeModule:()=>m,serverHooks:()=>g,staticGenerationAsyncStorage:()=>f});var r={};o.r(r),o.d(r,{POST:()=>u});var a=o(49303),i=o(88716),s=o(60670),n=o(87070),d=o(53524),l=o(72880),p=o.n(l);let c=new d.PrismaClient;async function u(e){try{let t=await e.json();if(console.log("\uD83D\uDCE5 Datos recibidos del formulario:",t),!t.firstName||!t.email||!t.phone)return n.NextResponse.json({success:!1,error:"Nombre, email y tel\xe9fono son requeridos"},{status:400});let o=`${t.firstName} ${t.lastName||""}`.trim(),r=process.env.NEXTAUTH_URL||"https://www.cajavalladolid.com",a=await c.lead.create({data:{fullName:o,firstName:t.firstName,lastName:t.lastName||null,phone:t.phone,email:t.email,message:t.message||"Consulta general",formType:"CONTACT_INQUIRY",source:"CONTACT_FORM",status:"CONTACT_INQUIRY"}});console.log("✅ Lead guardado:",a.id);try{let e={to:t.email,from:"contacto@cajavalladolid.com",subject:`✨ Hola ${t.firstName}, hemos recibido tu mensaje`,html:`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmaci\xf3n de contacto</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${r}/logotipo.png" alt="Caja Valladolid" style="height: 60px; margin-bottom: 10px;" />
              <h1 style="color: #059669; margin: 0;">Caja Valladolid</h1>
              <p style="color: #065f46;">Tu aliado financiero de confianza</p>
            </div>

            <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
              <h2 style="color: #059669; margin-top: 0;">\xa1Hola ${t.firstName}! 👋</h2>
              <p style="font-size: 16px;">Hemos recibido tu mensaje correctamente.</p>
            </div>

            <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #1e40af; margin-top: 0;">💬 Oficina Virtual</h3>
              <p>Puedes chatear directamente con tu asesor en nuestra Oficina Virtual:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${r}" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                  💬 Abrir Oficina Virtual
                </a>
              </div>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>Caja Popular San Bernardino de Siena Valladolid</p>
              <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
              <p>Este es un correo autom\xe1tico, por favor no responder.</p>
            </div>
          </body>
          </html>
        `};await p().send(e),console.log("✅ Correo de confirmaci\xf3n enviado a:",t.email)}catch(e){console.error("❌ Error enviando correo de confirmaci\xf3n:",e)}try{let e={to:"contacto@cajavalladolid.com",from:"contacto@cajavalladolid.com",subject:`📩 Nuevo mensaje de ${o}`,html:`
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #0d9488;">Nuevo mensaje de contacto</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Nombre:</td>
                <td style="padding: 8px 0;">${o}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${t.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Tel\xe9fono:</td>
                <td style="padding: 8px 0;">${t.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Mensaje:</td>
                <td style="padding: 8px 0;">${t.message||"Consulta general"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">ID Lead:</td>
                <td style="padding: 8px 0;">${a.id}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
              <a href="${r}/admin/chat?leadId=${a.id}&email=${encodeURIComponent(t.email)}&name=${encodeURIComponent(o)}&phone=${encodeURIComponent(t.phone)}" style="color: #059669;">
                💬 Abrir conversaci\xf3n en Oficina Virtual
              </a>
            </div>
          </div>
        `};await p().send(e),console.log("✅ Correo de notificaci\xf3n enviado al admin")}catch(e){console.error("❌ Error enviando correo al admin:",e)}return n.NextResponse.json({success:!0,leadId:a.id,message:"Mensaje recibido. Nos pondremos en contacto pronto.",data:{nombre:o,tipo:"Consulta general",prioridad:"BAJA"}})}catch(e){return console.error("❌ Error en contacto-simple:",e),n.NextResponse.json({success:!1,error:"Error procesando el mensaje",details:void 0},{status:500})}}p().setApiKey(process.env.SENDGRID_API_KEY||"");let m=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/contacto-simple/route",pathname:"/api/contacto-simple",filename:"route",bundlePath:"app/api/contacto-simple/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\contacto-simple\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:x,staticGenerationAsyncStorage:f,serverHooks:g}=m,h="/api/contacto-simple/route";function b(){return(0,s.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:f})}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[9276,5972,2880],()=>o(87911));module.exports=r})();