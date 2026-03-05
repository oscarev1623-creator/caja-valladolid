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

// 📌 FUNCIÓN PARA CALCULAR ANTICIPO (misma que la calculadora)
const calculateAdvance = (amount: number) => {
  if (amount >= 10000 && amount <= 30000) return 800;
  if (amount >= 40000 && amount <= 60000) return 900;
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
  if (amount >= 600000) return amount * 0.005;
  return 0;
};

// 📌 FUNCIÓN PARA CALCULAR PAGO MENSUAL (con tasa 6.9%)
const calculateMonthlyPayment = (monto: number, tasaAnual: number, meses: number) => {
  const tasaMensual = tasaAnual / 100 / 12;
  const monthlyPayment = (monto * tasaMensual * Math.pow(1 + tasaMensual, meses)) / 
                         (Math.pow(1 + tasaMensual, meses) - 1);
  return monthlyPayment;
};

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

    // Calcular valores
    const monto = lead.estimatedAmount || 50000
    const anticipo = calculateAdvance(monto)
    const plazo = 36
    const tasa = 6.9
    const pagoMensual = calculateMonthlyPayment(monto, tasa, plazo)
    const totalPagar = pagoMensual * plazo
    const porcentajeAnticipo = ((anticipo / monto) * 100).toFixed(1)

    // Crear PDF
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    })
    
    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    // Colores
    const primaryColor = '#059669'
    const secondaryColor = '#065f46'
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
    doc.text('CONTRATO DE APERTURA DE CRÉDITO', 140, 45)
    doc.moveTo(50, 90).lineTo(doc.page.width - 50, 90).stroke(primaryColor)
    
    doc.fillColor(textColor)
    doc.fontSize(10)
    doc.font('Helvetica')
    doc.text(`Valladolid, Yucatán, ${new Date().toLocaleDateString('es-MX')}`, { align: 'right' })
    
    // --- DATOS DE LAS PARTES (más compactos) ---
    doc.rect(50, 120, doc.page.width - 100, 80).fill(lightGray).stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('LA INSTITUCIÓN:', 60, 130)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    doc.text('Caja Popular San Bernardino de Siena Valladolid', 60, 145)
    doc.text('S.C. de A.P. de R.L. de C.V. · Reg: 29198 · CONDUSEF: 4930', 60, 158)
    doc.text('Calle 40 #204B, Col. Centro, Valladolid, Yucatán', 60, 171)
    
    doc.rect(50, 210, doc.page.width - 100, 80).fill(lightGray).stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(11)
    doc.font('Helvetica-Bold')
    doc.text('EL ACREDITADO:', 60, 220)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    doc.text(lead.fullName.toUpperCase(), 60, 235)
    doc.text(`Email: ${lead.email} · Tel: ${lead.phone}`, 60, 248)

    // --- TABLA DE DETALLES ---
    doc.fillColor(primaryColor)
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('DETALLES DEL CRÉDITO', 50, 310)
    
    doc.rect(50, 325, doc.page.width - 100, 110).fill(lightGray).stroke(primaryColor)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    
    let yPos = 335
    const leftCol = 70
    const rightCol = 350
    
    const detalles = [
      { label: 'Monto del crédito:', valor: `$${monto.toLocaleString('es-MX')} MXN` },
      { label: 'Anticipo:', valor: `$${anticipo.toLocaleString('es-MX')} (${porcentajeAnticipo}%)` },
      { label: 'Plazo:', valor: `${plazo} meses` },
      { label: 'Tasa anual:', valor: `${tasa}% fija` },
      { label: 'Pago mensual:', valor: `$${Math.round(pagoMensual).toLocaleString('es-MX')} MXN` },
      { label: 'Total a pagar:', valor: `$${Math.round(totalPagar).toLocaleString('es-MX')} MXN` }
    ]

    detalles.forEach(detalle => {
      doc.font('Helvetica').text(detalle.label, leftCol, yPos)
      doc.font('Helvetica-Bold').text(detalle.valor, rightCol, yPos)
      yPos += 16
    })

    // --- ANTICIPO DESTACADO (más compacto) ---
    doc.rect(50, 445, doc.page.width - 100, 60).fill('#e6f7f0').stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('🔒 ANTICIPO', 60, 455)
    
    doc.fillColor(secondaryColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(`Monto: $${anticipo.toLocaleString('es-MX')} · 70% a capital ($${(anticipo*0.7).toLocaleString('es-MX')}) · 30% gastos ($${(anticipo*0.3).toLocaleString('es-MX')})`, 
      60, 470, { width: doc.page.width - 120 })

    // --- CLÁUSULAS (reducidas y más compactas) ---
    let currentY = 520
    const clausulas = [
      { t: 'CLÁUSULA PRIMERA - OBJETO', 
        t2: `Crédito por $${monto.toLocaleString('es-MX')} a pagar en ${plazo} meses.` },
      { t: 'CLÁUSULA SEGUNDA - INTERESES', 
        t2: `Tasa fija ${tasa}% anual. Mora: 5% adicional.` },
      { t: 'CLÁUSULA TERCERA - ANTICIPO', 
        t2: `Anticipo de $${anticipo.toLocaleString('es-MX')} (${porcentajeAnticipo}%).` },
      { t: 'CLÁUSULA CUARTA - TARJETA', 
        t2: 'Tarjeta enviada a domicilio al confirmar anticipo.' }
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
      doc.text(c.t2, 50, currentY, { width: doc.page.width - 100 })
      currentY += 20
    })

    // --- FIRMAS (perfectamente simétricas al final de la página) ---
    const firmaY = doc.page.height - 140

    // Línea separadora
    doc.moveTo(50, firmaY - 10).lineTo(doc.page.width - 50, firmaY - 10).stroke(primaryColor)
    
    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('FIRMAS', 50, firmaY, { align: 'center' })
    
    doc.fillColor(textColor)
    doc.fontSize(7)
    doc.font('Helvetica')
    doc.text('LEÍDO Y APROBADO EN VALLADOLID, YUCATÁN', 50, firmaY + 12, { align: 'center' })

    // FIRMA INSTITUCIÓN (izquierda)
    const instX = 70
    const instY = firmaY + 30
    
    doc.rect(instX - 10, instY - 5, 200, 70).fill('#f9fafb').stroke(primaryColor)
    
    // Imagen de firma
    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, instX -20, instY -10, { width: 140, height: 70 })
      } else {
        doc.moveTo(instX, instY + 15).lineTo(instX + 150, instY + 15).stroke(primaryColor)
      }
    } catch {
      doc.moveTo(instX, instY + 15).lineTo(instX + 150, instY + 15).stroke(primaryColor)
    }
    
    doc.fillColor(primaryColor)
    doc.fontSize(8)
    doc.font('Helvetica-Bold')
    doc.text('PRESIDENTE DEL CONSEJO', instX, instY + 40)
    doc.fillColor(textColor)
    doc.fontSize(7)
    doc.text('LIC. JUAN CARLOS MÉNDEZ P.', instX, instY + 50)

    // FIRMA CLIENTE (derecha) - PERFECTAMENTE SIMÉTRICA
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
    doc.text(lead.fullName.length > 30 ? lead.fullName.substring(0, 27) + '...' : lead.fullName, cliX, cliY + 50)

    // --- PIE DE PÁGINA ---
    doc.fontSize(6)
    doc.fillColor('#999999')
    doc.text('Caja Popular San Bernardino de Siena Valladolid · S.C. de A.P. de R.L. de C.V.', 50, doc.page.height - 30, { align: 'center', width: doc.page.width - 100 })
    doc.text(`Reg: 29198 · CONDUSEF: 4930 · Calle 40 #204B, Valladolid, Yucatán`, 50, doc.page.height - 20, { align: 'center', width: doc.page.width - 100 })

    doc.end()

return new Promise<NextResponse>((resolve) => {
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks)
    resolve(
      new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="CONTRATO_${lead.fullName.replace(/\s/g, '_')}.pdf"`
        }
      })
    )
  })
})

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json(
      { error: 'Error generando contrato' },
      { status: 500 }
    )
  }
}