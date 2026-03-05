// app/api/admin/login-test/route.ts - ENDPOINT MUY SIMPLE
import { NextResponse } from 'next/server'

export async function POST() {
  console.log('✅ /api/admin/login-test llamado')
  
  return NextResponse.json({
    success: true,
    message: 'Endpoint funcionando',
    timestamp: new Date().toISOString()
  })
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Usa POST para login',
    method: 'GET no válido para login'
  })
}