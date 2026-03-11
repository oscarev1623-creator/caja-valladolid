import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('📥 [upload-unified] Recibiendo solicitud unificada')
    
    const formData = await request.formData()
    
    // Extraer datos personales
    const nombre = formData.get('nombre') as string
    const telefono = formData.get('telefono') as string
    const email = formData.get('email') as string
    const curp = formData.get('curp') as string
    const monto = formData.get('monto') as string
    const tipo_credito = formData.get('tipo_credito') as string
    const contactoPreferido = formData.get('contactoPreferido') as string
    const mensaje = formData.get('mensaje') as string
    const source = formData.get('source') as string

    // Validaciones básicas
    if (!nombre || !telefono || !email || !curp) {
      return NextResponse.json(
        { success: false, error: 'Nombre, teléfono, email y CURP son obligatorios' },
        { status: 400 }
      )
    }

    // Generar token único
    const uniqueToken = randomBytes(20).toString('hex')
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30)

    // Crear lead en base de datos - SOLO CAMPOS QUE EXISTEN EN TU SCHEMA
    const lead = await prisma.lead.create({
      data: {
        fullName: nombre,
        firstName: nombre.split(' ')[0] || '',
        lastName: nombre.split(' ').slice(1).join(' ') || null,
        phone: telefono,
        email: email,
        curp: curp, // Este campo YA EXISTE (lo agregamos en la migración)
        estimatedAmount: monto ? parseFloat(monto.replace(/[^0-9]/g, '')) : null,
        creditType: tipo_credito === 'crypto' ? 'CRYPTO' : 'TRADITIONAL',
        contactoPreferido: contactoPreferido,
        message: mensaje || 'Solicitud desde formulario unificado',
        formType: 'UNIFIED',
        status: 'PENDING_CONTACT',
        source: source || 'UNIFIED_FORM',
        uniqueToken: uniqueToken,
        tokenExpiresAt: tokenExpiresAt,
        tokenGeneratedAt: new Date(),
        documentsSubmitted: false
        // 👇 NO incluyas whatsappNumber porque NO existe en tu schema
      }
    })

    console.log('✅ Lead creado ID:', lead.id)

    // Crear carpeta para documentos
    const uploadDir = path.join(process.cwd(), 'uploads', lead.id)
    await mkdir(uploadDir, { recursive: true })

    let documentsCount = 0

    // Procesar documentos
    const fileFields = [
      { field: 'ineFront', type: 'INE_FRONT' },
      { field: 'ineBack', type: 'INE_BACK' },
      { field: 'comprobanteDomicilio', type: 'ADDRESS_PROOF' },
      { field: 'constanciaLaboral', type: 'INCOME_PROOF' },
      { field: 'estadosCuenta', type: 'BANK_STATEMENT' },
      { field: 'otrosDocumentos', type: 'OTHER' }
    ]

    for (const { field, type } of fileFields) {
      const file = formData.get(field) as File | null
      if (file) {
        try {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const fileName = `${field}_${Date.now()}_${safeFileName}`
          const filePath = path.join(uploadDir, fileName)
          
          await writeFile(filePath, buffer)
          
          const fileUrl = `/api/uploads/${lead.id}/${fileName}`
          
          // Guardar documento
          await prisma.document.create({
            data: {
              leadId: lead.id,
              documentType: type,
              filename: fileName,
              fileUrl: fileUrl,
              filePath: filePath,
              fileSize: file.size,
              mimeType: file.type,
              fileType: file.type.split('/')[0] || 'application'
            }
          })
          
          documentsCount++
          
        } catch (fileError) {
          console.error(`Error guardando ${field}:`, fileError)
        }
      }
    }

    // Actualizar lead si hay documentos
    if (documentsCount > 0) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          documentsSubmitted: true,
          docsSubmittedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      documentsCount: documentsCount,
      message: 'Solicitud completada exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en upload-unified:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando la solicitud. Por favor intenta nuevamente.',
        details: error.message
      },
      { status: 500 }
    )
  }
}