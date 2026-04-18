import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { renderToStream } from '@react-pdf/renderer'
import { CartaFormalizacionPDF } from '@/components/CartaFormalizacionPDF'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    console.log('🚀 Iniciando generación de PDF...')
    
    const { leadId } = await params
    console.log('📋 leadId:', leadId)

    if (!leadId) {
      console.error('❌ ID no proporcionado')
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    console.log('👤 Lead encontrado:', lead ? 'Sí' : 'No')

    if (!lead) {
      console.error('❌ Lead no encontrado')
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    }

    const monto = lead.estimatedAmount || 50000
    const plazo = lead.plazo || 36
    const tasa = lead.creditType === 'CRYPTO' ? 5.4 : 11.0
    const polizaTipo = monto <= 100000 ? 'Tipo I' : 'Tipo II'
    const polizaCosto = monto <= 100000 ? 1132.82 : 2211.82

    console.log('📊 Valores calculados:', { monto, plazo, tasa, polizaTipo, polizaCosto })

    console.log('🎨 Renderizando PDF...')
    const stream = await renderToStream(
      <CartaFormalizacionPDF 
        lead={lead}
        monto={monto}
        plazo={plazo}
        tasa={tasa}
        polizaTipo={polizaTipo}
        polizaCosto={polizaCosto}
      />
    )

    console.log('✅ PDF generado correctamente')

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CARTA_FORMALIZACION_${lead.fullName?.replace(/\s/g, '_') || 'cliente'}.pdf"`
      }
    })

  } catch (error: any) {
    console.error('❌ ERROR DETALLADO:', error.message)
    console.error('❌ STACK:', error.stack)
    return NextResponse.json({ 
      error: 'Error generando documento',
      details: error.message 
    }, { status: 500 })
  }
}