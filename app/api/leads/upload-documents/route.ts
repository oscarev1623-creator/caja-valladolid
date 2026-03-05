// app/api/leads/upload-documents/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

// Directorio para guardar documentos
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'documents')

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Iniciando subida de documentos...')
    
    const formData = await request.formData()
    const token = formData.get('token') as string
    
    console.log('📋 Token recibido:', token)

    if (!token) {
      console.log('❌ Token requerido')
      return NextResponse.json(
        { success: false, error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Verificar token y lead
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

    // Verificar si ya envió documentos
    if (lead.documentsSubmitted) {
      console.log('⚠️ Lead ya envió documentos anteriormente')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya has enviado los documentos anteriormente. Contacta a soporte si necesitas reenviar.' 
        },
        { status: 400 }
      )
    }

    // Buscar un usuario para uploadedBy (puede ser cualquier admin)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('⚠️ No se encontró usuario admin, se usará un ID por defecto')
    }

    // Crear directorio si no existe
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
      console.log('📁 Directorio creado:', UPLOAD_DIR)
    }

    // Procesar cada archivo
    const uploadedDocuments = []
    
    for (const [fieldName, file] of formData.entries()) {
      if (file instanceof File) {
        const fileName = `${lead.id}_${fieldName}_${Date.now()}_${file.name}`
        const filePath = join(UPLOAD_DIR, fileName)
        
        // Convertir File a Buffer y guardar
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)
        
        console.log('💾 Archivo guardado:', fileName, file.type, file.size)
        
        // Guardar en base de datos (CON UPLOADEDBY)
        const documentData: any = {
          filename: file.name,
          fileUrl: `/uploads/documents/${fileName}`,
          fileType: fieldName,
          fileSize: file.size,
          lead: {
            connect: { id: lead.id }
          }
        }

        // Agregar uploadedBy si existe un admin
        if (adminUser?.id) {
          documentData.uploadedBy = {
            connect: { id: adminUser.id }
          }
        }

        const document = await prisma.document.create({
          data: documentData
        })
        
        uploadedDocuments.push(document)
      }
    }

    // Actualizar lead (SIN STAGE)
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        documentsSubmitted: true,
        docsSubmittedAt: new Date(),
        status: 'PENDING_DOCUMENTS'
      }
    })

    console.log(`✅ Lead actualizado, ${uploadedDocuments.length} documentos enviados`)

    return NextResponse.json({
      success: true,
      message: 'Documentos recibidos correctamente. Serás contactado pronto.',
      leadId: lead.id,
      filesReceived: uploadedDocuments.length
    })

  } catch (error) {
    console.error('🔥 Error subiendo documentos:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}