import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { leadId, field, url, filename, size } = await request.json()

    if (!leadId || !url) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Mapear el campo al tipo de documento
    const documentTypeMap: Record<string, string> = {
      ineFront: 'INE_FRONTAL',
      ineBack: 'INE_TRASERA',
      comprobanteDomicilio: 'COMPROBANTE_DOMICILIO',
      constanciaLaboral: 'CONSTANCIA_LABORAL',
      estadosCuenta: 'ESTADOS_CUENTA',
      otrosDocumentos: 'OTROS'
    }

    const documentType = documentTypeMap[field] || 'OTROS'

    // Guardar referencia en la base de datos
    await prisma.document.create({
      data: {
        filename: filename || 'documento',
        fileUrl: url,
        fileType: documentType,
        documentType: documentType,
        fileSize: size || 0,
        leadId: leadId,
        uploadedById: null,
        filePath: null,
        mimeType: null
      }
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('❌ Error guardando referencia:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}