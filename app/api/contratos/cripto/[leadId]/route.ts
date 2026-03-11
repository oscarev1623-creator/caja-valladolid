import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'

// Importar el parche
import { patchPDFKit } from '@/lib/pdfkit-config'

// Aplicar el parche ANTES de usar PDFKit
patchPDFKit()

const prisma = new PrismaClient()

// Función para obtener precio de criptomoneda en USD
const getCryptoPrice = (crypto: string): number => {
  const prices: Record<string, number> = {
    'USDT': 1,
    'BTC': 65000,
    'ETH': 3500,
    'BNB': 600,
    'SOL': 150,
  }
  return prices[crypto] || 1
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params

    if (!leadId) {
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      )
    }

    // Buscar lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // ✅ VALORES REALES DEL LEAD
    const criptoMoneda = lead.selectedCrypto || 'BTC'
    const precioUSD = getCryptoPrice(criptoMoneda)
    const tipoCambio = 20 // 1 USD = 20 MXN

    // ✅ MONTO EN USDT (LO QUE EL USUARIO INGRESÓ)
    const montoUSDT = lead.estimatedAmount || 10000
    
    // Calcular valores
    const montoCripto = criptoMoneda === 'USDT' 
      ? montoUSDT.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : (montoUSDT / precioUSD).toLocaleString('es-MX', { minimumFractionDigits: 6, maximumFractionDigits: 6 })
    
    const montoMXN = (montoUSDT * tipoCambio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    const anticipoUSDT = montoUSDT * 0.10
    const anticipoCripto = criptoMoneda === 'USDT'
      ? anticipoUSDT.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : (anticipoUSDT / precioUSD).toLocaleString('es-MX', { minimumFractionDigits: 6, maximumFractionDigits: 6 })
    
    const anticipoMXN = (anticipoUSDT * tipoCambio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    const plazo = lead.plazo || 12
    const tasa = 5.4
    
    const tasaMensual = tasa / 100 / 12
    const netAmountUSDT = montoUSDT - anticipoUSDT
    const pagoMensualUSDT = (netAmountUSDT * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                            (Math.pow(1 + tasaMensual, plazo) - 1)
    
    const pagoMensualCripto = criptoMoneda === 'USDT'
      ? pagoMensualUSDT.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : (pagoMensualUSDT / precioUSD).toLocaleString('es-MX', { minimumFractionDigits: 6, maximumFractionDigits: 6 })
    
    const pagoMensualMXN = (pagoMensualUSDT * tipoCambio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const totalPagar = (pagoMensualUSDT * plazo).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    const garantiaCripto = criptoMoneda === 'USDT'
      ? (montoUSDT * 0.20).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : ((montoUSDT * 0.20) / precioUSD).toLocaleString('es-MX', { minimumFractionDigits: 6, maximumFractionDigits: 6 })

    // Crear PDF
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    })
    
    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    // Colores CORPORATIVOS (púrpura para cripto)
    const primaryColor = '#7b2cbf'
    const secondaryColor = '#5a189a'
    const textColor = '#1f2937'
    const lightGray = '#f9fafb'

    // --- ENCABEZADO ---
    doc.rect(0, 0, doc.page.width, 100).fill(primaryColor)

    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 20, { width: 70 })
      }
    } catch (error) {}

    doc.fillColor('white')
    doc.fontSize(22)
    doc.font('Helvetica-Bold')
    doc.text('CONTRATO DE CRÉDITO CRIPTO', 140, 35)

    // --- DATOS DE LAS PARTES ---
    // Institución
    doc.roundedRect(50, 120, 240, 70, 5).fill(lightGray).stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('LA INSTITUCIÓN', 65, 130)
    
    doc.fillColor(textColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text('Caja Popular San Bernardino', 65, 145)
    doc.text('de Siena Valladolid S.C. de A.P.', 65, 158)
    doc.text('Reg: 29198 · CONDUSEF: 4930', 65, 171)
    
    // Fecha debajo de Institución
    doc.fillColor(primaryColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(`${new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })}`, 65, 185)
    
    // Acreditado
    doc.roundedRect(310, 120, 240, 70, 5).fill(lightGray).stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('EL ACREDITADO', 325, 130)
    
    doc.fillColor(textColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(lead.fullName.length > 30 ? lead.fullName.substring(0, 27) + '...' : lead.fullName, 325, 145)
    doc.text(`Email: ${lead.email}`, 325, 158)
    doc.text(`Tel: ${lead.phone}`, 325, 171)
    doc.text(`Criptomoneda: ${criptoMoneda}`, 325, 184)

    // --- TABLA DE DETALLES ---
    doc.fillColor(primaryColor)
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('DETALLES DEL CRÉDITO', 50, 220)
    
    // Cabecera
    doc.roundedRect(50, 235, doc.page.width - 100, 20, 3).fill(primaryColor)
    doc.fillColor('white')
    doc.fontSize(9)
    doc.font('Helvetica-Bold')
    doc.text('CONCEPTO', 60, 240)
    doc.text('VALOR', 400, 240)
    
    // Filas
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    
    let yPos = 265
    const detalles = [
      { label: `Monto solicitado en ${criptoMoneda}:`, valor: `${montoCripto} ${criptoMoneda}` },
      { label: 'Equivalente en MXN:', valor: `$${montoMXN} MXN` },
      { label: 'Anticipo (10%):', valor: `${anticipoCripto} ${criptoMoneda} ($${anticipoMXN} MXN)` },
      { label: 'Plazo:', valor: `${plazo} meses` },
      { label: 'Tasa anual:', valor: `${tasa}% fija` },
      { label: 'Pago mensual:', valor: `${pagoMensualCripto} ${criptoMoneda} ($${pagoMensualMXN} MXN)` },
      { label: 'Total a pagar:', valor: `${totalPagar} ${criptoMoneda}` },
      { label: 'Garantía (20%):', valor: `${garantiaCripto} ${criptoMoneda}` }
    ]

    detalles.forEach(detalle => {
      doc.text(detalle.label, 60, yPos)
      doc.font('Helvetica-Bold').text(detalle.valor, 400, yPos)
      doc.font('Helvetica')
      yPos += 18
    })

    // --- ANTICIPO Y GARANTÍA ---
    const anticipoY = yPos + 10
    doc.roundedRect(50, anticipoY, doc.page.width - 100, 40, 3).fill('#f3e8ff').stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(9)
    doc.font('Helvetica-Bold')
    doc.text('DETALLE DEL ANTICIPO Y GARANTÍA', 60, anticipoY + 8)
    
    doc.fillColor(textColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(
      `Anticipo 10%: ${anticipoCripto} ${criptoMoneda} · Garantía 20%: ${garantiaCripto} ${criptoMoneda} (genera rendimientos)`,
      60, anticipoY + 20
    )

    // --- CLÁUSULAS ---
    let currentY = anticipoY + 60
    const clausulas = [
      `PRIMERA. La INSTITUCIÓN otorga al ACREDITADO un crédito en ${criptoMoneda} por ${montoCripto} ${criptoMoneda} (equivalente a $${montoMXN} MXN), a pagar en ${plazo} meses.`,
      `SEGUNDA. El crédito devengará intereses ordinarios a una tasa fija anual del ${tasa}% sobre saldos insolutos.`,
      `TERCERA. El ACREDITADO cubrirá un anticipo del 10%: ${anticipoCripto} ${criptoMoneda} ($${anticipoMXN} MXN).`,
      `CUARTA. El ACREDITADO constituye una garantía del 20%: ${garantiaCripto} ${criptoMoneda}, que generará rendimientos y será devuelta al finalizar.`,
      `QUINTA. El ACREDITADO se obliga a realizar ${plazo} pagos mensuales de ${pagoMensualCripto} ${criptoMoneda} ($${pagoMensualMXN} MXN).`,
      `SEXTA. Pagos anticipados sin penalización, aplicables directamente a capital.`,
      `SÉPTIMA. Los fondos se entregarán en ${criptoMoneda} a la wallet o exchange designado por el ACREDITADO.`
    ]

    clausulas.forEach((texto, index) => {
      doc.fillColor(primaryColor)
      doc.fontSize(8)
      doc.font('Helvetica-Bold')
      doc.text(`CLÁUSULA ${['PRIMERA','SEGUNDA','TERCERA','CUARTA','QUINTA','SEXTA','SÉPTIMA'][index]}`, 50, currentY)
      currentY += 10
      doc.fillColor(textColor)
      doc.fontSize(8)
      doc.font('Helvetica')
      doc.text(texto, 50, currentY, { width: doc.page.width - 100, align: 'left' })
      currentY += 20
    })

    // --- FIRMAS ---
    const firmaY = doc.page.height - 130

    // Línea separadora
    doc.strokeColor(primaryColor)
    .lineWidth(1)
    .moveTo(50, firmaY - 10)
    .lineTo(doc.page.width - 50, firmaY - 10)
    .stroke()

    doc.fillColor(primaryColor)
    doc.fontSize(9)
    doc.font('Helvetica-Bold')
    doc.text('FIRMAS', 50, firmaY - 5, { align: 'center' })

    // FIRMA INSTITUCIÓN (izquierda)
    doc.roundedRect(70, firmaY + 10, 200, 60, 3).stroke(primaryColor)

    // Línea para firma
    doc.strokeColor(primaryColor)
    .lineWidth(1)
    .moveTo(80, firmaY + 40)
    .lineTo(240, firmaY + 40)
    .stroke()

    // Imagen de la firma del presidente
    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, 75, firmaY + 15, { width: 150, height: 35 })
      }
    } catch (error) {}

    doc.fillColor(primaryColor)
    doc.fontSize(7)
    doc.font('Helvetica-Bold')
    doc.text('PRESIDENTE DEL CONSEJO', 80, firmaY + 45)
    doc.fillColor(textColor)
    doc.fontSize(6)
    doc.text('LIC. JUAN CARLOS MÉNDEZ P.', 80, firmaY + 53)

    // FIRMA CLIENTE (derecha)
    doc.roundedRect(330, firmaY + 10, 200, 60, 3).stroke(primaryColor)
    doc.strokeColor(primaryColor)
    .lineWidth(1)
    .moveTo(340, firmaY + 40)
    .lineTo(500, firmaY + 40)
    .stroke()

    doc.fillColor(primaryColor)
    doc.fontSize(7)
    doc.font('Helvetica-Bold')
    doc.text('EL ACREDITADO', 340, firmaY + 45)
    doc.fillColor(textColor)
    doc.fontSize(6)
    doc.text(lead.fullName.length > 30 ? lead.fullName.substring(0, 27) + '...' : lead.fullName, 340, firmaY + 53)
    doc.text(`Wallet: ___________________`, 340, firmaY + 61)

    // --- PIE DE PÁGINA ---
    doc.fontSize(5)
    doc.fillColor('#6b7280')
    doc.text(
      'Caja Popular San Bernardino de Siena Valladolid · División de Activos Digitales', 
      50, doc.page.height - 40, 
      { align: 'center', width: doc.page.width - 100 }
    )
    doc.text(
      `Folio: ${lead.id.slice(-8).toUpperCase()} · Documento generado electrónicamente · ${new Date().toLocaleDateString('es-MX')}`, 
      50, doc.page.height - 30, 
      { align: 'center', width: doc.page.width - 100 }
    )

    doc.end()

    return new Promise<NextResponse>((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="CONTRATO_CRIPTO_${lead.fullName.replace(/\s/g, '_')}.pdf"`
            }
          })
        )
      })
    })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json(
      { error: 'Error generando contrato cripto' },
      { status: 500 }
    )
  }
}