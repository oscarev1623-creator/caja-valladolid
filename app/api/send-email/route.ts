import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { to, nombre, tipo, leadId, monto, creditType } = await request.json()

    // Configurar SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

    let subject = ''
    let html = ''

    if (tipo === 'documentos') {
      subject = '📄 Hemos recibido tus documentos - Caja Valladolid'
      html = `
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
                      <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${nombre}!</h2>
                      
                      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                        Hemos recibido <strong style="color: #059669;">tus documentos</strong> correctamente. 
                        Nuestro equipo de analistas ya está revisando tu información.
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
                        En las próximas <strong style="color: #059669;">24-48 horas</strong> recibirás una respuesta sobre tu solicitud de crédito.
                      </p>
                      
                      <!-- WHATSAPP -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; margin: 30px 0;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">📱 ¿Tienes dudas?</h3>
                            <p style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 15px;">Contáctanos por WhatsApp:</p>
                            <a href="https://wa.me/529541184165" style="display: inline-block; background: #25D366; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">💬 WhatsApp</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- FOOTER -->
                      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0 20px;">
                      <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
                        Caja Popular San Bernardino de Siena Valladolid<br>
                        Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
                        <span style="font-size: 11px;">Este es un correo automático, por favor no responder.</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    } else if (tipo === 'aprobacion') {
      const tipoCreditoTexto = creditType === 'CRYPTO' ? 'Crédito en Criptomonedas' : 'Crédito Tradicional'
      const montoFormateado = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0
      }).format(monto)

      subject = '✅ ¡Tu crédito ha sido APROBADO! - Caja Valladolid'
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Crédito aprobado</title>
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
                  
                  <!-- CONTENIDO DE APROBACIÓN -->
                  <tr>
                    <td style="padding: 40px 30px; background-color: #ffffff;">
                      
                      <!-- ICONO DE ÉXITO -->
                      <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px;">✅</span>
                        </div>
                      </div>
                      
                      <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 28px; font-weight: bold; text-align: center;">¡Felicidades ${nombre}!</h2>
                      <p style="color: #059669; font-size: 18px; text-align: center; margin: 0 0 30px 0; font-weight: bold;">TU CRÉDITO HA SIDO APROBADO</p>
                      
                      <!-- DETALLES DEL CRÉDITO -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; margin: 30px 0; border: 1px solid #e5e7eb;">
                        <tr>
                          <td style="padding: 25px;">
                            <h3 style="color: #111827; margin: 0 0 20px 0; font-size: 18px;">📋 Detalles de tu crédito:</h3>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding: 8px 0; color: #4b5563; width: 40%;">Monto aprobado:</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${montoFormateado}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #4b5563;">Tipo de crédito:</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${tipoCreditoTexto}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- PRÓXIMOS PASOS -->
                      <h3 style="color: #111827; margin: 30px 0 20px 0; font-size: 18px;">📌 Próximos pasos:</h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="30" style="vertical-align: top;">
                                  <span style="background-color: #059669; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; font-size: 14px;">1</span>
                                </td>
                                <td style="color: #4b5563; padding-left: 10px;">Un asesor se comunicará contigo en las próximas 24 horas</td>
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
                                <td style="color: #4b5563; padding-left: 10px;">Te explicaremos los términos finales y resolveremos tus dudas</td>
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
                            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">📱 ¿Tienes dudas?</h3>
                            <p style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 15px;">Contáctanos por WhatsApp para atención personalizada:</p>
                            <a href="https://wa.me/529541184165" style="display: inline-block; background: #25D366; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">💬 WhatsApp</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- FOOTER -->
                      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0 20px;">
                      <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
                        Caja Popular San Bernardino de Siena Valladolid<br>
                        Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
                        <span style="font-size: 11px;">Este es un correo automático, por favor no responder.</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    const msg = {
      to: to,
      from: 'contacto@cajavalladolid.com',
      subject: subject,
      html: html
    }

    await sgMail.send(msg)

    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          emailSent: true,
          emailSentAt: new Date()
        }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error:', error.response?.body || error)
    return NextResponse.json({ error: 'Error al enviar correo' }, { status: 500 })
  }
}