// app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requerido' },
        { status: 400 }
      )
    }

    // Eliminar el lead
    await prisma.lead.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado correctamente'
    })

  } catch (error) {
    console.error('❌ Error eliminando lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, color: true }
        }
      }
    })

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: lead })

  } catch (error) {
    console.error('❌ Error obteniendo lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const lead = await prisma.lead.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, color: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: lead })

  } catch (error) {
    console.error('❌ Error actualizando lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar' },
      { status: 500 }
    )
  }
}