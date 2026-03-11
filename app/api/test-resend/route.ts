import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Email temporal de prueba
      to: ['oscarev1623@gmail.com'],
      subject: 'Prueba Resend',
      html: '<h1>Funciona!</h1><p>Correo de prueba desde Resend</p>'
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}