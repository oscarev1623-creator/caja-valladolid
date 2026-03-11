import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  console.log('📧 Probando envío de correo...')
  console.log('Configuración:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    // password no la mostramos por seguridad
  })

  try {
    // Crear transporter con la configuración del .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Importante para Namecheap
      }
    })

    // Verificar la conexión
    console.log('🔍 Verificando conexión SMTP...')
    await transporter.verify()
    console.log('✅ Conexión SMTP verificada')

    // Enviar correo de prueba
    console.log('📤 Enviando correo de prueba...')
    const info = await transporter.sendMail({
      from: `"Caja Valladolid" <${process.env.SMTP_USER}>`,
      to: 'oscarev1623@gmail.com', // Cambia esto por tu correo
      subject: '✅ Prueba de correo - Caja Valladolid',
      html: `
        <h1>¡Funciona!</h1>
        <p>Este es un correo de prueba desde Caja Valladolid.</p>
        <p>Si recibes esto, la configuración SMTP es correcta.</p>
        <p>Fecha y hora: ${new Date().toLocaleString()}</p>
      `
    })

    console.log('✅ Correo enviado:', info.messageId)

    return NextResponse.json({
      success: true,
      message: 'Correo enviado correctamente',
      messageId: info.messageId
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command
    }, { status: 500 })
  }
}