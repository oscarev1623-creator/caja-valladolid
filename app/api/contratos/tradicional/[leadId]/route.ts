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

// 📌 FUNCIÓN PARA CALCULAR ANTICIPO POR RANGOS
const calculateAdvance = (amount: number) => {
  if (amount >= 50000 && amount <= 200000) {
    return 2308.23;
  } else if (amount > 200000 && amount <= 1000000) {
    return 6811.52;
  } else if (amount > 1000000 && amount <= 5000000) {
    return 9960.47;
  } else {
    return 0;
  }
};

// 📌 FUNCIÓN PARA CALCULAR PAGO MENSUAL (con tasa 11%)
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

    // Calcular valores con NUEVA tasa 11%
    const monto = lead.estimatedAmount || 50000
    const anticipo = calculateAdvance(monto)
    const plazo = 36
    const tasa = 11.0
    const montoNeto = monto - anticipo
    const pagoMensual = calculateMonthlyPayment(montoNeto, tasa, plazo)
    const totalPagar = pagoMensual * plazo
    const porcentajeAnticipo = ((anticipo / monto) * 100).toFixed(1)

    // Crear PDF
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    })
    
    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    // Colores CORPORATIVOS (verde)
    const primaryColor = '#059669' // Verde
    const secondaryColor = '#047857'
    const textColor = '#1f2937'
    const lightGray = '#f9fafb'

    // --- ENCABEZADO ---
    doc.rect(0, 0, doc.page.width, 100).fill(primaryColor) // Altura reducida

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
    doc.text('CONTRATO DE APERTURA DE CRÉDITO', 140, 35)

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

    // --- TABLA DE DETALLES ---
    doc.fillColor(primaryColor)
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text('DETALLES DEL CRÉDITO', 50, 220) // Ajustado por la fecha
    
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
      { label: 'Monto del crédito:', valor: `$${monto.toLocaleString('es-MX')} MXN` },
      { label: 'Anticipo (cuota fija):', valor: `$${anticipo.toLocaleString('es-MX')} MXN (${porcentajeAnticipo}%)` },
      { label: 'Monto neto a financiar:', valor: `$${montoNeto.toLocaleString('es-MX')} MXN` },
      { label: 'Plazo:', valor: `${plazo} meses (3 años)` },
      { label: 'Tasa de interés anual:', valor: `${tasa}% fija` },
      { label: 'Pago mensual:', valor: `$${Math.round(pagoMensual).toLocaleString('es-MX')} MXN` },
      { label: 'Total a pagar:', valor: `$${Math.round(totalPagar).toLocaleString('es-MX')} MXN` }
    ]

    detalles.forEach(detalle => {
      doc.text(detalle.label, 60, yPos)
      doc.font('Helvetica-Bold').text(detalle.valor, 400, yPos)
      doc.font('Helvetica')
      yPos += 18
    })

    // --- ANTICIPO ---
    const anticipoY = yPos + 10
    doc.roundedRect(50, anticipoY, doc.page.width - 100, 40, 3).fill('#ecfdf5').stroke(primaryColor)
    doc.fillColor(primaryColor)
    doc.fontSize(9)
    doc.font('Helvetica-Bold')
    doc.text('DETALLE DEL ANTICIPO', 60, anticipoY + 8)
    
    doc.fillColor(textColor)
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(
      `70% a capital: $${(anticipo * 0.7).toLocaleString('es-MX')} · 30% gastos admin: $${(anticipo * 0.3).toLocaleString('es-MX')}`,
      60, anticipoY + 20
    )

    // --- CLÁUSULAS ---
    let currentY = anticipoY + 60
    const clausulas = [
      `PRIMERA. La INSTITUCIÓN otorga al ACREDITADO un crédito por $${monto.toLocaleString('es-MX')} MXN, a pagar en ${plazo} meses.`,
      `SEGUNDA. El crédito devengará intereses ordinarios a una tasa fija anual del ${tasa}% sobre saldos insolutos.`,
      `TERCERA. El ACREDITADO cubrirá un anticipo de $${anticipo.toLocaleString('es-MX')} MXN (${porcentajeAnticipo}%), del cual el 70% se aplica a capital.`,
      `CUARTA. El ACREDITADO se obliga a realizar ${plazo} pagos mensuales de $${Math.round(pagoMensual).toLocaleString('es-MX')} MXN.`,
      `QUINTA. Pagos anticipados sin penalización, aplicables directamente a capital.`
    ]

    clausulas.forEach((texto, index) => {
      doc.fillColor(primaryColor)
      doc.fontSize(8)
      doc.font('Helvetica-Bold')
      doc.text(`CLÁUSULA ${['PRIMERA','SEGUNDA','TERCERA','CUARTA','QUINTA'][index]}`, 50, currentY)
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

// ✅ IMAGEN DE LA FIRMA DEL PRESIDENTE
try {
  const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
  if (fs.existsSync(firmaPath)) {
    doc.image(firmaPath, 75, firmaY + 15, { width: 150, height: 35 })
    console.log('✅ Firma cargada en tradicional')
  }
} catch (error) {
  console.error('❌ Error cargando firma:', error)
}

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

    // --- PIE DE PÁGINA ---
    doc.fontSize(5)
    doc.fillColor('#6b7280')
    doc.text(
      'Caja Popular San Bernardino de Siena Valladolid · Calle 40 #204B, Col. Centro, Valladolid, Yucatán · Tel: 985 856 1234', 
      50, doc.page.height - 40, 
      { align: 'center', width: doc.page.width - 100 }
    )
    doc.text(
      `Folio: ${lead.id.slice(-8).toUpperCase()} · Documento generado electrónicamente`, 
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