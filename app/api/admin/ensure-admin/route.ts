import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const ADMIN_EMAIL = 'admin@cajavalladolid.com'
    const ADMIN_PASSWORD = 'admin123'
    
    // Hash fijo para admin123
    const HASHED_PASSWORD = '$2b$10$TTqTOWO9sH..6ETrJq1KPeoIOyCn2OgbiTnCYRLOtnFuZinIHogTa'
    
    // Buscar o crear admin
    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        password: HASHED_PASSWORD,
        role: 'admin',
        name: 'Administrador',
        isActive: true
      },
      create: {
        email: ADMIN_EMAIL,
        password: HASHED_PASSWORD,
        role: 'admin',
        name: 'Administrador',
        isActive: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Admin garantizado',
      admin: {
        email: admin.email,
        role: admin.role
      },
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}