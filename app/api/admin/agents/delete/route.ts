import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 })
    }

    // Verificar que no sea el admin principal
    const agent = await prisma.user.findUnique({ where: { id } })
    
    if (agent?.email === 'oscarev1623@gmail.com') {
      return NextResponse.json({ success: false, error: 'No puedes eliminar al administrador principal' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
  }
}