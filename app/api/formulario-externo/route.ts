import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Inicializar Prisma
const prisma = new PrismaClient()

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// GET para pruebas
export async function GET() {
  console.log('✅ GET /api/formulario-externo - API funcionando')
  
  return NextResponse.json({
    message: 'API de formulario externo funcionando',
    version: '1.0',
    endpoints: {
      POST: '/api/formulario-externo',
      GET: '/api/formulario-externo'
    },
    timestamp: new Date().toISOString()
  }, {
    headers: corsHeaders
  })
}

// POST simplificado y robusto
export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST recibido en /api/formulario-externo')
    
    // 1. Parsear datos
    const data = await request.json()
    console.log('📦 Datos recibidos:', JSON.stringify(data, null, 2))
    
    // 2. Validación básica
    if (!data.telefono && !data.phone) {
      return NextResponse.json({
        success: false,
        error: 'Teléfono es requerido'
      }, {
        status: 400,
        headers: corsHeaders
      })
    }
    
    // 3. Preparar datos SIMPLIFICADOS (sin campos opcionales)
    const leadData = {
      fullName: data.nombre || 'Cliente',
      email: data.email || 'sin-email@temporal.com',
      phone: data.telefono || data.phone || '0000000000',
      message: data.mensaje || data.message || '',
      estimatedAmount: data.monto ? parseFloat(data.monto) : 0,
      creditType: data.tipo_credito || 'TRADITIONAL',
      status: 'NUEVO',
      source: data.source || 'FORMULARIO_EXTERNO'
    }
    
    console.log('💾 Intentando guardar...', leadData)
    
    // 4. Guardar en base de datos
    const lead = await prisma.lead.create({
      data: leadData
    })
    
    console.log('✅ Lead creado exitosamente! ID:', lead.id)
    
    // 5. Responder éxito
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Solicitud registrada exitosamente',
      data: {
        id: lead.id,
        nombre: lead.fullName,
        telefono: lead.phone,
        email: lead.email,
        fecha: lead.createdAt
      }
    }, {
      headers: corsHeaders
    })
    
  } catch (error: any) {
    console.error('❌ ERROR en POST:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    // Error de duplicado
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Este teléfono o email ya está registrado'
      }, {
        status: 400,
        headers: corsHeaders
      })
    }
    
    // Error de validación de Prisma
    if (error.code === 'P2003' || error.code === 'P2011') {
      return NextResponse.json({
        success: false,
        error: 'Error en los datos enviados',
        details: error.message
      }, {
        status: 400,
        headers: corsHeaders
      })
    }
    
    // Error general
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, {
      status: 500,
      headers: corsHeaders
    })
  }
}