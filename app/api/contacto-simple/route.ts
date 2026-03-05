import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 Datos recibidos del formulario 3:', data)
    
    // Validar
    if (!data.firstName || !data.email || !data.phone) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email y teléfono son requeridos' },
        { status: 400 }
      )
    }

    const fullName = `${data.firstName} ${data.lastName || ''}`.trim()
    
    const lead = await prisma.lead.create({
      data: {
        fullName: fullName,
        firstName: data.firstName,
        lastName: data.lastName || null,
        phone: data.phone,
        email: data.email,
        message: data.message || 'Consulta general',
        formType: 'CONTACT_INQUIRY',
        source: 'CONTACT_FORM',
        status: 'CONTACT_INQUIRY'
      }
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Mensaje recibido. Nos pondremos en contacto pronto.',
      data: {
        nombre: fullName,
        tipo: 'Consulta general',
        prioridad: 'BAJA'
      }
    })

  } catch (error: any) {
    console.error('❌ Error en contacto-simple:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando el mensaje',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}