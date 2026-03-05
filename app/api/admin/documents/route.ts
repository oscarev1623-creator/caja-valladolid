import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Verificar sesión
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const leadId = searchParams.get('leadId') || ''

    // Construir filtros
    const where: any = {}

    if (leadId) {
      where.leadId = leadId
    }

    if (search) {
      where.filename = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: documents
    })

  } catch (error) {
    console.error('Error obteniendo documentos:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}