import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'

// ✅ PARCHE PARA VERCEL
function patchPDFKit() {
  if (typeof window === 'undefined') {
    const fsModule = require('fs')
    const originalReadFileSync = fsModule.readFileSync
    
    fsModule.readFileSync = function(filePath: string, options?: any) {
      if (typeof filePath === 'string' && filePath.includes('.afm')) {
        console.log('⚠️ Interceptada búsqueda de archivo AFM:', path.basename(filePath))
        // Devolver datos AFM mínimos
        return Buffer.from(`
          FontName Helvetica
          FullName Helvetica
          FamilyName Helvetica
          Weight Medium
          ItalicAngle 0
          IsFixedPitch false
          CharacterSet ExtendedRoman
          FontBBox -166 -225 1000 931
          UnderlinePosition -100
          UnderlineThickness 50
          Version 001.000
          StartFontMetrics 2.0
          EndFontMetrics
        `)
      }
      return originalReadFileSync.call(fsModule, filePath, options)
    }
  }
}

// Aplicar parche
patchPDFKit()

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params

    if (!leadId) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    }

    console.log('📄 Generando PDF para lead:', lead.id)

    const monto = lead.estimatedAmount || 50000
    const plazo = lead.plazo || 36
    const tasa = lead.creditType === 'CRYPTO' ? 5.4 : 11.0

    const polizaTipo = monto <= 100000 ? 'Tipo I' : 'Tipo II'
    const polizaCosto = monto <= 100000 ? 1132.82 : 2211.82

    const doc = new PDFDocument({ 
      margin: 60, 
      size: 'A4'
    })

    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    const primaryColor = '#059669'
    const accentColor = '#f7931a'
    const textColor = '#1f2937'
    const grayColor = '#6b7280'

    // ============================================
    // HEADER
    // ============================================
    doc.rect(0, 0, doc.page.width, 90).fill(primaryColor)

    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 60, 25, { width: 70 })
      }
    } catch (e) {}

    doc
      .fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('Carta de Formalización', 140, 30)

    doc
      .font('Helvetica')
      .fontSize(10)
      .text('Formalización Legal y Administrativa', 140, 55)

    doc.moveDown(4)

    // ============================================
    // DATOS DEL CLIENTE
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Datos del acreditado')

    doc.moveDown(0.5)

    const cardStartY = doc.y

    doc
      .roundedRect(60, cardStartY, doc.page.width - 120, 75, 6)
      .fill('#ecfdf5')

    doc
      .fillColor(textColor)
      .font('Helvetica')
      .fontSize(10)

    doc.text(`Nombre: ${lead.fullName || 'N/A'}`, 75, cardStartY + 12)
    doc.text(`Correo: ${lead.email || 'N/A'}`, 75, cardStartY + 28)
    doc.text(`Teléfono: ${lead.phone || 'N/A'}`, 75, cardStartY + 44)
    doc.text(`Folio: #${lead.id.slice(-8).toUpperCase()}`, 75, cardStartY + 60)

    doc.moveDown(6)

    // ============================================
    // SALUDO
    // ============================================
    const nombrePila = lead.fullName?.split(' ')[0] || 'Cliente'

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(textColor)
      .text(`Estimado/a ${nombrePila}:`)

    doc.moveDown(0.5)

    doc.text(
      'Para dar continuidad al proceso y proceder con la liberación de los fondos aprobados, ' +
      'el siguiente paso consiste en la formalización legal y administrativa de la operación.',
      { align: 'justify' }
    )

    doc.moveDown(2)

    // ============================================
    // TABLA DE DETALLES
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Detalles del crédito')

    doc.moveDown(0.5)

    const tableWidth = doc.page.width - 120
    const col1 = tableWidth * 0.5

    const tableHeaderY = doc.y
    doc.rect(60, tableHeaderY, tableWidth, 22).fill(primaryColor)

    doc
      .fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('Concepto', 70, tableHeaderY + 6)

    doc.text('Valor', 60 + col1, tableHeaderY + 6, {
      width: tableWidth - col1 - 10,
      align: 'right'
    })

    doc.moveDown(1.5)

    const detalles = [
      { label: 'Monto aprobado', valor: `$${monto.toLocaleString('es-MX')} MXN` },
      { label: 'Plazo', valor: `${plazo} meses` },
      { label: 'Tasa de interés', valor: `${tasa}% anual fija` },
      { label: 'Tipo de crédito', valor: lead.creditType === 'CRYPTO' ? 'Criptomonedas' : 'Tradicional' }
    ]

    detalles.forEach((d, i) => {
      const rowY = doc.y

      doc
        .rect(60, rowY, tableWidth, 20)
        .fill(i % 2 === 0 ? '#f9fafb' : 'white')

      doc
        .fillColor(textColor)
        .font('Helvetica')
        .fontSize(9)
        .text(d.label, 70, rowY + 5)

      doc
        .font('Helvetica-Bold')
        .text(d.valor, 60 + col1, rowY + 5, {
          width: tableWidth - col1 - 10,
          align: 'right'
        })

      doc.moveDown(1.2)
    })

    doc.moveDown(2)

    // ============================================
    // REQUISITOS DE GARANTÍA
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Requisitos de garantía')

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(textColor)
      .text(
        'Se requiere respaldo mediante garantía real (bien mueble o inmueble) con cobertura mínima ' +
        'del 200% del monto solicitado.',
        { align: 'justify' }
      )

    doc.moveDown(1.5)

    // ============================================
    // PÓLIZAS DE SEGURO
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Pólizas de seguro')

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(textColor)
      .text('• Tipo I: Hasta $100,000 MXN → Prima: $1,132.82 MXN')
      .text('• Tipo II: Más de $100,000 MXN → Prima: $2,211.82 MXN')

    doc.moveDown()

    const polizaBoxY = doc.y
    doc
      .roundedRect(60, polizaBoxY, doc.page.width - 120, 24, 4)
      .fill('#fef3c7')

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(accentColor)
      .text(
        `✅ Aplica para usted: Póliza ${polizaTipo} — Costo de prima: $${polizaCosto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`,
        70,
        polizaBoxY + 7
      )

    doc.moveDown(3)

    // ============================================
    // PRÓXIMOS PASOS
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Próximos pasos')

    doc.moveDown(0.5)

    const pasos = [
      'Un asesor se comunicará con usted en las próximas 24-48 horas.',
      'Se coordinará la validación de la garantía real.',
      'Se gestionará la emisión de la póliza de seguro correspondiente.',
      'Una vez cumplidos los requisitos, se procederá a la liberación de fondos.'
    ]

    pasos.forEach((p, i) => {
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(textColor)
        .text(`${i + 1}. ${p}`)
    })

    doc.moveDown(4)

    // ============================================
    // FIRMAS Y SELLO
    // ============================================
    const firmaY = doc.page.height - 160

    doc
      .strokeColor(primaryColor)
      .lineWidth(1)
      .moveTo(60, firmaY - 10)
      .lineTo(doc.page.width - 60, firmaY - 10)
      .stroke()

    doc
      .strokeColor(textColor)
      .lineWidth(0.5)
      .moveTo(80, firmaY)
      .lineTo(240, firmaY)
      .stroke()

    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, 90, firmaY - 35, { width: 130 })
      }
    } catch (e) {}

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(grayColor)
      .text('Presidente del Consejo', 80, firmaY + 8)

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(textColor)
      .text('Lic. Juan Carlos Méndez Pérez', 80, firmaY + 20)

    try {
      const selloPath = path.join(process.cwd(), 'public', 'sello.png')
      if (fs.existsSync(selloPath)) {
        doc.image(selloPath, doc.page.width / 2 - 45, firmaY - 45, { width: 90 })
      }
    } catch (e) {}

    doc
      .strokeColor(textColor)
      .lineWidth(0.5)
      .moveTo(320, firmaY)
      .lineTo(480, firmaY)
      .stroke()

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(grayColor)
      .text('El Acreditado', 320, firmaY + 8)

    const nombreCliente = lead.fullName || 'Cliente'
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(textColor)
      .text(nombreCliente.length > 28 ? nombreCliente.substring(0, 25) + '...' : nombreCliente, 320, firmaY + 20)

    // ============================================
    // PIE DE PÁGINA
    // ============================================
    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(grayColor)
      .text(
        'Caja Popular San Bernardino de Siena Valladolid S.C. de A.P. de R.L. de C.V.',
        { align: 'center' }
      )

    doc.text(
      'Calle 40 #204B entre 41 y 43, Col. Centro, Valladolid, Yucatán',
      { align: 'center' }
    )

    doc.text(
      `Folio: #${lead.id.slice(-8).toUpperCase()} · Documento generado electrónicamente · ${new Date().toLocaleDateString('es-MX')}`,
      { align: 'center' }
    )

    doc.end()

    return new Promise<NextResponse>((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="CARTA_FORMALIZACION_${nombreCliente.replace(/\s/g, '_')}.pdf"`
            }
          })
        )
      })
    })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json({ error: 'Error generando documento' }, { status: 500 })
  }
}