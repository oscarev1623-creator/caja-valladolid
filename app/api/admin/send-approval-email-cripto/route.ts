import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'edd2@ethereal.email',
    pass: '6Rfh9Fy6pRv54wfezq'
  }
})

// Función para obtener precio de criptomoneda en USD
const getCryptoPrice = (crypto: string): number => {
  const prices: Record<string, number> = {
    'USDT': 1,      // 1 USDT = 1 USD
    'BTC': 65000,   // 1 BTC = $65,000 USD
    'ETH': 3500,    // 1 ETH = $3,500 USD
    'BNB': 600,     // 1 BNB = $600 USD
    'SOL': 150,     // 1 SOL = $150 USD
  }
  return prices[crypto] || 1
}

const calculateAdvanceCripto = (amount: number) => {
  return amount * 0.10; // 10% del monto
};

export async function POST(request: NextRequest) {
  console.log('🚀 CORREO CRIPTO - INICIANDO...')
  
  try {
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { leadId } = await request.json()

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // ✅ Obtener la criptomoneda seleccionada por el usuario
    const criptoMoneda = lead.selectedCrypto || 'USDT'
    
    // Obtener precio en USD
    const precioUSD = getCryptoPrice(criptoMoneda)
    
    // Tipo de cambio USD a MXN
    const tipoCambioUSDMXN = 20 // 1 USD = 20 MXN

    // Monto en USDT (siempre la base es USDT)
    const montoUSDT = lead.estimatedAmount || 50000
    
    // Calcular valores según la criptomoneda elegida
    let montoCripto, montoMXN, anticipoCripto, anticipoMXN, pagoMensualCripto, pagoMensualMXN

    if (criptoMoneda === 'USDT') {
      // Para USDT, es directo
      montoCripto = montoUSDT
      montoMXN = montoUSDT * tipoCambioUSDMXN
      anticipoCripto = montoUSDT * 0.10
      anticipoMXN = anticipoCripto * tipoCambioUSDMXN
    } else {
      // Para otras criptos, convertir de USDT a la cripto seleccionada
      montoCripto = montoUSDT / precioUSD // Ej: 50,000 USDT / $65,000 = 0.769 BTC
      montoMXN = montoUSDT * tipoCambioUSDMXN
      anticipoCripto = (montoUSDT * 0.10) / precioUSD
      anticipoMXN = (montoUSDT * 0.10) * tipoCambioUSDMXN
    }

    const plazo = lead.plazo || 12
    const tasa = 5.4

    // Calcular pago mensual
    const tasaMensual = tasa / 100 / 12
    const netAmountUSDT = montoUSDT - (montoUSDT * 0.10)
    const pagoMensualUSDT = (netAmountUSDT * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                            (Math.pow(1 + tasaMensual, plazo) - 1)
    
    if (criptoMoneda === 'USDT') {
      pagoMensualCripto = pagoMensualUSDT
    } else {
      pagoMensualCripto = pagoMensualUSDT / precioUSD
    }
    pagoMensualMXN = pagoMensualUSDT * tipoCambioUSDMXN

    console.log('💰 Valores calculados:', {
      criptoMoneda,
      precioUSD,
      montoUSDT,
      montoCripto: montoCripto.toFixed(6),
      montoMXN,
      anticipoCripto: anticipoCripto.toFixed(6),
      anticipoMXN,
      pagoMensualCripto: pagoMensualCripto.toFixed(6),
      pagoMensualMXN: Math.round(pagoMensualMXN)
    })

    // Determinar el logo según la criptomoneda
    let logoPath = path.join(process.cwd(), 'public', 'crypto-logos', `${criptoMoneda.toLowerCase()}.png`)
    if (!fs.existsSync(logoPath)) {
      logoPath = path.join(process.cwd(), 'public', 'crypto-logos', 'bitcoin.png') // fallback
    }

    // Leer plantilla
    const templatePath = path.join(process.cwd(), 'emails', 'aprobacion-cripto.html')
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { success: false, error: 'Plantilla de correo no encontrada' },
        { status: 500 }
      )
    }

    let htmlContent = fs.readFileSync(templatePath, 'utf8')

// Reemplazar variables
htmlContent = htmlContent
  .replace(/{{nombre_cliente}}/g, lead.fullName)
  .replace(/{{cripto}}/g, criptoMoneda)
  .replace(/{{monto_usdt}}/g, montoUSDT.toLocaleString('es-MX'))
  .replace(/{{monto_cripto}}/g, montoCripto.toLocaleString('es-MX', { 
    minimumFractionDigits: criptoMoneda === 'USDT' ? 2 : 6,
    maximumFractionDigits: criptoMoneda === 'USDT' ? 2 : 6
  }))
  .replace(/{{monto_mxn}}/g, Math.round(montoMXN).toLocaleString('es-MX'))
  .replace(/{{precio_usd}}/g, precioUSD.toLocaleString('es-MX'))
  .replace(/{{tipo_cambio_mxn}}/g, tipoCambioUSDMXN.toString())
  .replace(/{{anticipo_usdt}}/g, (montoUSDT * 0.10).toLocaleString('es-MX'))
  .replace(/{{anticipo_usdt_70}}/g, Math.round(montoUSDT * 0.10 * 0.7).toLocaleString('es-MX')) // ✅ NUEVO
  .replace(/{{anticipo_usdt_30}}/g, Math.round(montoUSDT * 0.10 * 0.3).toLocaleString('es-MX')) // ✅ NUEVO
  .replace(/{{anticipo_cripto}}/g, anticipoCripto.toLocaleString('es-MX', { 
    minimumFractionDigits: criptoMoneda === 'USDT' ? 2 : 6,
    maximumFractionDigits: criptoMoneda === 'USDT' ? 2 : 6
  }))
  .replace(/{{anticipo_mxn}}/g, Math.round(anticipoMXN).toLocaleString('es-MX'))
  .replace(/{{pago_mensual_usdt}}/g, Math.round(pagoMensualUSDT).toLocaleString('es-MX'))
  .replace(/{{pago_mensual_cripto}}/g, pagoMensualCripto.toLocaleString('es-MX', { 
    minimumFractionDigits: criptoMoneda === 'USDT' ? 2 : 6,
    maximumFractionDigits: criptoMoneda === 'USDT' ? 2 : 6
  }))
  .replace(/{{pago_mensual_mxn}}/g, Math.round(pagoMensualMXN).toLocaleString('es-MX'))
  .replace(/{{plazo}}/g, plazo.toString())
  .replace(/{{tasa}}/g, tasa.toString())
  .replace(/{{primer_pago}}/g, new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-MX'))
  .replace(/{{link_contrato}}/g, `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/contratos/cripto/${lead.id}`)

    // Enviar correo con el logo adjunto
    const info = await transporter.sendMail({
      from: '"Caja Valladolid - División Cripto" <contacto@cajavalladolid.com>',
      to: lead.email,
      subject: `₿ ¡Felicidades! Tu crédito en ${criptoMoneda} ha sido aprobado`,
      html: htmlContent,
      attachments: [
        {
          filename: `${criptoMoneda.toLowerCase()}.png`,
          path: logoPath,
          cid: 'cripto_logo'
        }
      ]
    })

    console.log('✅ Correo cripto enviado. URL:', nodemailer.getTestMessageUrl(info))

    return NextResponse.json({
      success: true,
      message: 'Correo cripto enviado correctamente',
      previewUrl: nodemailer.getTestMessageUrl(info)
    })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}