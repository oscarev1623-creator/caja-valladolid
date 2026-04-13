// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'
import { validateFile, formatFileSize } from '@/lib/file-utils'

const prisma = new PrismaClient()

interface UploadedDocument {
  id: string
  filename: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: Date
  leadId: string
  uploadedById: string | null
  documentType: string
  filePath: string | null
  mimeType: string | null
}

export async function POST(request: NextRequest) {
  try {
    console.log('='.repeat(50))
    console.log('🚀 INICIO - SUBIDA DE DOCUMENTOS (Vercel Blob)')
    console.log('='.repeat(50))
    
    const formData = await request.formData()
    const leadId = formData.get('leadId') as string
    
    console.log('📋 Lead ID:', leadId)
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID requerido' },
        { status: 400 }
      )
    }

    // Verificar lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('✅ Lead encontrado:', lead.fullName)

    const uploadedDocuments: UploadedDocument[] = []
    const documentTypes = [
      { field: 'ineFront', type: 'INE_FRONTAL' },
      { field: 'ineBack', type: 'INE_TRASERA' },
      { field: 'comprobanteDomicilio', type: 'COMPROBANTE_DOMICILIO' },
      { field: 'constanciaLaboral', type: 'CONSTANCIA_LABORAL' },
      { field: 'estadosCuenta', type: 'ESTADOS_CUENTA' },
      { field: 'otrosDocumentos', type: 'OTROS' }
    ]

    for (const docType of documentTypes) {
      const file = formData.get(docType.field) as File
      
      if (file && file.size > 0) {
        console.log(`📁 Procesando ${docType.type}:`, file.name, `(${formatFileSize(file.size)})`)
        
        // Validar archivo usando la función de utilidades
        const validation = validateFile(file)
        if (!validation.valid) {
          return NextResponse.json(
            { 
              success: false, 
              error: validation.message,
              code: 'FILE_VALIDATION_ERROR'
            },
            { status: 400 }
          )
        }
        
        try {
          // Subir a Vercel Blob
          const blob = await put(
            `${leadId}/${docType.type}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
            file,
            {
              access: 'public',
              addRandomSuffix: true,
            }
          )
          
          console.log('✅ Archivo subido a Vercel Blob:', blob.url)
          
          // Guardar referencia en la base de datos
          const document = await prisma.document.create({
            data: {
              filename: file.name,
              fileUrl: blob.url,
              fileType: docType.type,
              documentType: docType.type,
              fileSize: file.size,
              leadId: leadId,
              uploadedById: null,
              filePath: null,
              mimeType: file.type || null
            }
          })
          
          uploadedDocuments.push(document as UploadedDocument)
          console.log(`✅ Documento guardado en BD: ${docType.type}`)
          
        } catch (uploadError: any) {
          console.error(`❌ Error subiendo a Blob:`, uploadError)
          
          // Detectar error específico de límite de Vercel
          if (uploadError.message?.includes('413') || uploadError.status === 413) {
            return NextResponse.json(
              {
                success: false,
                error: 'El archivo es demasiado grande. Límite: 4.5 MB. Por favor comprime la imagen o usa un archivo más pequeño.',
                code: 'FILE_TOO_LARGE'
              },
              { status: 413 }
            )
          }
          
          return NextResponse.json({
            success: false,
            error: `Error subiendo archivo: ${uploadError.message}`
          }, { status: 500 })
        }
      }
    }

    // Actualizar lead si se subieron documentos
    if (uploadedDocuments.length > 0) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          documentsSubmitted: true,
          docsSubmittedAt: new Date(),
          status: 'DOCUMENTS_SUBMITTED'
        }
      })
      
      console.log('✅ Lead actualizado. Documentos:', uploadedDocuments.length)
      
      // ✅ NUEVO: Enviar correo de confirmación de documentos recibidos
      try {
        const { sendDocumentsReceivedEmail } = await import('@/lib/email')
        await sendDocumentsReceivedEmail({
          to: lead.email!,
          nombre: lead.fullName,
          leadId: lead.id
        })
        console.log('✅ Correo de documentos enviado a:', lead.email)
      } catch (emailError) {
        console.error('❌ Error enviando correo de documentos:', emailError)
        // No fallar la petición si el correo falla
      }
    }

    return NextResponse.json({
      success: true,
      message: `✅ ${uploadedDocuments.length} archivo(s) subido(s) correctamente`,
      documentsCount: uploadedDocuments.length
    })
    
  } catch (error: any) {
    console.error('❌ Error fatal:', error)
    
    // Respuesta de error amigable
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la solicitud. Por favor intenta de nuevo.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}