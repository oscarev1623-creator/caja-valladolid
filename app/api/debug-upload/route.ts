import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 DEBUG UPLOAD - Inicio')
    
    const formData = await request.formData()
    const files: string[] = []
    
    // Listar todos los campos recibidos
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(`${key}: ${value.name} (${value.size} bytes)`)
        console.log(`📁 Archivo: ${key} - ${value.name} - ${value.size} bytes`)
      } else {
        console.log(`📋 Campo: ${key} - ${value}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Debug upload funcionando',
      fieldsReceived: Array.from(formData.keys()),
      files: files
    })
    
  } catch (error: any) {
    console.error('❌ Error en debug:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}