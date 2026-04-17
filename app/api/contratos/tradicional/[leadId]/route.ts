import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'

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
      margin: 50, 
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
    doc.rect(0, 0, doc.page.width, 100).fill(primaryColor)

    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 25, { width: 70 })
      }
    } catch (e) {}

    doc
      .fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('CARTA DE FORMALIZACIÓN', 130, 35)

    doc
      .font('Helvetica')
      .fontSize(11)
      .text('Etapa de Formalización Legal y Administrativa', 130, 60)

    doc
      .fontSize(9)
      .text(`Fecha: ${new Date().toLocaleDateString('es-MX', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      })}`, 130, 78)

    doc.moveDown(5)

    // ============================================
    // DATOS DEL CLIENTE
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor(primaryColor)
      .text('DATOS DEL ACREDITADO')

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(textColor)

    doc.text(`Nombre: ${lead.fullName || 'N/A'}`)
    doc.text(`Correo: ${lead.email || 'N/A'}`)
    doc.text(`Teléfono: ${lead.phone || 'N/A'}`)
    doc.text(`Folio: #${lead.id.slice(-8).toUpperCase()}`)

    doc.moveDown(2)

    // ============================================
    // SALUDO
    // ============================================
    const nombrePila = lead.fullName?.split(' ')[0] || 'Cliente'

    doc.text(`Estimado/a ${nombrePila}:`)
    doc.moveDown(0.3)
    doc.text(
      'Para dar continuidad al proceso y proceder con la liberación de los fondos aprobados, ' +
      'el siguiente paso consiste en la formalización legal y administrativa de la operación.',
      { align: 'justify' }
    )

    doc.moveDown(2)

    // ============================================
    // DETALLES DEL CRÉDITO
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor(primaryColor)
      .text('DETALLES DEL CRÉDITO')

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(textColor)

    doc.text(`Monto aprobado: $${monto.toLocaleString('es-MX')} MXN`)
    doc.text(`Plazo: ${plazo} meses`)
    doc.text(`Tasa de interés: ${tasa}% anual fija`)
    doc.text(`Tipo de crédito: ${lead.creditType === 'CRYPTO' ? 'Criptomonedas' : 'Tradicional'}`)

    doc.moveDown(2)

    // ============================================
    // REQUISITOS DE GARANTÍA
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor(primaryColor)
      .text('REQUISITOS DE GARANTÍA')

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(11)
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
      .fontSize(14)
      .fillColor(primaryColor)
      .text('PÓLIZAS DE SEGURO')

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(textColor)
      .text('• Póliza Tipo I: Hasta $100,000 MXN → Prima: $1,132.82 MXN')
      .text('• Póliza Tipo II: Más de $100,000 MXN → Prima: $2,211.82 MXN')

    doc.moveDown(0.5)

    doc
      .font('Helvetica-Bold')
      .fillColor(accentColor)
      .text(`✅ Aplica para usted: Póliza ${polizaTipo} — Costo de prima: $${polizaCosto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`)

    doc.moveDown(2)

    // ============================================
    // PRÓXIMOS PASOS
    // ============================================
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor(primaryColor)
      .text('PRÓXIMOS PASOS')

    doc.moveDown(0.5)

    const pasos = [
      '1. Un asesor se comunicará con usted en las próximas 24-48 horas.',
      '2. Se coordinará la validación de la garantía real.',
      '3. Se gestionará la emisión de la póliza de seguro correspondiente.',
      '4. Una vez cumplidos los requisitos, se procederá a la liberación de fondos.'
    ]

    pasos.forEach(p => {
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor(textColor)
        .text(p)
    })

    doc.moveDown(3)

    // ============================================
    // FIRMAS Y SELLO
    // ============================================
    const firmaY = doc.page.height - 150

    // Línea separadora
    doc
      .strokeColor(primaryColor)
      .lineWidth(1)
      .moveTo(50, firmaY - 10)
      .lineTo(doc.page.width - 50, firmaY - 10)
      .stroke()

    // Firma presidente
    doc
      .strokeColor(textColor)
      .lineWidth(0.5)
      .moveTo(70, firmaY)
      .lineTo(230, firmaY)
      .stroke()

    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, 80, firmaY - 35, { width: 130 })
      }
    } catch (e) {}

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(grayColor)
      .text('Presidente del Consejo', 70, firmaY + 8)

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(textColor)
      .text('Lic. Juan Carlos Méndez Pérez', 70, firmaY + 20)

    // Sello
    try {
      const selloPath = path.join(process.cwd(), 'public', 'sello.png')
      if (fs.existsSync(selloPath)) {
        doc.image(selloPath, doc.page.width / 2 - 45, firmaY - 45, { width: 90 })
      }
    } catch (e) {}

    // Firma cliente
    doc
      .strokeColor(textColor)
      .lineWidth(0.5)
      .moveTo(310, firmaY)
      .lineTo(470, firmaY)
      .stroke()

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(grayColor)
      .text('El Acreditado', 310, firmaY + 8)

    const nombreCliente = lead.fullName || 'Cliente'
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(textColor)
      .text(nombreCliente.length > 28 ? nombreCliente.substring(0, 25) + '...' : nombreCliente, 310, firmaY + 20)

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