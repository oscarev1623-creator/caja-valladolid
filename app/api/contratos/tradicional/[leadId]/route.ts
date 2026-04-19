import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { jsPDF } from 'jspdf'
import { readFileSync } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Cargar imágenes
const logoBase64 = readFileSync(path.join(process.cwd(), 'public', 'logotipo.png')).toString('base64')
const firmaBase64 = readFileSync(path.join(process.cwd(), 'public', 'juanmendez.png')).toString('base64')
const selloBase64 = readFileSync(path.join(process.cwd(), 'public', 'sello.png')).toString('base64')

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

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const primaryColor = '#059669'
    const accentColor = '#f7931a'
    const textColor = '#1f2937'
    const grayColor = '#6b7280'

    let y = 20

    // ============================================
    // HEADER CON LOGO
    // ============================================
    doc.setFillColor(primaryColor)
    doc.rect(0, 0, 210, 35, 'F')
    
    // LOGO PNG
    doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', 15, 5, 20, 20)

    doc.setTextColor('#ffffff')
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('CARTA DE FORMALIZACIÓN', 105, 15, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Etapa de Formalización Legal y Administrativa', 105, 23, { align: 'center' })

    doc.setFontSize(9)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 30, { align: 'center' })

    y = 45

    // ============================================
    // DATOS DEL CLIENTE
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL ACREDITADO', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Nombre: ${lead.fullName || 'N/A'}`, 20, y)
    y += 6
    doc.text(`Correo: ${lead.email || 'N/A'}`, 20, y)
    y += 6
    doc.text(`Teléfono: ${lead.phone || 'N/A'}`, 20, y)
    y += 6
    doc.text(`Folio: #${lead.id.slice(-8).toUpperCase()}`, 20, y)
    y += 12

    // ============================================
    // SALUDO
    // ============================================
    const nombrePila = lead.fullName?.split(' ')[0] || 'Cliente'
    doc.text(`Estimado/a ${nombrePila}:`, 20, y)
    y += 6
    
    const textoLargo = 'Para dar continuidad al proceso y proceder con la liberación de los fondos aprobados, el siguiente paso consiste en la formalización legal y administrativa de la operación.'
    const lineas = doc.splitTextToSize(textoLargo, 170)
    doc.text(lineas, 20, y)
    y += lineas.length * 6 + 6

    // ============================================
    // DETALLES DEL CRÉDITO
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('DETALLES DEL CRÉDITO', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Monto aprobado: $${monto.toLocaleString('es-MX')} MXN`, 20, y)
    y += 6
    doc.text(`Plazo: ${plazo} meses`, 20, y)
    y += 6
    doc.text(`Tasa de interés: ${tasa}% anual fija`, 20, y)
    y += 6
    doc.text(`Tipo de crédito: ${lead.creditType === 'CRYPTO' ? 'Criptomonedas' : 'Tradicional'}`, 20, y)
    y += 12

    // ============================================
    // REQUISITOS DE GARANTÍA
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('REQUISITOS DE GARANTÍA', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const garantiaTexto = 'Se requiere respaldo mediante garantía real (bien mueble o inmueble) con cobertura mínima del 200% del monto solicitado.'
    const lineasGarantia = doc.splitTextToSize(garantiaTexto, 170)
    doc.text(lineasGarantia, 20, y)
    y += lineasGarantia.length * 6 + 6

    // ============================================
    // PÓLIZAS DE SEGURO
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PÓLIZAS DE SEGURO', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('• Póliza Tipo I: Hasta $100,000 MXN → Prima: $1,132.82 MXN', 20, y)
    y += 6
    doc.text('• Póliza Tipo II: Más de $100,000 MXN → Prima: $2,211.82 MXN', 20, y)
    y += 8

    doc.setTextColor(accentColor)
    doc.setFont('helvetica', 'bold')
    doc.text(`✅ Aplica para usted: Póliza ${polizaTipo} — Costo de prima: $${polizaCosto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, 20, y)
    y += 12

    // ============================================
    // CLÁUSULAS (PRIMERAS 5)
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('CLÁUSULAS', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const clausulas = [
      'PRIMERA. - OBJETO: El presente documento tiene por objeto formalizar la aceptación de las condiciones',
      'generales para el otorgamiento del crédito aprobado a favor del acreditado.',
      '',
      'SEGUNDA. - MONTO Y DESTINO: El crédito aprobado asciende a la cantidad señalada en la sección "Detalles',
      'del Crédito", debiendo ser destinado exclusivamente para los fines manifestados en la solicitud de crédito.',
      '',
      'TERCERA. - GARANTÍA: El acreditado se obliga a constituir garantía real suficiente que cubra al menos el',
      '200% del monto del crédito otorgado. Dicha garantía deberá ser debidamente formalizada mediante',
      'contrato de garantía, mismo que formará parte integrante del presente instrumento.',
      '',
      'CUARTA. - SEGURO: El acreditado se obliga a contratar y mantener vigente durante toda la vida del crédito',
      'la póliza de seguro correspondiente, cuya prima será cubierta por el acreditado en los términos señalados',
      'en la sección "Pólizas de Seguro".',
      '',
      'QUINTA. - ACEPTACIÓN: La firma del presente documento por parte del acreditado implica la aceptación',
      'plena e incondicional de todos y cada uno de los términos y condiciones aquí establecidos, así como de',
      'los que se contengan en los documentos accesorios que se deriven del presente acto.'
    ]
    
    clausulas.forEach(c => {
      doc.text(c, 20, y)
      y += 5
    })
    
    y += 5

    // ============================================
    // PRÓXIMOS PASOS
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PRÓXIMOS PASOS', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const pasos = [
      '1. Un asesor se comunicará con usted en las próximas 24-48 horas.',
      '2. Se coordinará la validación de la garantía real.',
      '3. Se gestionará la emisión de la póliza de seguro correspondiente.',
      '4. Una vez cumplidos los requisitos, se procederá a la liberación de fondos.'
    ]

    pasos.forEach(p => {
      doc.text(p, 20, y)
      y += 6
    })

    // ============================================
    // NUEVA PÁGINA
    // ============================================
    doc.addPage()
    y = 30

    // ============================================
    // SEXTA CLÁUSULA (en página 2)
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('CLÁUSULAS (CONTINUACIÓN)', 20, y)
    y += 8

    doc.setTextColor(textColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const clausulaSexta = [
      'SEXTA. - JURISDICCIÓN: Para la interpretación y cumplimiento del presente documento, las partes se',
      'someten expresamente a la jurisdicción de los tribunales competentes de la ciudad de Valladolid, Yucatán,',
      'renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.'
    ]
    
    clausulaSexta.forEach(c => {
      doc.text(c, 20, y)
      y += 5
    })
    
    y += 15

    // ============================================
    // FIRMAS CON SELLO Y FIRMA PNG
    // ============================================
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('FIRMAS', 105, y, { align: 'center' })
    y += 15

    doc.setTextColor(textColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Las partes que intervienen en el presente documento manifiestan su plena', 105, y, { align: 'center' })
    y += 6
    doc.text('conformidad con el contenido del mismo, firmando al calce para constancia.', 105, y, { align: 'center' })
    y += 20

    // SELLO PNG
    doc.addImage(`data:image/png;base64,${selloBase64}`, 'PNG', -5, y - 5, 90, 40)
    
    // FIRMA PNG
    doc.addImage(`data:image/png;base64,${firmaBase64}`, 'PNG', 55, y - 10, 70, 38)

    // Línea de firma del cliente
    doc.setTextColor(grayColor)
    doc.setFontSize(10)
    doc.text('_________________________', 145, y + 5)

    doc.setFontSize(9)
    doc.text('Presidente del Consejo de Administración', 75, y + 20)
    doc.text('El Acreditado', 145, y + 20)

    doc.setFontSize(10)
    doc.setTextColor(textColor)
    doc.text('Lic. Juan Carlos Méndez Pérez', 75, y + 30)
    const nombreCliente = lead.fullName || 'Cliente'
    doc.text(nombreCliente, 145, y + 30)

    y += 50

    // ============================================
    // PIE DE PÁGINA
    // ============================================
    doc.setTextColor(grayColor)
    doc.setFontSize(8)
    doc.text('Caja Popular San Bernardino de Siena Valladolid S.C. de A.P. de R.L. de C.V.', 105, y, { align: 'center' })
    y += 5
    doc.text('Calle 40 #204B entre 41 y 43, Col. Centro, Valladolid, Yucatán', 105, y, { align: 'center' })
    y += 5
    doc.text(`Folio: #${lead.id.slice(-8).toUpperCase()} · Documento generado electrónicamente · ${new Date().toLocaleDateString('es-MX')}`, 105, y, { align: 'center' })

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CARTA_FORMALIZACION_${nombreCliente.replace(/\s/g, '_')}.pdf"`
      }
    })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json({ error: 'Error generando documento' }, { status: 500 })
  }
}