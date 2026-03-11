import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log('='.repeat(50))
  console.log('🚀 ENDPOINT LLAMADO - INICIO')
  console.log('='.repeat(50))
  
  try {
    // 1. VERIFICAR CONEXIÓN A BD
    console.log('🔍 Probando conexión a base de datos...')
    try {
      await prisma.$connect()
      console.log('✅ Conexión a BD exitosa')
    } catch (dbError) {
      console.error('❌ Error de conexión a BD:', dbError)
      return NextResponse.json(
        { success: false, error: 'Error de conexión a base de datos' },
        { status: 500 }
      )
    }

    // 2. LEER BODY
    console.log('📦 Leyendo request.json()...')
    let body
    try {
      body = await request.json()
      console.log('Body recibido:', JSON.stringify(body, null, 2))
    } catch (e) {
      console.error('❌ Error parseando JSON:', e)
      return NextResponse.json(
        { success: false, error: 'JSON inválido' },
        { status: 400 }
      )
    }

    // 3. VALIDAR CAMPOS
    const fullName = body.fullName || body.nombre
    const phone = body.phone || body.telefono
    
    if (!fullName || !phone) {
      console.log('❌ Faltan campos obligatorios')
      return NextResponse.json(
        { success: false, error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // 4. VERIFICAR EL MODELO LEAD
    console.log('🔍 Verificando modelo Lead...')
    try {
      // Intentar contar leads para ver si el modelo funciona
      const count = await prisma.lead.count()
      console.log(`✅ Modelo Lead funciona. Total leads: ${count}`)
    } catch (modelError: any) {
      console.error('❌ Error con modelo Lead:', modelError.message)
      console.error('Código:', modelError.code)
      console.error('Meta:', modelError.meta)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error con modelo de base de datos',
          details: modelError.message
        },
        { status: 500 }
      )
    }

    // 5. INTENTAR CREAR LEAD
    console.log('📝 Creando lead...')
    console.log('Datos a insertar:', {
      fullName,
      phone,
      email: body.email || null,
      estimatedAmount: body.monto ? parseFloat(body.monto) : null,
      creditType: body.tipoCredito === 'crypto' ? 'CRYPTO' : 'TRADITIONAL',
      contactoPreferido: body.contactoPreferido || 'whatsapp',
      message: body.mensaje || 'Solicitud desde formulario',
      formType: 'SIMPLE',
      status: 'PENDING_CONTACT',
      source: 'CONTACT_FORM'
    })

    let lead
    try {
      lead = await prisma.lead.create({
        data: {
          fullName: fullName,
          firstName: fullName.split(' ')[0] || '',
          lastName: fullName.split(' ').slice(1).join(' ') || null,
          phone: phone,
          email: body.email || null,
          estimatedAmount: body.monto ? parseFloat(body.monto) : null,
          creditType: body.tipoCredito === 'crypto' ? 'CRYPTO' : 'TRADITIONAL',
          contactoPreferido: body.contactoPreferido || 'whatsapp',
          message: body.mensaje || 'Solicitud desde formulario',
          formType: 'SIMPLE',
          status: 'PENDING_CONTACT',
          source: 'CONTACT_FORM'
        }
      })
      console.log('✅ Lead creado con ID:', lead.id)
    } catch (createError: any) {
      console.error('❌ Error creando lead:')
      console.error('Mensaje:', createError.message)
      console.error('Código:', createError.code)
      console.error('Meta:', createError.meta)
      
      // Si hay error de columna que no existe
      if (createError.code === 'P2022') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Error en base de datos: columna no existe',
            details: `La columna '${createError.meta?.column}' no existe en la tabla Lead`
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error al crear lead',
          details: createError.message
        },
        { status: 500 }
      )
    }

    // 6. ÉXITO
    console.log('✅ Proceso completado exitosamente')
    console.log('='.repeat(50))
    
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Solicitud recibida correctamente'
    })

  } catch (error: any) {
    console.error('❌ Error GENERAL en endpoint:')
    console.error('Nombre:', error.name)
    console.error('Mensaje:', error.message)
    console.error('Stack:', error.stack)
    
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
    console.log('='.repeat(50))
    console.log('🏁 ENDPOINT FINALIZADO')
    console.log('='.repeat(50))
  }
}