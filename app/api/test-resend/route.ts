import { NextResponse } from 'next/server'

export async function GET() {
  // Temporalmente desactivado para evitar errores de build en Vercel
  // El código original está comentado abajo
  return NextResponse.json({ 
    success: true, 
    message: 'Endpoint de prueba Resend desactivado temporalmente para evitar errores de build' 
  })
}

/*
// CÓDIGO ORIGINAL - REACTIVAR CUANDO SE NECESITE
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET_ORIGINAL() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['oscarev1623@gmail.com'],
      subject: 'Prueba Resend',
      html: '<h1>Funciona!</h1><p>Correo de prueba desde Resend</p>'
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
*/