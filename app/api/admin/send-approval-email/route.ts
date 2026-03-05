import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Configuración con las nuevas credenciales de Ethereal
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'edd2@ethereal.email',
    pass: '6Rfh9Fy6pRv54wfezq'
  }
})

// 📌 FUNCIÓN COPIADA DE LA CALCULADORA - Calcular anticipo FIJO según monto
const calculateAdvance = (amount: number) => {
  if (amount >= 10000 && amount <= 30000) return 800;
  if (amount >= 40000 && amount <= 60000) return 900;   // Para $50,000 retorna $900
  if (amount >= 70000 && amount <= 90000) return 1000;
  if (amount >= 100000 && amount <= 120000) return 1100;
  if (amount >= 130000 && amount <= 150000) return 1200;
  if (amount >= 160000 && amount <= 180000) return 1250;
  if (amount >= 190000 && amount <= 200000) return 1300;
  if (amount >= 210000 && amount <= 240000) return 1350;
  if (amount >= 250000 && amount <= 280000) return 1400;
  if (amount >= 290000 && amount <= 320000) return 1450;
  if (amount >= 330000 && amount <= 360000) return 1500;
  if (amount >= 370000 && amount <= 400000) return 1500;
  if (amount >= 410000 && amount <= 440000) return 2000;
  if (amount >= 450000 && amount <= 470000) return 2500;
  if (amount >= 480000 && amount <= 500000) return 3000;
  if (amount >= 600000) return amount * 0.005; // 0.5% del monto
  return 0;
};

// 📌 FUNCIÓN PARA CALCULAR PAGO MENSUAL (con tasa correcta)
const calculateMonthlyPayment = (monto: number, tasaAnual: number, meses: number) => {
  const tasaMensual = tasaAnual / 100 / 12;
  const netAmount = monto; // No restamos anticipo aquí porque ya se manejó aparte
  
  const monthlyPayment = (netAmount * tasaMensual * Math.pow(1 + tasaMensual, meses)) / 
                         (Math.pow(1 + tasaMensual, meses) - 1);
  
  return monthlyPayment;
};

export async function POST(request: NextRequest) {
  try {
    // Verificar sesión
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { leadId } = await request.json()

    // Obtener datos del lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Calcular valores
    const monto = lead.estimatedAmount || 50000
    const anticipo = calculateAdvance(monto)
    const porcentajeAnticipo = ((anticipo / monto) * 100).toFixed(1)
    
    // ✅ TASA CORRECTA: 6.9% anual
    const tasa = 6.9
    const plazo = 36 // meses
    
    // Calcular pago mensual con la tasa correcta
    const pagoMensual = calculateMonthlyPayment(monto, tasa, plazo)
    
    // Calcular total de intereses (para referencia)
    const totalPagar = pagoMensual * plazo
    const totalIntereses = totalPagar - monto

    // Leer la plantilla HTML
    const templatePath = path.join(process.cwd(), 'emails', 'aprobacion.html')
    let htmlContent = fs.readFileSync(templatePath, 'utf8')

    // Reemplazar variables
    htmlContent = htmlContent
      .replace('{{nombre_cliente}}', lead.fullName)
      .replace('{{monto}}', monto.toLocaleString('es-MX'))
      .replace('{{plazo}}', plazo.toString())
      .replace('{{tasa}}', tasa.toString())
      .replace('{{pago_mensual}}', Math.round(pagoMensual).toLocaleString('es-MX'))
      .replace('{{anticipo}}', anticipo.toLocaleString('es-MX'))
      .replace('{{porcentaje_anticipo}}', porcentajeAnticipo)
      .replace('{{descuento_capital}}', (anticipo * 0.7).toLocaleString('es-MX'))
      .replace('{{gastos_admin}}', (anticipo * 0.3).toLocaleString('es-MX'))
      .replace('{{primer_pago}}', new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-MX'))
      .replace('{{link_contrato}}', `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/contratos/${lead.id}`)
      .replace('{{link_firma}}', `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/firmar/${lead.id}`)
      // Agregar estas variables si tu plantilla las usa
      .replace('{{total_intereses}}', Math.round(totalIntereses).toLocaleString('es-MX'))
      .replace('{{total_pagar}}', Math.round(totalPagar).toLocaleString('es-MX'))

    // Enviar correo
    const info = await transporter.sendMail({
      from: '"Caja Valladolid" <contacto@cajavalladolid.com>',
      to: lead.email,
      subject: '✅ ¡Felicidades! Tu crédito ha sido aprobado',
      html: htmlContent,
    })

    console.log('✅ Correo enviado. URL de vista previa:', nodemailer.getTestMessageUrl(info))
    console.log('📊 Valores calculados:', {
      monto,
      anticipo,
      tasa,
      pagoMensual: Math.round(pagoMensual),
      totalIntereses: Math.round(totalIntereses)
    })

    // Actualizar estado del lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        status: 'APPROVED',
        approvedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Correo enviado correctamente',
      previewUrl: nodemailer.getTestMessageUrl(info)
    })

  } catch (error) {
    console.error('Error enviando correo:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}