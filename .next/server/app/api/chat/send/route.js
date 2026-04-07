"use strict";(()=>{var e={};e.id=7333,e.ids=[7333],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},27917:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>b,patchFetch:()=>v,requestAsyncStorage:()=>f,routeModule:()=>x,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{POST:()=>g});var o=r(49303),i=r(88716),n=r(60670),s=r(87070),l=r(72331);let d=r(55245).createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}}),p=process.env.NEXTAUTH_URL||"https://cajavalladolid.com",c=(e,t)=>`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header con logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669, #047857); padding: 30px 20px; text-align: center;">
              <img src="${p}/logotipo.png" alt="Caja Valladolid" style="height: 60px; width: auto; margin-bottom: 10px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">Oficina Virtual</h1>
              <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 14px;">Tu aliado financiero de confianza</p>
            </td>
          </tr>
          
          <!-- Contenido -->
          <tr>
            <td style="padding: 30px;">
              ${e}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                Caja Popular San Bernardino de Siena Valladolid
              </p>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                Registro Oficial: 29198 • CONDUSEF ID: 4930
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                Este es un correo autom\xe1tico, por favor no responder.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Aviso de privacidad -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
          <tr>
            <td style="text-align: center; padding: 10px;">
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
`;async function u({to:e,name:t,message:r,conversationId:a}){let o=`${p}/`,i=`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #059669; margin: 0 0 8px 0;">\xa1Hola ${t}! 👋</h2>
        <p style="color: #065f46; margin: 0; font-size: 16px;">Has recibido un nuevo mensaje de tu asesor en tu <strong>Oficina Virtual</strong>.</p>
      </div>
    </div>

    <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold;">📩 Mensaje:</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 16px; margin-top: 8px;">
        <p style="margin: 0; color: #059669; font-style: italic; font-size: 15px;">"${r}"</p>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${o}" style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px;">
        💬 Abrir Oficina Virtual
      </a>
    </div>

    <div style="background-color: #eff6ff; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px;">💡 Recuerda:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px;">
        <li style="margin-bottom: 8px;">✅ Tus mensajes quedan guardados</li>
        <li style="margin-bottom: 8px;">✅ Puedes volver cuando quieras</li>
        <li>✅ Los documentos que compartas est\xe1n protegidos</li>
      </ul>
    </div>

    <div style="background-color: #fef3c7; border-radius: 12px; padding: 12px; text-align: center;">
      <p style="color: #92400e; margin: 0; font-size: 12px;">
        💡 <strong>Consejo:</strong> Puedes responder directamente desde la Oficina Virtual
      </p>
    </div>
  `;await d.sendMail({from:'"Caja Valladolid - Oficina Virtual" <contacto@cajavalladolid.com>',to:e,subject:"\uD83D\uDCE9 Nuevo mensaje de tu asesor",html:c(i,"Nuevo mensaje en tu Oficina Virtual")})}async function g(e){try{let{conversationId:t,message:r,senderType:a,fileUrl:o,fileType:i,fileName:n}=await e.json(),d=await l._.chatMessage.create({data:{conversationId:t,message:r||null,senderType:a,fileUrl:o||null,fileType:i||null,fileName:n||null,isRead:"agent"===a}});if(await l._.chatConversation.update({where:{id:t},data:{updatedAt:new Date}}),"agent"===a){let e=await l._.chatConversation.findUnique({where:{id:t},select:{userEmail:!0,userName:!0}});e?.userEmail&&await u({to:e.userEmail,name:e.userName||"cliente",message:r||"Se ha adjuntado un documento",conversationId:t})}return s.NextResponse.json({success:!0,message:d})}catch(e){return console.error("Error sending message:",e),s.NextResponse.json({success:!1,error:"Error al enviar"},{status:500})}}let x=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/chat/send/route",pathname:"/api/chat/send",filename:"route",bundlePath:"app/api/chat/send/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\chat\\send\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:f,staticGenerationAsyncStorage:m,serverHooks:h}=x,b="/api/chat/send/route";function v(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}},72331:(e,t,r)=>{r.d(t,{_:()=>a});let a=new(r(53524)).PrismaClient}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[9276,5972,5245],()=>r(27917));module.exports=a})();