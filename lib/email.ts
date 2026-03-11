// lib/email.ts
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  nombre: string
  leadId: string
}

export async function sendConfirmationEmail({ to, nombre, leadId }: EmailOptions) {
  // Configurar transporter (usa tus credenciales)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const whatsappNumber = "5215512345678" // Reemplaza con el número real
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  const mailOptions = {
    from: '"Caja Valladolid" <notificaciones@cajavalladolid.com>',
    to: to,
    subject: 'Hemos recibido tu solicitud de crédito',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de solicitud</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669;">Caja Valladolid</h1>
          <p style="color: #065f46;">Tu aliado financiero de confianza</p>
        </div>

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
          <h2 style="color: #059669; margin-top: 0;">¡Hola ${nombre}!</h2>
          <p style="font-size: 16px;">Hemos recibido exitosamente tu solicitud de crédito y documentación.</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #065f46;">📋 Detalles de tu solicitud:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px; padding: 10px; background-color: #f9fafb; border-radius: 5px;">
              <strong>Número de solicitud:</strong> #${leadId.slice(-8).toUpperCase()}
            </li>
            <li style="margin-bottom: 10px; padding: 10px; background-color: #f9fafb; border-radius: 5px;">
              <strong>Fecha de recepción:</strong> ${new Date().toLocaleDateString('es-MX')}
            </li>
            <li style="margin-bottom: 10px; padding: 10px; background-color: #f9fafb; border-radius: 5px;">
              <strong>Estado:</strong> En evaluación
            </li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #065f46;">🔒 Tus documentos están seguros</h3>
          <p>Todos los documentos que nos compartiste están protegidos con encriptación de nivel bancario. Solo personal autorizado tendrá acceso a ellos para evaluar tu solicitud.</p>
        </div>

        <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-top: 0;">📱 ¿Tienes dudas?</h3>
          <p>Nuestro equipo de asesores está listo para ayudarte. Puedes contactarnos directamente por WhatsApp:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${whatsappLink}" style="background-color: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
              💬 Contactar por WhatsApp
            </a>
          </div>
          <p style="font-size: 14px; color: #4b5563; text-align: center;">
            Horario de atención: Lunes a Viernes 9am - 7pm<br>
            Sábados 10am - 2pm
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #065f46;">⏳ Próximos pasos:</h3>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">Un analista revisará tu documentación (24-48 hrs)</li>
            <li style="margin-bottom: 10px;">Recibirás una llamada o mensaje para validar información</li>
            <li style="margin-bottom: 10px;">Te notificaremos la resolución de tu crédito</li>
          </ol>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 14px; color: #6b7280;">
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          <p>Caja Popular San Bernardino de Siena Valladolid</p>
          <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
        </div>
      </body>
      </html>
    `
  }

  await transporter.sendMail(mailOptions)
}