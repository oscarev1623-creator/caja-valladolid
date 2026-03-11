import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'documents')

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
  console.log('📁 Directorio creado:', UPLOAD_DIR)
}

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

// Función para enviar correo de confirmación
async function sendConfirmationEmail(lead: any) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // ✅ Validar que el lead tenga email
    if (!lead.email) {
      console.log('⚠️ Lead sin email, no se envía correo de confirmación')
      return
    }

    await transporter.sendMail({
      from: `"Caja Valladolid" <${process.env.SMTP_USER}>`,
      to: lead.email,
      subject: '📄 Hemos recibido tus documentos - Caja Valladolid',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header con gradiente -->
          <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Caja Valladolid</h1>
            <p style="color: #e6fffa; margin: 10px 0 0; font-size: 16px;">Tu aliado financiero de confianza</p>
          </div>
          
          <!-- Cuerpo del correo -->
          <div style="background: #f8fafc; padding: 40px 30px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">¡Hola ${lead.fullName}!</h2>
            
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">Hemos recibido <strong>tus documentos</strong> correctamente. Nuestro equipo de analistas ya está revisando tu información.</p>
            
            <!-- Lista de documentos recibidos -->
            <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0; border-radius: 8px;">
              <p style="color: #065f46; margin: 0 0 10px 0; font-weight: bold; font-size: 16px;">✅ Documentos recibidos:</p>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">INE/IFE (frontal y trasera)</li>
                <li style="margin-bottom: 8px;">Comprobante de domicilio</li>
                <li style="margin-bottom: 8px;">Constancia laboral / Comprobante de ingresos</li>
              </ul>
            </div>
            
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">En las próximas <strong>24-48 horas</strong> recibirás una respuesta sobre tu solicitud de crédito.</p>
            
            <!-- WhatsApp Box -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: #1e3a8a; margin-top: 0; font-size: 18px;">📱 ¿Tienes dudas?</h3>
              <p style="color: #1e40af; margin-bottom: 20px;">Contáctanos por WhatsApp para atención personalizada:</p>
              <a href="https://wa.me/529541184165" style="display: inline-block; background: #25D366; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">💬 WhatsApp</a>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0 20px;">
            
            <p style="color: #64748b; font-size: 13px; text-align: center; line-height: 1.5; margin: 0;">
              Caja Popular San Bernardino de Siena Valladolid<br>
              Registro Oficial: 29198 • CONDUSEF ID: 4930<br>
              <span style="font-size: 12px;">Este es un correo automático, por favor no responder.</span>
            </p>
          </div>
        </div>
      `
    })
    
    console.log('✅ Correo de confirmación enviado a:', lead.email)
    
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        emailSent: true,
        emailSentAt: new Date()
      }
    })
    
  } catch (error) {
    console.error('❌ Error enviando correo:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('='.repeat(50))
    console.log('🚀 INICIO - SUBIDA DE DOCUMENTOS')
    console.log('='.repeat(50))
    
    const formData = await request.formData()
    const leadId = formData.get('leadId') as string
    
    console.log('📋 Lead ID recibido:', leadId)
    
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

    // Procesar archivos - Tipado explícito
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
        console.log(`📁 Procesando ${docType.type}:`, file.name)
        
        const fileExtension = file.name.split('.').pop() || 'bin'
        const fileName = `${leadId}_${docType.type}_${Date.now()}.${fileExtension}`
        const filePath = join(UPLOAD_DIR, fileName)
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)
        
        const document = await prisma.document.create({
          data: {
            filename: file.name,
            fileUrl: `/uploads/documents/${fileName}`,
            fileType: docType.type,
            documentType: docType.type,
            fileSize: file.size,
            leadId: leadId,
            uploadedById: null,
            filePath: null,
            mimeType: file.type || null
          }
        })
        
        // El documento ya cumple con la interfaz UploadedDocument
        uploadedDocuments.push(document as UploadedDocument)
        console.log(`✅ Documento guardado: ${docType.type}`)
      }
    }

    // Actualizar lead y enviar correo
    if (uploadedDocuments.length > 0) {
      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          documentsSubmitted: true,
          docsSubmittedAt: new Date(),
          status: 'DOCUMENTS_SUBMITTED'
        }
      })
      
      console.log('✅ Lead actualizado. Documentos subidos:', uploadedDocuments.length)
      
      // Enviar correo de confirmación
      await sendConfirmationEmail(updatedLead)
    }

    return NextResponse.json({
      success: true,
      message: `Documentos subidos exitosamente (${uploadedDocuments.length} archivos)`,
      documentsCount: uploadedDocuments.length
    })
    
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}