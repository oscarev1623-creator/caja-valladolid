(()=>{var e={};e.id=11,e.ids=[11],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{"use strict";e.exports=require("assert")},84770:e=>{"use strict";e.exports=require("crypto")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},32694:e=>{"use strict";e.exports=require("http2")},35240:e=>{"use strict";e.exports=require("https")},55315:e=>{"use strict";e.exports=require("path")},76162:e=>{"use strict";e.exports=require("stream")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},6005:e=>{"use strict";e.exports=require("node:crypto")},11825:()=>{},11072:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>D,patchFetch:()=>v,requestAsyncStorage:()=>f,routeModule:()=>x,serverHooks:()=>b,staticGenerationAsyncStorage:()=>h});var o={};r.r(o),r.d(o,{POST:()=>m});var a=r(49303),i=r(88716),s=r(60670),n=r(87070),l=r(53524),d=r(38547),c=r(72880),u=r.n(c);let p=new l.PrismaClient;async function g(){console.log("\uD83D\uDD0D ===================="),console.log("\uD83D\uDD0D Buscando el mejor asesor para el lead...");let e=await p.user.findMany({where:{role:"AGENT",isActive:!0}}),t=await Promise.all(e.map(async e=>{let t=await p.lead.count({where:{assignedToId:e.id}});return console.log(`   📋 ${e.name} tiene ${t} leads asignados`),{...e,currentLoad:t}}));t.sort((e,t)=>e.currentLoad-t.currentLoad);let r=t[0];return console.log(`✅ Asesor seleccionado: ${r.name} (${r.currentLoad} leads)`),console.log("\uD83D\uDD0D ===================="),r}async function m(e){try{let{firstName:t,lastName:r,email:o,phone:a,estimatedAmount:i,creditType:s,message:l}=await e.json();if(console.log("\uD83D\uDCE5 Datos recibidos:",{firstName:t,lastName:r,email:o,phone:a,estimatedAmount:i,creditType:s}),!t||!r||!o||!a||!i)return n.NextResponse.json({success:!1,error:"Todos los campos son requeridos"},{status:400});let c=`${t} ${r}`.trim(),m=(0,d.Z)(),x=new Date;x.setDate(x.getDate()+30);let f=await g(),h=f?.id||null,b=await p.lead.create({data:{fullName:c,firstName:t,lastName:r,email:o,phone:a,estimatedAmount:parseFloat(i),creditType:"crypto"===s?"CRYPTO":"TRADITIONAL",message:l||"",uniqueToken:m,tokenExpiresAt:x,status:"PENDING_DOCUMENTS",source:"CALCULATOR",assignedToId:h},include:{assignedTo:{select:{id:!0,name:!0,email:!0,color:!0}}}});console.log(`✅ Lead creado con asesor: ${b.assignedTo?.name||"Sin asesor"}`);let D=`TKT-${Date.now()}-${Math.floor(1e3*Math.random())}`,v=`${process.env.NEXT_PUBLIC_URL||"https://www.cajavalladolid.com"}/formulario-documentos/${m}`;await p.ticket.create({data:{ticketNumber:D,leadId:b.id,uniqueToken:m,linkUrl:v,expiresAt:x,status:"PENDING",priority:"MEDIUM"}}),console.log("✅ Ticket creado:",D),console.log("\uD83D\uDCE7 Enviando correo con SendGrid..."),console.log("\uD83D\uDCE7 Email destino:",o);let y=process.env.NEXTAUTH_URL||"https://www.cajavalladolid.com",w=`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmaci\xf3n de solicitud</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${y}/logotipo.png" alt="Caja Valladolid" style="height: 60px; margin-bottom: 10px;" />
          <h1 style="color: #059669; margin: 0;">Caja Valladolid</h1>
          <p style="color: #065f46;">Tu aliado financiero de confianza</p>
        </div>

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
          <h2 style="color: #059669; margin-top: 0;">\xa1Hola ${t} ${r}! 👋</h2>
          <p style="font-size: 16px;">Hemos recibido exitosamente tu solicitud de cr\xe9dito por <strong>$${parseFloat(i).toLocaleString("es-MX")}</strong>.</p>
        </div>

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #065f46;">📎 \xbfQuieres agilizar tu proceso?</h3>
          <p>Sube tus documentos aqu\xed:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${v}" style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
              📄 Subir documentaci\xf3n
            </a>
          </div>
        </div>

        <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-top: 0;">💬 Oficina Virtual</h3>
          <p>Puedes chatear directamente con tu asesor en nuestra Oficina Virtual:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${y}" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
              💬 Abrir Oficina Virtual
            </a>
          </div>
        </div>

        <div style="background-color: #fef3c7; border-radius: 10px; padding: 16px; text-align: center;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ⏳ <strong>Pr\xf3ximos pasos:</strong> Un asesor evaluar\xe1 tu solicitud en <strong>24-48 horas</strong>
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Caja Popular San Bernardino de Siena Valladolid</p>
          <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          <p>Este es un correo autom\xe1tico, por favor no responder.</p>
        </div>
      </body>
      </html>
    `;try{let e={to:o,from:"contacto@cajavalladolid.com",subject:`✨ \xa1Hola ${t}! Hemos recibido tu solicitud`,html:w};await u().send(e),console.log("✅ Correo enviado con SendGrid!")}catch(e){console.error("❌ Error enviando correo con SendGrid:",e)}return n.NextResponse.json({success:!0,leadId:b.id,token:m,documentLink:v,message:"Solicitud recibida. Revisa tu correo para continuar."})}catch(e){return console.error("❌ Error general:",e),n.NextResponse.json({success:!1,error:e.message},{status:500})}}u().setApiKey(process.env.SENDGRID_API_KEY||"");let x=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/leads/create-calculator-lead/route",pathname:"/api/leads/create-calculator-lead",filename:"route",bundlePath:"app/api/leads/create-calculator-lead/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\leads\\create-calculator-lead\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:f,staticGenerationAsyncStorage:h,serverHooks:b}=x,D="/api/leads/create-calculator-lead/route";function v(){return(0,s.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:h})}},38547:(e,t,r)=>{"use strict";r.d(t,{Z:()=>l});var o=r(6005);let a={randomUUID:o.randomUUID},i=new Uint8Array(256),s=i.length,n=[];for(let e=0;e<256;++e)n.push((e+256).toString(16).slice(1));let l=function(e,t,r){return!a.randomUUID||t||e?function(e,t,r){let a=(e=e||{}).random??e.rng?.()??(s>i.length-16&&((0,o.randomFillSync)(i),s=0),i.slice(s,s+=16));if(a.length<16)throw Error("Random bytes length must be >= 16");if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t){if((r=r||0)<0||r+16>t.length)throw RangeError(`UUID byte range ${r}:${r+15} is out of buffer bounds`);for(let e=0;e<16;++e)t[r+e]=a[e];return t}return function(e,t=0){return(n[e[t+0]]+n[e[t+1]]+n[e[t+2]]+n[e[t+3]]+"-"+n[e[t+4]]+n[e[t+5]]+"-"+n[e[t+6]]+n[e[t+7]]+"-"+n[e[t+8]]+n[e[t+9]]+"-"+n[e[t+10]]+n[e[t+11]]+n[e[t+12]]+n[e[t+13]]+n[e[t+14]]+n[e[t+15]]).toLowerCase()}(a)}(e,t,r):a.randomUUID()}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[9276,5972,2880],()=>r(11072));module.exports=o})();