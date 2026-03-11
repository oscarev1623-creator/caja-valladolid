import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'server380.web-hosting.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contacto@cajavalladolid.com',
        pass: 'Dolar12032519$',
      },
    })

    // Correo ultra simple - SOLO TEXTO, sin HTML
    const info = await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to: 'oscarev1623@gmail.com',
      subject: '🔧 PRUEBA ULTRA SIMPLE - TEXTO SOLO',
      text: 'Hola, este es un correo de prueba con SOLO TEXTO. Sin HTML, sin estilos, sin nada. Fecha: ' + new Date().toISOString()
      // SIN HTML
    })

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}