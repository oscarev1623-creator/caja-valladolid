// lib/email-templates-simple.ts
export const emailTemplatesForBatch = {
  APPROVED: {
    subject: '🎉 ¡Felicidades! Su crédito ha sido aprobado',
    body: () => 'Email de aprobación'
  },
  REJECTED: {
    subject: 'Actualización sobre su solicitud',
    body: () => 'Email de rechazo'
  },
  CONTACTED: {
    subject: 'Su asesor se pondrá en contacto',
    body: () => 'Email de contacto'
  }
}