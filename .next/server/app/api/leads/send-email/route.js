"use strict";(()=>{var e={};e.id=1157,e.ids=[1157],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},18207:(e,r,o)=>{o.r(r),o.d(r,{originalPathname:()=>v,patchFetch:()=>b,requestAsyncStorage:()=>g,routeModule:()=>x,serverHooks:()=>f,staticGenerationAsyncStorage:()=>m});var s={};o.r(s),o.d(s,{POST:()=>c});var t=o(49303),a=o(88716),i=o(60670),n=o(87070),d=o(53524),p=o(55245);let l=new d.PrismaClient,u=p.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"465"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}});async function c(e){try{let{leadId:r,tipo:o}=await e.json(),s=await l.lead.findUnique({where:{id:r}});if(!s)return n.NextResponse.json({success:!1,error:"Lead no encontrado"},{status:404});if(!s.email)return n.NextResponse.json({success:!1,error:"El lead no tiene un email registrado"},{status:400});let t="",a="";if("aprobacion"===o)t="✅ \xa1Tu cr\xe9dito ha sido aprobado! - Caja Valladolid",a=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">\xa1Felicidades ${s.fullName}!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #334155;">Tu solicitud de cr\xe9dito ha sido <strong style="color: #0d9488;">APROBADA</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>💰 Monto aprobado:</strong> $${s.estimatedAmount?.toLocaleString("es-MX")||"Por definir"}</p>
              <p><strong>📋 Tipo de cr\xe9dito:</strong> ${"TRADITIONAL"===s.creditType?"Tradicional":"Cripto"}</p>
            </div>
            
            <p>Un asesor se pondr\xe1 en contacto contigo en las pr\xf3ximas 24 horas para los siguientes pasos.</p>
            
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
            
            <p style="text-align: center; color: #64748b;">
              <strong>Caja Valladolid</strong><br>
              Registro Oficial: 29198 • CONDUSEF ID: 4930
            </p>
          </div>
        </div>
      `;else{if("documentos"!==o)return n.NextResponse.json({success:!1,error:"Tipo de correo no v\xe1lido"},{status:400});t="\uD83D\uDCC4 Hemos recibido tus documentos - Caja Valladolid",a=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">\xa1Hola ${s.fullName}!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #334155;">Hemos recibido tus documentos <strong>correctamente</strong>.</p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
              <p style="color: #065f46; margin: 0;">✅ Nuestros analistas est\xe1n revisando tu informaci\xf3n.</p>
            </div>
            
            <p>Te contactaremos pronto con una respuesta sobre tu solicitud.</p>
            
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
            
            <p style="text-align: center; color: #64748b;">
              <strong>Caja Valladolid</strong><br>
              Registro Oficial: 29198 • CONDUSEF ID: 4930
            </p>
          </div>
        </div>
      `}let i=await u.sendMail({from:`"Caja Valladolid" <${process.env.SMTP_USER}>`,to:s.email,subject:t,html:a});return await l.lead.update({where:{id:r},data:{emailSent:!0,emailSentAt:new Date}}),console.log(`✅ Correo enviado a ${s.email} - Tipo: ${o}`),n.NextResponse.json({success:!0,message:"Correo enviado correctamente",messageId:i.messageId})}catch(e){return console.error("❌ Error enviando correo:",e),n.NextResponse.json({success:!1,error:e.message},{status:500})}}let x=new t.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/leads/send-email/route",pathname:"/api/leads/send-email",filename:"route",bundlePath:"app/api/leads/send-email/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\leads\\send-email\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:g,staticGenerationAsyncStorage:m,serverHooks:f}=x,v="/api/leads/send-email/route";function b(){return(0,i.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:m})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var o=e=>r(r.s=e),s=r.X(0,[9276,5972,5245],()=>o(18207));module.exports=s})();