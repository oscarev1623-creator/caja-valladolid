import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: Obtener un lead por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('id')
    
    console.log('🔍 Buscando lead ID:', leadId)
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'ID de lead requerido' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        notes: {
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Lead encontrado:', lead.email)
    return NextResponse.json({
      success: true,
      data: lead
    })

  } catch (error: any) {
    console.error('❌ Error obteniendo lead:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// PUT: Actualizar lead
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('id')
    const data = await request.json()
    
    console.log('✏️ Actualizando lead:', leadId, data)
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'ID de lead requerido' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: data.status,
        assignedToId: data.assignedToId,
        notes: data.notes ? {
          create: {
            content: data.notes,
            isInternal: true,
            authorId: data.authorId || 'clm8h7v4c0000y0uys33a59yn'
          }
        } : undefined
      },
      include: {
        assignedTo: true,
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead actualizado'
    })

  } catch (error: any) {
    console.error('❌ Error actualizando lead:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}