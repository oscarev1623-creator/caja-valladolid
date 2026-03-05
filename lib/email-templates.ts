// lib/email-templates.ts - VERSIÓN COMPATIBLE CON AMBOS

// Función original (para otros usos)
export const emailTemplates = {
  approval: (leadName: string, amount: number, notes?: string) => ({
    subject: '🎉 ¡Felicidades! Su crédito ha sido aprobado - Caja Valladolid',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .amount { font-size: 24px; color: #10b981; font-weight: bold; }
          .steps { margin: 20px 0; }
          .step { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 Caja Popular San Bernardino de Siena Valladolid</h1>
            <p>Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          </div>
          
          <div class="content">
            <h2>Estimado(a) ${leadName},</h2>
            <p>Nos complace informarle que su solicitud de crédito ha sido <strong>APROBADA</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div class="amount">💰 Monto Aprobado: $${amount.toLocaleString('es-MX')} MXN</div>
            </div>
            
            ${notes ? `<div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>📝 Notas adicionales:</strong>
              <p>${notes}</p>
            </div>` : ''}
            
            <div class="steps">
              <h3>📋 Próximos pasos:</h3>
              <div class="step">
                <strong>1. Firma de contrato</strong>
                <p>Nuestro ejecutivo se pondrá en contacto para coordinar la firma de documentos.</p>
              </div>
              <div class="step">
                <strong>2. Desembolso de fondos</strong>
                <p>Una vez firmado el contrato, los fondos se depositarán en 24-48 horas hábiles.</p>
              </div>
              <div class="step">
                <strong>3. Seguimiento</strong>
                <p>Recibirá asesoría personalizada durante todo el proceso.</p>
              </div>
            </div>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>📞 Contacto de su ejecutivo:</h3>
              <p><strong>Teléfono:</strong> 461 123 4567</p>
              <p><strong>Horario:</strong> Lunes a Viernes 9:00 AM - 6:00 PM</p>
              <p><strong>Email:</strong> ejecutivo@cajavalladolid.com</p>
            </div>
            
            <p>¡Gracias por confiar en Caja Valladolid!</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Caja Popular San Bernardino de Siena Valladolid</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Estimado(a) ${leadName},

Su solicitud de crédito ha sido APROBADA por un monto de $${amount.toLocaleString('es-MX')} MXN.

${notes ? `Notas: ${notes}\n\n` : ''}
Próximos pasos:
1. Firma de contrato - Nuestro ejecutivo se pondrá en contacto
2. Desembolso de fondos - En 24-48 horas hábiles después de firma
3. Seguimiento personalizado

Contacto: 461 123 4567 | ejecutivo@cajavalladolid.com

¡Gracias por confiar en Caja Valladolid!`
  })
}

// Export para batch route (estructura que necesita)
export const emailTemplatesForBatch = {
  APPROVED: {
    subject: '🎉 ¡Felicidades! Su crédito ha sido aprobado - Caja Valladolid',
    body: (lead: any) => emailTemplates.approval(
      lead.fullName, 
      lead.estimatedAmount || 0,
      '' // notas vacías por defecto
    ).html
  },
  REJECTED: {
    subject: 'Actualización sobre su solicitud de crédito - Caja Valladolid',
    body: (lead: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6b7280; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 Caja Popular San Bernardino de Siena Valladolid</h1>
          </div>
          
          <div class="content">
            <h2>Estimado(a) ${lead.fullName},</h2>
            
            <p>Después de revisar cuidadosamente su solicitud, lamentamos informarle que <strong>no podemos aprobar su crédito en este momento</strong>.</p>
            
            <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📋 Recomendaciones:</h3>
              <ul>
                <li>Esperar 6 meses y volver a aplicar</li>
                <li>Mejorar su historial crediticio</li>
                <li>Considerar un monto menor</li>
              </ul>
            </div>
            
            <p>Puede contactarnos para más información.</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Caja Popular San Bernardino de Siena Valladolid</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },
  CONTACTED: {
    subject: 'Su asesor se pondrá en contacto - Caja Valladolid',
    body: (lead: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 Caja Popular San Bernardino de Siena Valladolid</h1>
          </div>
          
          <div class="content">
            <h2>Estimado(a) ${lead.fullName},</h2>
            
            <p>Hemos recibido su solicitud y un asesor especializado se pondrá en contacto en las próximas <strong>2-4 horas hábiles</strong>.</p>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📞 Preparativos:</h3>
              <ul>
                <li>Tenga a mano su INE (ambos lados)</li>
                <li>Comprobante de domicilio reciente</li>
                <li>Estados de cuenta de los últimos 3 meses</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Caja Popular San Bernardino de Siena Valladolid</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Export por defecto para compatibilidad
export default emailTemplatesForBatch