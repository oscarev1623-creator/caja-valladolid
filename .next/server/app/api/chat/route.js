"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},82153:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>h,patchFetch:()=>f,requestAsyncStorage:()=>l,routeModule:()=>p,serverHooks:()=>x,staticGenerationAsyncStorage:()=>m});var a={};t.r(a),t.d(a,{POST:()=>u});var r=t(49303),s=t(88716),n=t(60670),i=t(87070);let d=[{keywords:["tasa","inter\xe9s","interes"],response:`💰 **Tasas de inter\xe9s:**

• Cr\xe9dito Tradicional: desde 12% anual
• Cr\xe9dito Cripto: desde 8% anual

La tasa exacta depende del monto y plazo que elijas.`},{keywords:["bur\xf3","buro","historial","credito","cr\xe9dito"],response:`📊 **Sin consulta a Bur\xf3 de Cr\xe9dito**

No revisamos tu historial crediticio. Todos tienen oportunidad independientemente de su historial.`},{keywords:["formulario","solicitar","aplicar"],response:`📋 **Para solicitar un cr\xe9dito:**

1. Usa el bot\xf3n "Solicitar Cr\xe9dito" en la p\xe1gina
2. Llena el formulario con tus datos
3. Un asesor te contactar\xe1 en 24-48 horas`},{keywords:["requisitos","necesito","documentos"],response:`📄 **Requisitos b\xe1sicos:**

• Identificaci\xf3n oficial (INE/IFE)
• Comprobante de domicilio
• Comprobante de ingresos
• 2 referencias personales`},{keywords:["monto","cantidad","cu\xe1nto","maximo","m\xe1ximo"],response:`💰 **Montos de cr\xe9dito:**

• Desde $5,000 hasta $500,000 pesos
• Plazos de 6 a 36 meses
• Monto exacto seg\xfan tu capacidad de pago`},{keywords:["contacto","whatsapp","tel\xe9fono","llamar","asesor"],response:`📞 **Contacto directo:**

WhatsApp: +52 985 123 4567
Tel\xe9fono: 01 985 123 4567
Email: contacto@cajavalladolid.com

Horario: Lun-Vie 9am-6pm`}],c=`Lo siento, no entend\xed tu pregunta. 😅

Puedes preguntarme sobre:
• Tasas de inter\xe9s
• Requisitos
• Montos y plazos
• Bur\xf3 de cr\xe9dito
• Formularios

O contacta directamente a un asesor: 📞 +52 985 123 4567`;async function u(e){try{let{messages:o}=await e.json(),t=o[o.length-1].content.toLowerCase(),a=c;for(let e of d)if(e.keywords.some(e=>t.includes(e))){a=e.response;break}return await new Promise(e=>setTimeout(e,1e3)),i.NextResponse.json({message:a,success:!0})}catch(e){return console.error("Error en chat:",e),i.NextResponse.json({error:"Error interno del servidor"},{status:500})}}let p=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\chat\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:l,staticGenerationAsyncStorage:m,serverHooks:x}=p,h="/api/chat/route";function f(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:m})}}};var o=require("../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),a=o.X(0,[9276,5972],()=>t(82153));module.exports=a})();