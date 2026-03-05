// app/api/documents/upload/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const prisma = new PrismaClient()

// Configuración de almacenamiento
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'documents')

// Crear directorio de uploads si no existe
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
  console.log(`📁 Directorio creado: ${UPLOAD_DIR}`)
}

// Función para generar nombre único
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Iniciando subida de documentos...')
    
    const formData = await request.formData()
    
    // Obtener datos del formulario
    const token = formData.get('token') as string
    const leadId = formData.get('leadId') as string
    
    console.log('📋 Token:', token, 'Lead ID:', leadId)
    
    if (!leadId) {
      console.log('❌ Lead ID no proporcionado')
      return NextResponse.json(
        { success: false, error: 'Lead ID requerido' },
        { status: 400 }
      )
    }
    
    // Información adicional del formulario
    const formInfo = {
      curp: formData.get('curp') as string || '',
      rfc: formData.get('rfc') as string || '',
      ocupacion: formData.get('ocupacion') as string || '',
      ingresoMensual: formData.get('ingresoMensual') as string || '',
      tiempoEmpleo: formData.get('tiempoEmpleo') as string || '',
      direccion: formData.get('direccion') as string || '',
      comentarios: formData.get('comentarios') as string || ''
    }
    
    // Verificar lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })
    
    if (!lead) {
      console.log('❌ Lead no encontrado:', leadId)
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('✅ Lead encontrado:', lead.fullName)
    
    // Obtener un usuario admin para uploadedById
    const adminUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@cajavalladolid.com' },
          { email: 'admin@cajavalladolid.com.mx' },
          { role: 'ADMIN' }
        ]
      }
    })
    
    console.log('👤 Usuario admin encontrado:', adminUser?.email || 'No encontrado')
    
    // Procesar cada documento
    const documentTypes = [
      { field: 'ineFront', type: 'INE_FRONTAL' },
      { field: 'ineBack', type: 'INE_TRASERA' },
      { field: 'comprobanteDomicilio', type: 'COMPROBANTE_DOMICILIO' },
      { field: 'constanciaLaboral', type: 'CONSTANCIA_LABORAL' },
      { field: 'estadosCuenta', type: 'ESTADOS_CUENTA' },
      { field: 'otrosDocumentos', type: 'OTROS' }
    ]
    
    const uploadedDocuments = []
    
    for (const docType of documentTypes) {
      const file = formData.get(docType.field) as File
      
      if (file && file.size > 0) {
        console.log(`📁 Procesando ${docType.type}: ${file.name} (${file.size} bytes)`)
        
        try {
          // Generar nombre único
          const fileExtension = file.name.split('.').pop() || 'bin'
          const fileName = `${leadId}_${docType.type}_${Date.now()}.${fileExtension}`
          const filePath = join(UPLOAD_DIR, fileName)
          
          // Convertir File a Buffer y guardar
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filePath, buffer)
          console.log('💾 Archivo guardado en:', filePath)
          
          // ✅ CREAR DOCUMENTO (SOLO UNA VEZ)
          const documentData: any = {
            filename: file.name,
            fileUrl: `/uploads/documents/${fileName}`,
            fileType: docType.type,
            fileSize: file.size,
            lead: {
              connect: { id: leadId }
            }
          }
          
          // Solo agregar uploadedById si existe un admin
          if (adminUser?.id) {
            documentData.uploadedById = adminUser.id
          }
          
          // Guardar en base de datos
          const document = await prisma.document.create({
            data: documentData
          })
          
          uploadedDocuments.push(document)
          console.log(`✅ Documento ${docType.type} guardado en BD con ID: ${document.id}`)
          
        } catch (fileError) {
          console.error(`❌ Error procesando ${docType.type}:`, fileError)
          // Continuar con otros archivos
        }
      }
    }
    
    // Construir mensaje actualizado
    const newMessage = `${lead.message || ''}\n\n--- INFORMACIÓN ADICIONAL ---\nCURP: ${formInfo.curp}\nRFC: ${formInfo.rfc}\nOcupación: ${formInfo.ocupacion}\nIngreso: ${formInfo.ingresoMensual}\nAntigüedad: ${formInfo.tiempoEmpleo}\nDirección: ${formInfo.direccion}\nComentarios: ${formInfo.comentarios}`
    
    // Actualizar lead (solo si se subió al menos un documento)
    if (uploadedDocuments.length > 0) {
      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          documentsSubmitted: true,
          docsSubmittedAt: new Date(),
          status: 'PENDING_DOCUMENTS', // Cambié a PENDING_DOCUMENTS que existe en tu schema
          message: newMessage.substring(0, 1000) // Limitar a 1000 caracteres
        }
      })
      
      console.log(`✅ Lead ${leadId} actualizado. Status: ${updatedLead.status}`)
    } else {
      console.log('⚠️ No se subieron documentos, no se actualiza el lead')
    }
    
    return NextResponse.json({
      success: true,
      message: uploadedDocuments.length > 0 
        ? `Documentos subidos exitosamente (${uploadedDocuments.length} archivos)` 
        : 'No se subieron documentos',
      leadId: leadId,
      documentsCount: uploadedDocuments.length,
      leadStatus: 'PENDING_DOCUMENTS'
    })
    
  } catch (error: any) {
    console.error('❌ Error en endpoint /api/documents/upload:')
    console.error('Mensaje:', error.message)
    console.error('Stack:', error.stack?.split('\n').slice(0, 5).join('\n'))
    
    // Detalles específicos de Prisma
    if (error.code) {
      console.error('Código de error:', error.code)
    }
    if (error.meta) {
      console.error('Meta información:', error.meta)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la solicitud',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('Error desconectando Prisma:', disconnectError)
    }
  }
}