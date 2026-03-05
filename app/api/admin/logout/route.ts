import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Sesión cerrada' 
  })
  
  // Eliminar ambas cookies
  response.cookies.delete('admin_session')
  response.cookies.delete('admin_user')
  
  return response
}