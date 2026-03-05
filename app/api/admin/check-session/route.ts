// app/api/admin/check-session/route.ts - CON DEBUG
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 CHECK-SESSION - Todas las cookies:')
    const allCookies = request.cookies.getAll()
    allCookies.forEach(cookie => {
      console.log(`  ${cookie.name}: ${cookie.value}`)
    })
    
    const session = request.cookies.get('admin_session')?.value
    console.log('🔍 admin_session encontrada:', session)
    
    if (session === 'authenticated') {
      return NextResponse.json({
        authenticated: true,
        user: { name: 'Admin', role: 'ADMIN' }
      })
    }
    
    console.log('❌ NO autenticado - admin_session no es "authenticated"')
    return NextResponse.json({
      authenticated: false,
      message: 'No autenticado'
    }, { status: 401 })
    
  } catch (error) {
    console.error('Error en check-session:', error)
    return NextResponse.json({
      authenticated: false,
      error: 'Error interno'
    }, { status: 500 })
  }
}