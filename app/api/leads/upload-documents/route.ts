// app/api/leads/upload-documents/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

// Directorio para guardar documentos
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'documents')

// Definir interfaz para el documento subido
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
  console.log('='.repeat(50))
  console.log('📤 UPLOAD DOCUMENTS - INICIO')
  console.log('='.repeat(50))
  
  try {
    // 1. VERIFICAR CONEXIÓN A BD
    console.log('🔍 Verificando conexión a BD...')
    try {
      await prisma.$connect()
      console.log('✅ Conexión exitosa')
    } catch (dbError) {
      console.error('❌ Error de conexión a BD:', dbError)
      return NextResponse.json(
        { success: false, error: 'Error de conexión a base de datos' },
        { status: 500 }
      )
    }

    // 2. PROCESAR FORM DATA
    console.log('📦 Procesando FormData...')
    const formData = await request.formData()
    
    // 3. OBTENER TOKEN
    const token = formData.get('token') as string
    console.log('📋 Token recibido:', token)

    if (!token) {
      console.log('❌ Token requerido')
      return NextResponse.json(
        { success: false, error: 'Token requerido' },
        { status: 400 }
      )
    }

    // 4. BUSCAR LEAD POR TOKEN
    console.log('🔍 Buscando lead con token:', token)
    const lead = await prisma.lead.findFirst({
      where: {
        uniqueToken: token,
        tokenExpiresAt: {
          gt: new Date()
        }
      }
    })

    if (!lead) {
      console.log('❌ Token inválido o expirado')
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 404 }
      )
    }

    console.log('✅ Lead encontrado:', lead.id, lead.fullName)

    // 5. CREAR DIRECTORIO
    console.log('📁 Creando directorio de uploads...')
    try {
      await mkdir(UPLOAD_DIR, { recursive: true })
      console.log('✅ Directorio listo:', UPLOAD_DIR)
    } catch (dirError) {
      console.error('❌ Error creando directorio:', dirError)
      // Continuamos igual
    }

    // 6. PROCESAR ARCHIVOS
    console.log('📄 Procesando archivos...')
    const uploadedDocuments: UploadedDocument[] = []

    for (const [fieldName, file] of formData.entries()) {
      if (file instanceof File) {
        console.log(`Archivo encontrado: ${fieldName} - ${file.name} (${file.size} bytes)`)
        
        try {
          const fileName = `${lead.id}_${fieldName}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
          const filePath = join(UPLOAD_DIR, fileName)
          
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filePath, buffer)
          
          console.log('✅ Archivo guardado:', fileName)
          
          // ✅ VERSIÓN CORREGIDA CON TODOS LOS CAMPOS
          const document = await prisma.document.create({
            data: {
              filename: file.name,
              fileUrl: `/uploads/documents/${fileName}`,
              fileType: fieldName,
              documentType: fieldName,
              fileSize: file.size,
              leadId: lead.id,
              uploadedById: null,
              filePath: null,
              mimeType: file.type || null,
              uploadedAt: new Date()
            }
          })
          
          // Type assertion para que TypeScript sepa que cumple con la interfaz
          uploadedDocuments.push(document as UploadedDocument)
          console.log(`✅ Documento guardado en BD: ${fieldName}`)
        } catch (fileError) {
          console.error(`❌ Error procesando ${fieldName}:`, fileError)
        }
      }
    }

    // 7. ACTUALIZAR LEAD
    console.log('📝 Actualizando lead...')
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        documentsSubmitted: true,
        docsSubmittedAt: new Date()
        // status: 'PENDING_DOCUMENTS' // Lo comentamos por si el campo no existe
      }
    })

    // 8. RESPUESTA EXITOSA
    console.log('✅ Proceso completado. Documentos subidos:', uploadedDocuments.length)
    console.log('='.repeat(50))
    
    return NextResponse.json({
      success: true,
      message: 'Documentos recibidos correctamente',
      leadId: lead.id,
      filesReceived: uploadedDocuments.length
    })

  } catch (error: any) {
    console.error('❌ ERROR FATAL:')
    console.error('Mensaje:', error.message)
    console.error('Stack:', error.stack)
    console.error('='.repeat(50))
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error.message
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect().catch(e => console.error('Error desconectando:', e))
  }
}