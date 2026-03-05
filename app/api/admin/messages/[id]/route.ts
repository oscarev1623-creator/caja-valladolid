import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/messages/[id] - Obtener mensaje individual
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sesión
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const message = await prisma.message.findUnique({
      where: { id }
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Mensaje no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: message })

  } catch (error) {
    console.error('Error obteniendo mensaje:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/messages/[id] - Actualizar estado
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sesión
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validar estado
    const validStatuses = ['UNREAD', 'READ', 'ARCHIVED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Estado inválido' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status
    }
    
    if (status === 'READ') {
      updateData.readAt = new Date()
    }

    const message = await prisma.message.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: message })

  } catch (error) {
    console.error('Error actualizando mensaje:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/messages/[id] - Eliminar mensaje
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sesión
    const session = request.cookies.get('admin_session')?.value
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.message.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje eliminado correctamente'
    })

  } catch (error) {
    console.error('Error eliminando mensaje:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}