import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { leadId, tipo } = await request.json()
    
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // ✅ VALIDAR QUE EL LEAD TENGA EMAIL
    if (!lead.email) {
      return NextResponse.json(
        { success: false, error: 'El lead no tiene un email registrado' },
        { status: 400 }
      )
    }

    let subject = ''
    let html = ''

    if (tipo === 'aprobacion') {
      subject = '✅ ¡Tu crédito ha sido aprobado! - Caja Valladolid'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Felicidades ${lead.fullName}!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #334155;">Tu solicitud de crédito ha sido <strong style="color: #0d9488;">APROBADA</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>💰 Monto aprobado:</strong> $${lead.estimatedAmount?.toLocaleString('es-MX') || 'Por definir'}</p>
              <p><strong>📋 Tipo de crédito:</strong> ${lead.creditType === 'TRADITIONAL' ? 'Tradicional' : 'Cripto'}</p>
            </div>
            
            <p>Un asesor se pondrá en contacto contigo en las próximas 24 horas para los siguientes pasos.</p>
            
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
            
            <p style="text-align: center; color: #64748b;">
              <strong>Caja Valladolid</strong><br>
              Registro Oficial: 29198 • CONDUSEF ID: 4930
            </p>
          </div>
        </div>
      `
    } else if (tipo === 'documentos') {
      subject = '📄 Hemos recibido tus documentos - Caja Valladolid'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Hola ${lead.fullName}!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #334155;">Hemos recibido tus documentos <strong>correctamente</strong>.</p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
              <p style="color: #065f46; margin: 0;">✅ Nuestros analistas están revisando tu información.</p>
            </div>
            
            <p>Te contactaremos pronto con una respuesta sobre tu solicitud.</p>
            
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
            
            <p style="text-align: center; color: #64748b;">
              <strong>Caja Valladolid</strong><br>
              Registro Oficial: 29198 • CONDUSEF ID: 4930
            </p>
          </div>
        </div>
      `
    } else {
      return NextResponse.json(
        { success: false, error: 'Tipo de correo no válido' },
        { status: 400 }
      )
    }

    // ✅ AHORA lead.email SEGURO QUE EXISTE
    const info = await transporter.sendMail({
      from: `"Caja Valladolid" <${process.env.SMTP_USER}>`,
      to: lead.email, // Ya validado arriba
      subject: subject,
      html: html
    })

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        emailSent: true,
        emailSentAt: new Date()
      }
    })

    console.log(`✅ Correo enviado a ${lead.email} - Tipo: ${tipo}`)

    return NextResponse.json({
      success: true,
      message: 'Correo enviado correctamente',
      messageId: info.messageId
    })

  } catch (error: any) {
    console.error('❌ Error enviando correo:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}