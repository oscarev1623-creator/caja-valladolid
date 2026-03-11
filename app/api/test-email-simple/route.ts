import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  console.log('='.repeat(50))
  console.log('📧 PRUEBA SIMPLE DE CORREO')
  console.log('='.repeat(50))
  
  try {
    // Configuración directa (sin usar .env)
    const transporter = nodemailer.createTransport({
      host: 'server380.web-hosting.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contacto@cajavalladolid.com',
        pass: 'Dolar12032519$',
      },
    })

    console.log('📧 Enviando correo de prueba simple...')
    
    const info = await transporter.sendMail({
      from: '"Prueba Caja Valladolid" <contacto@cajavalladolid.com>',
      to: 'oscarev1623@gmail.com',
      subject: '🔧 PRUEBA SIMPLE - ' + Date.now(),
      text: 'Este es un correo de prueba simple sin HTML. Si ves esto, el SMTP funciona.',
      html: '<h1>Prueba Simple</h1><p>Este correo NO tiene formato complejo.</p>'
    })

    console.log('✅ Enviado. Message ID:', info.messageId)
    console.log('📧 Respuesta del servidor:', info.response)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    }, { status: 500 })
  }
}