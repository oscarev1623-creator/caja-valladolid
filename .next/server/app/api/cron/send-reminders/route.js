"use strict";(()=>{var e={};e.id=7951,e.ids=[7951],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},32694:e=>{e.exports=require("http2")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},11058:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>D,patchFetch:()=>C,requestAsyncStorage:()=>x,routeModule:()=>g,serverHooks:()=>f,staticGenerationAsyncStorage:()=>h});var r={};o.r(r),o.d(r,{GET:()=>u,POST:()=>m});var a=o(49303),n=o(88716),i=o(60670),s=o(87070),d=o(72331),l=o(36119);let c=e=>e.headers.get("authorization")===`Bearer ${process.env.CRON_SECRET}`;function p(e,t){let o=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",r=`${o}/?chat_name=${encodeURIComponent(e)}`;return`
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
            <a href="${r}" class="button">${"docs"===t?"\uD83D\uDCC4 Completar documentaci\xf3n":"\uD83D\uDCAC Hablar con un asesor"}</a>
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
  `}async function u(e){try{if(!c(e))return console.log("❌ Intento de acceso no autorizado a cron de recordatorios"),s.NextResponse.json({error:"No autorizado"},{status:401});console.log("=".repeat(50)),console.log("\uD83D\uDE80 INICIANDO CRON DE RECORDATORIOS"),console.log("=".repeat(50));let t=new Date;t.setDate(t.getDate()-2);let o=new Date;o.setDate(o.getDate()-3);let r={pendingDocuments:0,pendingContact:0,errors:0,skipped:0};console.log("\uD83D\uDCCB Buscando leads con documentos pendientes...");let a=await d._.lead.findMany({where:{status:"PENDING_DOCUMENTS",documentsSubmitted:!1,createdAt:{lt:o},email:{not:null},OR:[{lastReminderSentAt:null},{lastReminderSentAt:{lt:t}}]},take:50});for(let e of(console.log(`📊 Encontrados ${a.length} leads con documentos pendientes`),a))try{if(!e.email){console.log(`⚠️ Lead ${e.id} sin email, saltando...`),r.skipped++;continue}await (0,l.Cz)({to:e.email,subject:"⏳ Tu cr\xe9dito est\xe1 en espera - Completa tu documentaci\xf3n",html:p(e.fullName,"docs")}),await d._.lead.update({where:{id:e.id},data:{lastReminderSentAt:new Date}}),r.pendingDocuments++,console.log(`✅ Recordatorio (docs) enviado a: ${e.email}`),await new Promise(e=>setTimeout(e,500))}catch(t){console.error(`❌ Error enviando a ${e.email}:`,t),r.errors++}console.log("\uD83D\uDCCB Buscando leads sin contactar...");let n=new Date;n.setDate(n.getDate()-2);let i=await d._.lead.findMany({where:{status:"PENDING_CONTACT",contactedAt:null,createdAt:{lt:n},email:{not:null},OR:[{lastReminderSentAt:null},{lastReminderSentAt:{lt:t}}]},take:50});for(let e of(console.log(`📊 Encontrados ${i.length} leads sin contactar`),i))try{if(!e.email){console.log(`⚠️ Lead ${e.id} sin email, saltando...`),r.skipped++;continue}await (0,l.Cz)({to:e.email,subject:"\uD83D\uDCAC Tu solicitud est\xe1 siendo procesada - Caja Valladolid",html:p(e.fullName,"contact")}),await d._.lead.update({where:{id:e.id},data:{lastReminderSentAt:new Date}}),r.pendingContact++,console.log(`✅ Recordatorio (contact) enviado a: ${e.email}`),await new Promise(e=>setTimeout(e,500))}catch(t){console.error(`❌ Error enviando a ${e.email}:`,t),r.errors++}return console.log("=".repeat(50)),console.log("\uD83C\uDFC1 CRON DE RECORDATORIOS COMPLETADO"),console.log(`📊 Resultados:`,r),console.log("=".repeat(50)),s.NextResponse.json({success:!0,message:"Recordatorios enviados correctamente",results:r,timestamp:new Date().toISOString()})}catch(e){return console.error("❌ Error fatal en cron de recordatorios:",e),s.NextResponse.json({success:!1,error:"Error interno del servidor",details:void 0},{status:500})}}async function m(e){return u(e)}let g=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/cron/send-reminders/route",pathname:"/api/cron/send-reminders",filename:"route",bundlePath:"app/api/cron/send-reminders/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\cron\\send-reminders\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:x,staticGenerationAsyncStorage:h,serverHooks:f}=g,D="/api/cron/send-reminders/route";function C(){return(0,i.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:h})}},72331:(e,t,o)=>{o.d(t,{_:()=>r});let r=new(o(53524)).PrismaClient}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[9276,5972,5245,2880,3897],()=>o(11058));module.exports=r})();