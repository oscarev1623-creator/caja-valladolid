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
    'USDT': 1,      // 1 USDT = 1 USD
    'BTC': 65000,   // 1 BTC = $65,000 USD
    'ETH': 3500,    // 1 ETH = $3,500 USD
    'BNB': 600,     // 1 BNB = $600 USD
    'SOL': 150,     // 1 SOL = $150 USD
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

    // ✅ VALORES CORREGIDOS
    const criptoMoneda = lead.selectedCrypto || 'USDT'
    const precioUSD = getCryptoPrice(criptoMoneda)
    const tipoCambio = 20 // 1 USD = 20 MXN

    // Monto en USDT (siempre la base es USDT)
    const montoUSDT = lead.estimatedAmount || 50000
    
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
    
    // Calcular pago mensual
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

    // Colores (púrpura para cripto)
    const primaryColor = '#7b2cbf'
    const secondaryColor = '#5a189a'
    const textColor = '#333333'
    const lightGray = '#f3f4f6'

    // --- ENCABEZADO ---
    doc.rect(0, 0, doc.page.width, 20).fill(primaryColor)
    
    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 30, { width: 80 })
      }
    } catch (error) {}
    
    doc.fillColor('white')
    doc.fontSize(20)
    doc.font('Helvetica-Bold')
    doc.text('CONTRATO DE CRÉDITO CRIPTO', 140, 45)
    doc.moveTo(50, 90).lineTo(doc.page.width - 50, 90).stroke(primaryColor)
    
    doc.fillColor(textColor)
    doc.fontSize(10)
    doc.font('Helvetica')
    doc.text(`Valladolid, Yucatán, ${new Date().toLocaleDateString('es-MX')}`, { align: 'right' })
    
    // --- DATOS DE LAS PARTES ---
    doc.rect(50, 120, doc.page.width - 100, 80).fill(lightGray).stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('LA INSTITUCIÓN (DIVISIÓN CRIPTO):', 60, 130)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    doc.text('Caja Popular San Bernardino de Siena Valladolid', 60, 145)
    doc.text('S.C. de A.P. de R.L. de C.V. · Reg: 29198 · CONDUSEF: 4930', 60, 158)
    doc.text('División de Activos Digitales', 60, 171)
    
    doc.rect(50, 210, doc.page.width - 100, 90).fill(lightGray).stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('EL ACREDITADO:', 60, 220)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    doc.text(lead.fullName.toUpperCase(), 60, 235)
    doc.text(`Email: ${lead.email} · Tel: ${lead.phone}`, 60, 248)
    doc.text(`Criptomoneda seleccionada: ${criptoMoneda}`, 60, 261)

    // --- TABLA DE DETALLES ---
    doc.fillColor(primaryColor)
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('DETALLES DEL CRÉDITO', 50, 320)
    
    doc.rect(50, 335, doc.page.width - 100, 140).fill(lightGray).stroke(primaryColor)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    
    let yPos = 345
    const leftCol = 70
    const rightCol = 350
    
    const detalles = [
      { label: `Monto en ${criptoMoneda}:`, valor: `${montoCripto} ${criptoMoneda}` },
      { label: 'Equivalente en MXN:', valor: `$${montoMXN} MXN` },
      { label: 'Tipo de cambio:', valor: `1 USD = $${tipoCambio} MXN · 1 ${criptoMoneda} = $${precioUSD.toLocaleString('es-MX')} USD` },
      { label: `Anticipo (10%):`, valor: `${anticipoCripto} ${criptoMoneda} ($${anticipoMXN} MXN)` },
      { label: 'Plazo:', valor: `${plazo} meses` },
      { label: 'Tasa anual:', valor: `${tasa}% fija` },
      { label: `Pago mensual:`, valor: `${pagoMensualCripto} ${criptoMoneda} ($${pagoMensualMXN} MXN)` },
      { label: 'Total a pagar:', valor: `${totalPagar} ${criptoMoneda}` }
    ]

    detalles.forEach(detalle => {
      doc.font('Helvetica').text(detalle.label, leftCol, yPos)
      doc.font('Helvetica-Bold').text(detalle.valor, rightCol, yPos)
      yPos += 16
    })

    // --- ANTICIPO DESTACADO ---
    doc.rect(50, 485, doc.page.width - 100, 60).fill('#f3e8ff').stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('🔒 ANTICIPO 10%', 60, 495)
    
    doc.fillColor(secondaryColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(`Monto: ${anticipoCripto} ${criptoMoneda} ($${anticipoMXN} MXN) · 70% a capital · 30% gastos admin`, 
      60, 510, { width: doc.page.width - 120 })

    // --- GARANTÍA ---
    doc.rect(50, 555, doc.page.width - 100, 40).fill('#f3e8ff').stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('🔐 GARANTÍA', 60, 565)
    
    doc.fillColor(secondaryColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(`20%: ${garantiaCripto} ${criptoMoneda} (genera rendimientos, se devuelve al finalizar)`, 
      60, 578, { width: doc.page.width - 120 })

    // --- CLÁUSULAS ---
    let currentY = 610
    const clausulas = [
      { t: 'CLÁUSULA PRIMERA - OBJETO', 
        t2: `Crédito en ${criptoMoneda} por ${montoCripto} ${criptoMoneda} (equivalente a $${montoMXN} MXN), a pagar en ${plazo} meses.` },
      { t: 'CLÁUSULA SEGUNDA - INTERESES', 
        t2: `Tasa fija ${tasa}% anual. Mora: 5% adicional.` },
      { t: 'CLÁUSULA TERCERA - ANTICIPO', 
        t2: `Anticipo del 10%: ${anticipoCripto} ${criptoMoneda} ($${anticipoMXN} MXN).` }
    ]

    clausulas.forEach(c => {
      doc.fillColor(primaryColor)
      doc.fontSize(9)
      doc.font('Helvetica-Bold')
      doc.text(c.t, 50, currentY)
      currentY += 12
      doc.fillColor(textColor)
      doc.fontSize(8)
      doc.font('Helvetica')
      const textHeight = doc.heightOfString(c.t2, { width: doc.page.width - 100 })
      doc.text(c.t2, 50, currentY, { width: doc.page.width - 100 })
      currentY += textHeight + 15
    })

    // --- NUEVA PÁGINA ---
    doc.addPage()
    currentY = 50

    // --- ENCABEZADO DE NUEVA PÁGINA ---
    doc.rect(0, 0, doc.page.width, 20).fill(primaryColor)
    
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 25, { width: 50 })
      }
    } catch (error) {}
    
    doc.fillColor('white')
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('CONTRATO CRIPTO (CONTINUACIÓN)', 110, 30)
    doc.moveTo(50, 55).lineTo(doc.page.width - 50, 55).stroke(primaryColor)

    // --- CLÁUSULAS RESTANTES ---
    const clausulasRestantes = [
      { t: 'CLÁUSULA CUARTA - GARANTÍA', 
        t2: `Garantía del 20%: ${garantiaCripto} ${criptoMoneda}. Se devuelve al finalizar más rendimientos.` },
      { t: 'CLÁUSULA QUINTA - ENTREGA', 
        t2: `Los fondos se entregarán en ${criptoMoneda} a la wallet o exchange designado por el ACREDITADO.` }
    ]

    currentY = 70
    clausulasRestantes.forEach(c => {
      doc.fillColor(primaryColor)
      doc.fontSize(9)
      doc.font('Helvetica-Bold')
      doc.text(c.t, 50, currentY)
      currentY += 12
      doc.fillColor(textColor)
      doc.fontSize(8)
      doc.font('Helvetica')
      const textHeight = doc.heightOfString(c.t2, { width: doc.page.width - 100 })
      doc.text(c.t2, 50, currentY, { width: doc.page.width - 100 })
      currentY += textHeight + 20
    })

    // --- FIRMAS ---
    const firmaY = doc.page.height - 140

    doc.moveTo(50, firmaY - 10).lineTo(doc.page.width - 50, firmaY - 10).stroke(primaryColor)
    
    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('FIRMAS', 50, firmaY, { align: 'center' })
    
    doc.fillColor(textColor)
    doc.fontSize(7)
    doc.font('Helvetica')
    doc.text('LEÍDO Y APROBADO EN VALLADOLID, YUCATÁN', 50, firmaY + 12, { align: 'center' })

    // FIRMA INSTITUCIÓN
    const instX = 70
    const instY = firmaY + 30
    
    doc.rect(instX - 10, instY - 5, 200, 70).fill('#f9fafb').stroke(primaryColor)
    
    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, instX - 20, instY - 10, { width: 140, height: 70 })
      }
    } catch {}
    
    doc.fillColor(primaryColor)
    doc.fontSize(8)
    doc.font('Helvetica-Bold')
    doc.text('PRESIDENTE DEL CONSEJO', instX, instY + 40)
    doc.fillColor(textColor)
    doc.fontSize(7)
    doc.text('LIC. JUAN CARLOS MÉNDEZ P.', instX, instY + 50)

    // FIRMA CLIENTE
    const cliX = doc.page.width - 270
    const cliY = firmaY + 30
    
    doc.rect(cliX - 10, cliY - 5, 200, 70).fill('#f9fafb').stroke(primaryColor)
    doc.moveTo(cliX, cliY + 15).lineTo(cliX + 150, cliY + 15).stroke(primaryColor)
    
    doc.fillColor(primaryColor)
    doc.fontSize(8)
    doc.font('Helvetica-Bold')
    doc.text('EL ACREDITADO', cliX, cliY + 40)
    doc.fillColor(textColor)
    doc.fontSize(7)
    doc.text(lead.fullName, cliX, cliY + 50)

    // --- PIE DE PÁGINA ---
    doc.fontSize(6)
    doc.fillColor('#999999')
    doc.text('Caja Popular San Bernardino de Siena Valladolid · División Cripto', 50, doc.page.height - 30, { align: 'center', width: doc.page.width - 100 })
    doc.text(`Reg: 29198 · CONDUSEF: 4930 · cripto@cajavalladolid.com`, 50, doc.page.height - 20, { align: 'center', width: doc.page.width - 100 })

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