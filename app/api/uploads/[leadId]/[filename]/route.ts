import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createReadStream } from 'fs'
import path from 'path'
import { stat } from 'fs/promises'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { leadId: string; filename: string } }
) {
  try {
    const { leadId, filename } = params
    
    // Verificar que el documento existe en la base de datos
    const document = await prisma.document.findFirst({
      where: {
        leadId: leadId,
        filename: filename
      }
    })
    
    if (!document) {
      return new NextResponse('Documento no encontrado', { status: 404 })
    }
    
    // Construir ruta del archivo
    const filePath = path.join(process.cwd(), 'uploads', leadId, filename)
    
    // Verificar que el archivo existe
    try {
      await stat(filePath)
    } catch {
      return new NextResponse('Archivo no encontrado', { status: 404 })
    }
    
    // Crear stream de lectura
    const fileStream = createReadStream(filePath)
    
    // Determinar content-type
    const contentType = document.mimeType || 'application/octet-stream'
    
    // Devolver el archivo
    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${document.filename}"`
      }
    })
    
  } catch (error) {
    console.error('Error sirviendo archivo:', error)
    return new NextResponse('Error interno', { status: 500 })
  }
}