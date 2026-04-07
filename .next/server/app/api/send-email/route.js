(()=>{var e={};e.id=6499,e.ids=[6499],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{"use strict";e.exports=require("assert")},84770:e=>{"use strict";e.exports=require("crypto")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},32694:e=>{"use strict";e.exports=require("http2")},35240:e=>{"use strict";e.exports=require("https")},55315:e=>{"use strict";e.exports=require("path")},76162:e=>{"use strict";e.exports=require("stream")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},11825:()=>{},13519:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>u,patchFetch:()=>h,requestAsyncStorage:()=>g,routeModule:()=>x,serverHooks:()=>b,staticGenerationAsyncStorage:()=>f});var o={};r.r(o),r.d(o,{POST:()=>c});var a=r(49303),i=r(88716),l=r(60670),d=r(87070),n=r(72880),s=r.n(n);let p=new(r(53524)).PrismaClient;async function c(e){try{let{to:t,nombre:r,tipo:o,leadId:a,monto:i,creditType:l}=await e.json();s().setApiKey(process.env.SENDGRID_API_KEY);let n="",c="";if("documentos"===o)n="\uD83D\uDCC4 Hemos recibido tus documentos - Caja Valladolid",c=`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Documentos recibidos</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                  
                  <!-- HEADER CON LOGO -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 30px; text-align: center;">
                      <img 
                        src="https://cajavalladolid.com/logotipo.png" 
                        alt="Caja Valladolid" 
                        style="width: 120px; height: auto; margin-bottom: 15px;"
                      >
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Caja Valladolid</h1>
                      <p style="color: #d1fae5; margin: 10px 0 0; font-size: 15px;">Tu aliado financiero de confianza</p>
                    </td>
                  </tr>
                  
                  <!-- CONTENIDO -->
                  <tr>
                    <td style="padding: 40px 30px; background-color: #ffffff;">
                      <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">\xa1Hola ${r}!</h2>
                      
                      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                        Hemos recibido <strong style="color: #059669;">tus documentos</strong> correctamente. 
                        Nuestro equipo de analistas ya est\xe1 revisando tu informaci\xf3n.
                      </p>
                      
                      <!-- DOCUMENTOS RECIBIDOS -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border-left: 4px solid #059669; border-radius: 8px; margin: 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #065f46; margin: 0 0 15px 0; font-weight: bold; font-size: 16px;">✅ Documentos recibidos:</p>
                            <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                              <li style="margin-bottom: 8px;">INE/IFE (frontal y trasera)</li>
                              <li style="margin-bottom: 8px;">Comprobante de domicilio</li>
                              <li style="margin-bottom: 8px;">Constancia laboral</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                        En las pr\xf3ximas <strong style="color: #059669;">24-48 horas</strong> recibir\xe1s una respuesta sobre tu solicitud de cr\xe9dito.
                      </p>
                      
                      <!-- WHATSAPP -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; margin: 30px 0;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">📱 \xbfTienes dudas?</h3>
                            <p style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 15px;">Cont\xe1ctanos por WhatsApp:</p>
                            <a href="https://wa.me/529541184165" style="display: inline-block; background: #25D366; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">💬 WhatsApp</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- FOOTER -->
                      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0 20px;">
                      <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
                        Caja Popular San Bernardino de Siena Valladolid<br>
                        Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
                        <span style="font-size: 11px;">Este es un correo autom\xe1tico, por favor no responder.</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;else if("aprobacion"===o){let e=new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",minimumFractionDigits:0}).format(i);n="✅ \xa1Tu cr\xe9dito ha sido APROBADO! - Caja Valladolid",c=`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cr\xe9dito aprobado</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                  
                  <!-- HEADER CON LOGO -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 30px; text-align: center;">
                      <img 
                        src="https://cajavalladolid.com/logotipo.png" 
                        alt="Caja Valladolid" 
                        style="width: 120px; height: auto; margin-bottom: 15px;"
                      >
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Caja Valladolid</h1>
                      <p style="color: #d1fae5; margin: 10px 0 0; font-size: 15px;">Tu aliado financiero de confianza</p>
                    </td>
                  </tr>
                  
                  <!-- CONTENIDO DE APROBACI\xd3N -->
                  <tr>
                    <td style="padding: 40px 30px; background-color: #ffffff;">
                      
                      <!-- ICONO DE \xc9XITO -->
                      <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px;">✅</span>
                        </div>
                      </div>
                      
                      <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 28px; font-weight: bold; text-align: center;">\xa1Felicidades ${r}!</h2>
                      <p style="color: #059669; font-size: 18px; text-align: center; margin: 0 0 30px 0; font-weight: bold;">TU CR\xc9DITO HA SIDO APROBADO</p>
                      
                      <!-- DETALLES DEL CR\xc9DITO -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; margin: 30px 0; border: 1px solid #e5e7eb;">
                        <tr>
                          <td style="padding: 25px;">
                            <h3 style="color: #111827; margin: 0 0 20px 0; font-size: 18px;">📋 Detalles de tu cr\xe9dito:</h3>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding: 8px 0; color: #4b5563; width: 40%;">Monto aprobado:</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${e}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #4b5563;">Tipo de cr\xe9dito:</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${"CRYPTO"===l?"Cr\xe9dito en Criptomonedas":"Cr\xe9dito Tradicional"}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- PR\xd3XIMOS PASOS -->
                      <h3 style="color: #111827; margin: 30px 0 20px 0; font-size: 18px;">📌 Pr\xf3ximos pasos:</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="30" style="vertical-align: top;">
                                  <span style="background-color: #059669; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-size: 14px;">1</span>
                                </td>
                                <td style="color: #4b5563; padding-left: 10px;">Un asesor se comunicar\xe1 contigo en las pr\xf3ximas 24 horas</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="30" style="vertical-align: top;">
                                  <span style="background-color: #059669; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-size: 14px;">2</span>
                                </td>
                                <td style="color: #4b5563; padding-left: 10px;">Te explicaremos los t\xe9rminos finales y resolveremos tus dudas</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="30" style="vertical-align: top;">
                                  <span style="background-color: #059669; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-size: 14px;">3</span>
                                </td>
                                <td style="color: #4b5563; padding-left: 10px;">Coordinaremos la entrega de los fondos</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- WHATSAPP -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; margin: 30px 0;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">📱 \xbfTienes dudas?</h3>
                            <p style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 15px;">Cont\xe1ctanos por WhatsApp para atenci\xf3n personalizada:</p>
                            <a href="https://wa.me/529541184165" style="display: inline-block; background: #25D366; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">💬 WhatsApp</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- FOOTER -->
                      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0 20px;">
                      <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
                        Caja Popular San Bernardino de Siena Valladolid<br>
                        Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
                        <span style="font-size: 11px;">Este es un correo autom\xe1tico, por favor no responder.</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `}let x={to:t,from:"contacto@cajavalladolid.com",subject:n,html:c};return await s().send(x),a&&await p.lead.update({where:{id:a},data:{emailSent:!0,emailSentAt:new Date}}),d.NextResponse.json({success:!0})}catch(e){return console.error("Error:",e.response?.body||e),d.NextResponse.json({error:"Error al enviar correo"},{status:500})}}let x=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/send-email/route",pathname:"/api/send-email",filename:"route",bundlePath:"app/api/send-email/route"},resolvedPagePath:"C:\\Users\\jonat\\Desktop\\Respaldo Jonathan\\caja-final\\app\\api\\send-email\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:g,staticGenerationAsyncStorage:f,serverHooks:b}=x,u="/api/send-email/route";function h(){return(0,l.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:f})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[9276,5972,2880],()=>r(13519));module.exports=o})();