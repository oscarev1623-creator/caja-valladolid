import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  console.log('🧪 Test DB - INICIO')
  
  try {
    // Probar conexión
    await prisma.$connect()
    console.log('✅ Conexión exitosa')
    
    // Contar leads
    const count = await prisma.lead.count()
    console.log(`✅ Total leads: ${count}`)
    
    // Crear un lead de prueba
    const testLead = await prisma.lead.create({
      data: {
        fullName: 'Test User',
        phone: '9999999999',
        email: 'test@example.com'
      }
    })
    console.log('✅ Lead de prueba creado:', testLead.id)
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos funcionando correctamente',
      leadCount: count,
      testLeadId: testLead.id
    })
    
  } catch (error: any) {
    console.error('❌ Error en test DB:')
    console.error('Mensaje:', error.message)
    console.error('Código:', error.code)
    console.error('Meta:', error.meta)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
    console.log('🏁 Test DB - FIN')
  }
}