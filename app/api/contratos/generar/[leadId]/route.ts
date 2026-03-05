import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import PDFDocument from 'pdfkit'

const prisma = new PrismaClient()

// ✅ CORRECCIÓN: params debe ser Promise en Next.js 13+ App Router
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }  // ← PROMISE
) {
  try {
    // ✅ OBTENER params con await
    const { leadId } = await params
    
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },  // ← usar leadId (no params.leadId)
      include: {
        assignedTo: true
      }
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Generar PDF del contrato
    const doc = new PDFDocument()
    const chunks: Buffer[] = []  // ← tipo Buffer[]
    
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    
    // Contenido profesional del contrato
    doc.fontSize(20).text('CONTRATO DE PRÉSTAMO', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Entre: Caja Popular San Bernardino de Siena Valladolid`)
    doc.text(`Y: ${lead.fullName}`)
    doc.moveDown()
    
    // Términos y condiciones profesionales
    const terminos = [
      `1. MONTO DEL PRÉSTAMO: $${lead.estimatedAmount?.toLocaleString('es-MX') || '0'}`,
      '2. TASA DE INTERÉS: 12% anual',
      '3. PLAZO: 36 meses',
      '4. COMISIÓN POR APERTURA: 2% del monto',
      '5. SEGURO DE VIDA: Incluido',
      '6. GARANTÍA: Firmas en garantía',
      '7. AMORTIZACIONES: Mensuales',
      '8. PENALIZACIONES: 5% por mora',
      '9. FIRMAS Y AVALES: 2 avales mínimos'
    ]
    
    terminos.forEach(termino => {
      doc.text(termino)
      doc.moveDown(0.5)
    })

    doc.end()

    // ✅ Promise con tipo correcto
    return new Promise<NextResponse>((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="contrato-${lead.fullName.replace(/[^a-z0-9]/gi, '_')}.pdf"`
            }
          })
        )
      })
    })

  } catch (error: any) {
    console.error('Error generando contrato:', error)
    return NextResponse.json(
      { error: 'Error generando contrato' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}