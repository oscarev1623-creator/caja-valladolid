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

    // ============================================
    // VALORES DEL CRÉDITO
    // ============================================
    const monto = lead.estimatedAmount || 50000
    const plazo = lead.plazo || 36
    const tasa = lead.creditType === 'CRYPTO' ? 5.4 : 11.0

    const polizaTipo = monto <= 100000 ? 'Tipo I' : 'Tipo II'
    const polizaCosto = monto <= 100000 ? 1132.82 : 2211.82

    const doc = new PDFDocument({ margin: 60, size: 'A4' })

    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    // ============================================
    // FUENTES
    // ============================================
    const fontRegular = path.join(process.cwd(), 'fonts/Inter-Regular.ttf')
    const fontBold = path.join(process.cwd(), 'fonts/Inter-Bold.ttf')

    if (fs.existsSync(fontRegular) && fs.existsSync(fontBold)) {
      doc.registerFont('Regular', fontRegular)
      doc.registerFont('Bold', fontBold)
      console.log('✅ Fuentes Inter cargadas')
    } else {
      doc.registerFont('Regular', 'Helvetica')
      doc.registerFont('Bold', 'Helvetica-Bold')
      console.log('⚠️ Usando Helvetica (fallback)')
    }

    // ============================================
    // COLORES CORPORATIVOS
    // ============================================
    const primaryColor = '#059669'
    const accentColor = '#f7931a'
    const textColor = '#1f2937'
    const grayColor = '#6b7280'
    const lightGreen = '#ecfdf5'
    const lightAmber = '#fef3c7'

    // ============================================
    // HEADER PREMIUM
    // ============================================
    doc.rect(0, 0, doc.page.width, 90).fill(primaryColor)

    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 60, 25, { width: 70 })
        console.log('✅ Logo cargado')
      }
    } catch (error) {
      console.error('❌ Error cargando logo:', error)
    }

    // Texto header
    doc
      .fillColor('white')
      .font('Bold')
      .fontSize(18)
      .text('Carta de Formalización', 140, 30)

    doc
      .font('Regular')
      .fontSize(10)
      .text('Formalización Legal y Administrativa', 140, 55)

    doc.moveDown(4)

    // ============================================
    // DATOS DEL CLIENTE (CARD ELEGANTE)
    // ============================================
    doc
      .font('Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Datos del acreditado')

    doc.moveDown(0.5)

    const cardStartY = doc.y

    doc
      .roundedRect(60, cardStartY, doc.page.width - 120, 75, 6)
      .fill(lightGreen)

    doc
      .fillColor(textColor)
      .font('Regular')
      .fontSize(10)

    doc.text(`Nombre: ${lead.fullName}`, 75, cardStartY + 12)
    doc.text(`Correo: ${lead.email}`, 75, cardStartY + 28)
    doc.text(`Teléfono: ${lead.phone}`, 75, cardStartY + 44)
    doc.text(`Folio: #${lead.id.slice(-8).toUpperCase()}`, 75, cardStartY + 60)

    doc.moveDown(6)

    // ============================================
    // SALUDO
    // ============================================
    doc
      .font('Regular')
      .fontSize(10)
      .fillColor(textColor)
      .text(`Estimado/a ${lead.fullName.split(' ')[0]}:`)

    doc.moveDown(0.5)

    doc.text(
      'Para dar continuidad al proceso y proceder con la liberación de los fondos aprobados, ' +
      'el siguiente paso consiste en la formalización legal y administrativa de la operación.',
      { align: 'justify' }
    )

    doc.moveDown(2)

    // ============================================
    // TABLA DE DETALLES DEL CRÉDITO
    // ============================================
    doc
      .font('Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Detalles del crédito')

    doc.moveDown(0.5)

    const tableWidth = doc.page.width - 120
    const col1 = tableWidth * 0.5

    // Header de tabla
    const tableHeaderY = doc.y
    doc.rect(60, tableHeaderY, tableWidth, 22).fill(primaryColor)

    doc
      .fillColor('white')
      .font('Bold')
      .fontSize(9)
      .text('Concepto', 70, tableHeaderY + 6)

    doc.text('Valor', 60 + col1, tableHeaderY + 6, {
      width: tableWidth - col1 - 10,
      align: 'right'
    })

    doc.moveDown(1.5)

    // Filas de tabla
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
        .font('Regular')
        .fontSize(9)
        .text(d.label, 70, rowY + 5)

      doc
        .font('Bold')
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
      .font('Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Requisitos de garantía')

    doc.moveDown(0.5)

    doc
      .font('Regular')
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
      .font('Bold')
      .fontSize(12)
      .fillColor(primaryColor)
      .text('Pólizas de seguro')

    doc.moveDown(0.5)

    doc
      .font('Regular')
      .fontSize(10)
      .fillColor(textColor)
      .text('• Tipo I: Hasta $100,000 MXN → Prima: $1,132.82 MXN')
      .text('• Tipo II: Más de $100,000 MXN → Prima: $2,211.82 MXN')

    doc.moveDown()

    // Destacar la póliza que aplica
    const polizaBoxY = doc.y
    doc
      .roundedRect(60, polizaBoxY, doc.page.width - 120, 24, 4)
      .fill(lightAmber)

    doc
      .font('Bold')
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
      .font('Bold')
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
        .font('Regular')
        .fontSize(10)
        .fillColor(textColor)
        .text(`${i + 1}. ${p}`)
    })

    doc.moveDown(4)

    // ============================================
    // FIRMAS Y SELLO
    // ============================================
    const firmaY = doc.page.height - 160

    // Línea separadora
    doc
      .strokeColor(primaryColor)
      .lineWidth(1)
      .moveTo(60, firmaY - 10)
      .lineTo(doc.page.width - 60, firmaY - 10)
      .stroke()

    // Firma izquierda (Presidente)
    doc
      .strokeColor(textColor)
      .lineWidth(0.5)
      .moveTo(80, firmaY)
      .lineTo(240, firmaY)
      .stroke()

    // Imagen de firma
    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, 90, firmaY - 35, { width: 130 })
        console.log('✅ Firma del presidente cargada')
      }
    } catch (error) {
      console.error('❌ Error cargando firma:', error)
    }

    doc
      .font('Regular')
      .fontSize(8)
      .fillColor(grayColor)
      .text('Presidente del Consejo', 80, firmaY + 8)

    doc
      .font('Bold')
      .fontSize(9)
      .fillColor(textColor)
      .text('Lic. Juan Carlos Méndez Pérez', 80, firmaY + 20)

    // ✅ SELLO OFICIAL (centro)
    try {
      const selloPath = path.join(process.cwd(), 'public', 'sello.png')
      if (fs.existsSync(selloPath)) {
        doc.image(selloPath, doc.page.width / 2 - 45, firmaY - 45, { width: 90 })
        console.log('✅ Sello cargado')
      }
    } catch (error) {
      console.error('❌ Error cargando sello:', error)
    }

    // Firma derecha (Cliente)
    doc
      .strokeColor(textColor)
      .lineWidth(0.5)
      .moveTo(320, firmaY)
      .lineTo(480, firmaY)
      .stroke()

    doc
      .font('Regular')
      .fontSize(8)
      .fillColor(grayColor)
      .text('El Acreditado', 320, firmaY + 8)

    doc
      .font('Bold')
      .fontSize(9)
      .fillColor(textColor)
      .text(lead.fullName.length > 28 ? lead.fullName.substring(0, 25) + '...' : lead.fullName, 320, firmaY + 20)

    // ============================================
    // PIE DE PÁGINA
    // ============================================
    doc
      .font('Regular')
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
              'Content-Disposition': `attachment; filename="CARTA_FORMALIZACION_${lead.fullName.replace(/\s/g, '_')}.pdf"`
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