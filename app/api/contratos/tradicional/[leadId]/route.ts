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

    // Valores del crédito
    const monto = lead.estimatedAmount || 50000
    const plazo = lead.plazo || 36
    const tasa = lead.creditType === 'CRYPTO' ? 5.4 : 11.0

    // Determinar tipo de póliza según el monto
    const polizaTipo = monto <= 100000 ? 'Tipo I' : 'Tipo II'
    const polizaCosto = monto <= 100000 ? 1132.82 : 2211.82

    // Crear PDF
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    })
    
    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    // Colores CORPORATIVOS (verde)
    const primaryColor = '#059669'
    const secondaryColor = '#047857'
    const accentColor = '#f7931a'
    const textColor = '#1f2937'
    const lightGray = '#f9fafb'
    const lightGreen = '#ecfdf5'

    // ============================================
    // ENCABEZADO PREMIUM
    // ============================================
    doc.rect(0, 0, doc.page.width, 110).fill(primaryColor)

    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logotipo.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 25, { width: 80 })
      }
    } catch (error) {
      console.error('Error cargando logo:', error)
    }

    // Título principal
    doc.fillColor('white')
    doc.fontSize(20)
    doc.font('Helvetica-Bold')
    doc.text('CARTA DE FORMALIZACIÓN', 150, 35)
    
    doc.fontSize(11)
    doc.font('Helvetica')
    doc.text('Etapa de Formalización Legal y Administrativa', 150, 60)
    
    doc.fontSize(9)
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })}`, 150, 78)

    // Línea decorativa
    doc.strokeColor('white')
    .lineWidth(1)
    .moveTo(50, 95)
    .lineTo(doc.page.width - 50, 95)
    .opacity(0.3)
    .stroke()
    .opacity(1)

    // ============================================
    // DATOS DEL CLIENTE
    // ============================================
    let currentY = 130

    // Título de sección
    doc.fillColor(primaryColor)
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('DATOS DEL ACREDITADO', 50, currentY)
    currentY += 20

    // Tarjeta de datos
    doc.roundedRect(50, currentY, doc.page.width - 100, 75, 5)
       .fill(lightGreen)
       .stroke(primaryColor)
    
    doc.fillColor(textColor)
    doc.fontSize(10)
    doc.font('Helvetica')
    
    currentY += 12
    doc.text(`Nombre completo: ${lead.fullName}`, 65, currentY)
    currentY += 18
    doc.text(`Correo electrónico: ${lead.email}`, 65, currentY)
    currentY += 18
    doc.text(`Teléfono de contacto: ${lead.phone}`, 65, currentY)
    currentY += 18
    doc.text(`Número de folio: #${lead.id.slice(-8).toUpperCase()}`, 65, currentY)

    currentY += 40

    // ============================================
    // SALUDO Y APERTURA
    // ============================================
    doc.fillColor(textColor)
    doc.fontSize(11)
    doc.font('Helvetica')
    doc.text(`Estimado/a ${lead.fullName.split(' ')[0]}:`, 50, currentY)
    currentY += 20
    
    doc.text(
      'Para dar continuidad al proceso y proceder con la liquidación de los fondos aprobados, ' +
      'el siguiente paso consiste en la Formalización Legal y Administrativa de la operación.',
      50, currentY, { width: doc.page.width - 100, align: 'left' }
    )
    currentY += 40

    // ============================================
    // DETALLES DEL CRÉDITO APROBADO
    // ============================================
    doc.fillColor(primaryColor)
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('DETALLES DEL CRÉDITO APROBADO', 50, currentY)
    currentY += 20

    // Tabla de detalles
    doc.roundedRect(50, currentY, doc.page.width - 100, 20, 3).fill(primaryColor)
    doc.fillColor('white')
    doc.fontSize(9)
    doc.font('Helvetica-Bold')
    doc.text('CONCEPTO', 65, currentY + 5)
    doc.text('VALOR', 350, currentY + 5)

    currentY += 25

    const detalles = [
      { label: 'Monto aprobado:', valor: `$${monto.toLocaleString('es-MX')} MXN` },
      { label: 'Plazo del crédito:', valor: `${plazo} meses` },
      { label: 'Tasa de interés anual:', valor: `${tasa}% fija` },
      { label: 'Tipo de crédito:', valor: lead.creditType === 'CRYPTO' ? 'Criptomonedas' : 'Tradicional' }
    ]

    doc.fillColor(textColor)
    doc.fontSize(9)
    
    detalles.forEach(detalle => {
      doc.font('Helvetica').text(detalle.label, 65, currentY)
      doc.font('Helvetica-Bold').text(detalle.valor, 350, currentY)
      currentY += 18
    })

    currentY += 20

    // ============================================
    // GARANTÍAS REQUERIDAS
    // ============================================
    doc.fillColor(primaryColor)
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('REQUISITOS DE GARANTÍA', 50, currentY)
    currentY += 20

    doc.fillColor(textColor)
    doc.fontSize(10)
    doc.font('Helvetica')
    doc.text(
      'Con el fin de respaldar la obligación crediticia, se requiere la constitución de las siguientes garantías:',
      50, currentY, { width: doc.page.width - 100 }
    )
    currentY += 25

    // Garantía 1: Garantía Real
    doc.roundedRect(50, currentY, doc.page.width - 100, 55, 5)
       .fill(lightGreen)
       .stroke(primaryColor)
    
    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('1. Garantía Real (Física)', 65, currentY + 10)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    doc.text(
      'Se requiere el respaldo de un bien mueble o inmueble, cuya valoración comercial debe representar, ' +
      'como mínimo, una relación de 2 a 1 respecto al monto total solicitado (cobertura del 200%).',
      65, currentY + 25, { width: doc.page.width - 130 }
    )
    currentY += 65

    // Garantía 2: Póliza de Seguro
    doc.roundedRect(50, currentY, doc.page.width - 100, 70, 5)
       .fill('#fef3c7')
       .stroke(accentColor)
    
    doc.fillColor(accentColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('2. Garantía de Cumplimiento (Póliza de Seguro)', 65, currentY + 10)
    
    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    doc.text(
      'Con el fin de mitigar el riesgo de insolvencia y proteger la operación, se debe emitir una ' +
      'póliza de seguro de crédito bajo las siguientes categorías de costo:',
      65, currentY + 25, { width: doc.page.width - 130 }
    )
    
    // Destacar la póliza que aplica
    doc.roundedRect(65, currentY + 45, doc.page.width - 130, 18, 3)
       .fill(polizaTipo === 'Tipo I' ? '#fef3c7' : lightGreen)
       .stroke(polizaTipo === 'Tipo I' ? accentColor : primaryColor)
    
    doc.fillColor(polizaTipo === 'Tipo I' ? accentColor : primaryColor)
    doc.fontSize(9)
    doc.font('Helvetica-Bold')
    doc.text(
      `✅ Póliza ${polizaTipo}: Aplica para su caso - Costo de prima: $${polizaCosto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`,
      75, currentY + 49
    )
    
    currentY += 80

    // Nota de pólizas
    doc.fillColor('#6b7280')
    doc.fontSize(8)
    doc.font('Helvetica')
    doc.text(
      '• Póliza Tipo I: Para montos ≤ $100,000 MXN - Prima: $1,132.82 MXN',
      65, currentY
    )
    currentY += 14
    doc.text(
      '• Póliza Tipo II: Para montos > $100,000 MXN - Prima: $2,211.82 MXN',
      65, currentY
    )
    currentY += 30

    // ============================================
    // PRÓXIMOS PASOS
    // ============================================
    doc.fillColor(primaryColor)
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text('PRÓXIMOS PASOS', 50, currentY)
    currentY += 20

    const pasos = [
      '1. Un asesor se comunicará con usted en las próximas 24-48 horas.',
      '2. Se coordinará la presentación de la garantía real (avalúo del bien).',
      '3. Se gestionará la emisión de la póliza de seguro correspondiente.',
      '4. Una vez cumplidos los requisitos, se procederá a la liquidación de fondos.'
    ]

    doc.fillColor(textColor)
    doc.fontSize(9)
    doc.font('Helvetica')
    
    pasos.forEach(paso => {
      doc.text(paso, 65, currentY)
      currentY += 16
    })

    currentY += 15

    // ============================================
    // FIRMAS Y SELLO
    // ============================================
    const firmaY = Math.max(currentY + 20, doc.page.height - 180)

    // Línea separadora
    doc.strokeColor(primaryColor)
    .lineWidth(1.5)
    .moveTo(50, firmaY - 10)
    .lineTo(doc.page.width - 50, firmaY - 10)
    .stroke()

    doc.fillColor(primaryColor)
    doc.fontSize(10)
    doc.font('Helvetica-Bold')
    doc.text('FIRMAS Y AUTORIZACIÓN', 50, firmaY, { align: 'center', width: doc.page.width - 100 })

    // Firma de la Institución (izquierda)
    doc.roundedRect(70, firmaY + 20, 180, 75, 5).stroke(primaryColor)

    // Línea para firma
    doc.strokeColor(primaryColor)
    .lineWidth(1)
    .moveTo(80, firmaY + 60)
    .lineTo(220, firmaY + 60)
    .stroke()

    // Firma del presidente
    try {
      const firmaPath = path.join(process.cwd(), 'public', 'juanmendez.png')
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, 75, firmaY + 30, { width: 130, height: 30 })
      }
    } catch (error) {
      console.error('Error cargando firma:', error)
    }

    doc.fillColor(primaryColor)
    doc.fontSize(8)
    doc.font('Helvetica-Bold')
    doc.text('PRESIDENTE DEL CONSEJO', 80, firmaY + 65)
    doc.fillColor(textColor)
    doc.fontSize(7)
    doc.text('LIC. JUAN CARLOS MÉNDEZ PÉREZ', 80, firmaY + 75)

    // ✅ SELLO OFICIAL (centro)
    try {
      const selloPath = path.join(process.cwd(), 'public', 'sello.png')
      if (fs.existsSync(selloPath)) {
        doc.image(selloPath, 220, firmaY + 15, { width: 120, height: 70 })
        console.log('✅ Sello cargado correctamente')
      }
    } catch (error) {
      console.error('Error cargando sello:', error)
    }

    // Firma del Cliente (derecha)
    doc.roundedRect(310, firmaY + 20, 180, 75, 5).stroke(primaryColor)
    
    doc.strokeColor(primaryColor)
    .lineWidth(1)
    .moveTo(320, firmaY + 60)
    .lineTo(460, firmaY + 60)
    .stroke()

    doc.fillColor(primaryColor)
    doc.fontSize(8)
    doc.font('Helvetica-Bold')
    doc.text('EL ACREDITADO', 320, firmaY + 65)
    doc.fillColor(textColor)
    doc.fontSize(7)
    const nombreCliente = lead.fullName.length > 30 ? lead.fullName.substring(0, 27) + '...' : lead.fullName
    doc.text(nombreCliente, 320, firmaY + 75)

    // ============================================
    // PIE DE PÁGINA
    // ============================================
    doc.fontSize(6)
    doc.fillColor('#6b7280')
    doc.font('Helvetica')
    doc.text(
      'Caja Popular San Bernardino de Siena Valladolid S.C. de A.P. de R.L. de C.V.',
      50, doc.page.height - 45,
      { align: 'center', width: doc.page.width - 100 }
    )
    doc.text(
      'Calle 40 #204B entre 41 y 43, Col. Centro, Valladolid, Yucatán · Tel: 985 856 1234',
      50, doc.page.height - 35,
      { align: 'center', width: doc.page.width - 100 }
    )
    doc.text(
      `Folio: #${lead.id.slice(-8).toUpperCase()} · Documento generado electrónicamente · ${new Date().toLocaleDateString('es-MX')}`,
      50, doc.page.height - 25,
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
              'Content-Disposition': `attachment; filename="CARTA_FORMALIZACION_${lead.fullName.replace(/\s/g, '_')}.pdf"`
            }
          })
        )
      })
    })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json(
      { error: 'Error generando documento' },
      { status: 500 }
    )
  }
}