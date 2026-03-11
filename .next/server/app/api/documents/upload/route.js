"use strict";(()=>{var e={};e.id=6062,e.ids=[6062],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},20629:e=>{e.exports=require("fs/promises")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},23643:(e,o,r)=>{r.r(o),r.d(o,{originalPathname:()=>S,patchFetch:()=>v,requestAsyncStorage:()=>b,routeModule:()=>h,serverHooks:()=>D,staticGenerationAsyncStorage:()=>y});var t={};r.r(t),r.d(t,{POST:()=>g});var a=r(49303),i=r(88716),s=r(60670),n=r(87070),l=r(53524),d=r(20629),p=r(55315),u=r(92048),c=r(55245);let f=new l.PrismaClient,m=(0,p.join)(process.cwd(),"public","uploads","documents");async function x(e){try{let o=c.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"465"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}});if(!e.email){console.log("⚠️ Lead sin email, no se env\xeda correo de confirmaci\xf3n");return}await o.sendMail({from:`"Caja Valladolid" <${process.env.SMTP_USER}>`,to:e.email,subject:"\uD83D\uDCC4 Hemos recibido tus documentos - Caja Valladolid",html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header con gradiente -->
          <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Caja Valladolid</h1>
            <p style="color: #e6fffa; margin: 10px 0 0; font-size: 16px;">Tu aliado financiero de confianza</p>
          </div>
          
          <!-- Cuerpo del correo -->
          <div style="background: #f8fafc; padding: 40px 30px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">\xa1Hola ${e.fullName}!</h2>
            
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">Hemos recibido <strong>tus documentos</strong> correctamente. Nuestro equipo de analistas ya est\xe1 revisando tu informaci\xf3n.</p>
            
            <!-- Lista de documentos recibidos -->
            <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 8px;">
              <p style="color: #065f46; margin: 0 0 10px 0; font-weight: bold; font-size: 16px;">✅ Documentos recibidos:</p>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">INE/IFE (frontal y trasera)</li>
                <li style="margin-bottom: 8px;">Comprobante de domicilio</li>
                <li style="margin-bottom: 8px;">Constancia laboral / Comprobante de ingresos</li>
              </ul>
            </div>
            
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">En las pr\xf3ximas <strong>24-48 horas</strong> recibir\xe1s una respuesta sobre tu solicitud de cr\xe9dito.</p>
            
            <!-- WhatsApp Box -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: #1e3a8a; margin-top: 0; font-size: 18px;">📱 \xbfTienes dudas?</h3>
              <p style="color: #1e40af; margin-bottom: 20px;">Cont\xe1ctanos por WhatsApp para atenci\xf3n personalizada:</p>
              <a href="https://wa.me/529541184165" style="display: inline-block; background: #25D366; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">💬 WhatsApp</a>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
            
            <p style="color: #64748b; font-size: 13px; text-align: center; line-height: 1.5; margin: 0;">
              Caja Popular San Bernardino de Siena Valladolid<br>
              Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
              <span style="font-size: 12px;">Este es un correo autom\xe1tico, por favor no responder.</span>
            </p>
          </div>
        </div>
      `}),console.log("✅ Correo de confirmaci\xf3n enviado a:",e.email),await f.lead.update({where:{id:e.id},data:{emailSent:!0,emailSentAt:new Date}})}catch(e){console.error("❌ Error enviando correo:",e)}}async function g(e){try{console.log("=".repeat(50)),console.log("\uD83D\uDE80 INICIO - SUBIDA DE DOCUMENTOS"),console.log("=".repeat(50));let o=await e.formData(),r=o.get("leadId");if(console.log("\uD83D\uDCCB Lead ID recibido:",r),!r)return n.NextResponse.json({success:!1,error:"Lead ID requerido"},{status:400});let t=await f.lead.findUnique({where:{id:r}});if(!t)return n.NextResponse.json({success:!1,error:"Lead no encontrado"},{status:404});console.log("✅ Lead encontrado:",t.fullName);let a=[];for(let e of[{field:"ineFront",type:"INE_FRONTAL"},{field:"ineBack",type:"INE_TRASERA"},{field:"comprobanteDomicilio",type:"COMPROBANTE_DOMICILIO"},{field:"constanciaLaboral",type:"CONSTANCIA_LABORAL"},{field:"estadosCuenta",type:"ESTADOS_CUENTA"},{field:"otrosDocumentos",type:"OTROS"}]){let t=o.get(e.field);if(t&&t.size>0){console.log(`📁 Procesando ${e.type}:`,t.name);let o=t.name.split(".").pop()||"bin",i=`${r}_${e.type}_${Date.now()}.${o}`,s=(0,p.join)(m,i),n=await t.arrayBuffer(),l=Buffer.from(n);await (0,d.writeFile)(s,l);let u=await f.document.create({data:{filename:t.name,fileUrl:`/uploads/documents/${i}`,fileType:e.type,documentType:e.type,fileSize:t.size,leadId:r,uploadedById:null,filePath:null,mimeType:t.type||null}});a.push(u),console.log(`✅ Documento guardado: ${e.type}`)}}if(a.length>0){let e=await f.lead.update({where:{id:r},data:{documentsSubmitted:!0,docsSubmittedAt:new Date,status:"DOCUMENTS_SUBMITTED"}});console.log("✅ Lead actualizado. Documentos subidos:",a.length),await x(e)}return n.NextResponse.json({success:!0,message:`Documentos subidos exitosamente (${a.length} archivos)`,documentsCount:a.length})}catch(e){return console.error("❌ Error:",e),n.NextResponse.json({success:!1,error:"Error al procesar la solicitud"},{status:500})}}(0,u.existsSync)(m)||((0,u.mkdirSync)(m,{recursive:!0}),console.log("\uD83D\uDCC1 Directorio creado:",m));let h=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/documents/upload/route",pathname:"/api/documents/upload",filename:"route",bundlePath:"app/api/documents/upload/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\documents\\upload\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:b,staticGenerationAsyncStorage:y,serverHooks:D}=h,S="/api/documents/upload/route";function v(){return(0,s.patchFetch)({serverHooks:D,staticGenerationAsyncStorage:y})}}};var o=require("../../../../webpack-runtime.js");o.C(e);var r=e=>o(o.s=e),t=o.X(0,[9276,5972,5245],()=>r(23643));module.exports=t})();