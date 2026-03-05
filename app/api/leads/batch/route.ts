import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Recibiendo petición a /api/leads/batch')
    
    const { leadIds, action, notes } = await request.json()
    
    console.log('📦 Datos recibidos:', { leadIds, action, notes })

    // Validar entrada
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debe proporcionar una lista de leads' },
        { status: 400 }
      )
    }

    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@cajavalladolid.com' }
    })

    console.log('👤 Usuario admin encontrado:', adminUser ? adminUser.email : 'NO')

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario administrador no encontrado' },
        { status: 404 }
      )
    }

    // Mapeo de acciones - Estados que SÍ existen en el schema
    const statusMap: Record<string, string> = {
      'PENDING': 'PENDING_CONTACT',     // Schema default
      'CONTACTED': 'CONTACTED',
      'DOCUMENTATION': 'UNDER_REVIEW',  // Usamos UNDER_REVIEW en lugar de DOCUMENTATION
      'UNDER_REVIEW': 'UNDER_REVIEW',
      'APPROVE': 'APPROVED',
      'REJECT': 'REJECTED'
    }

    const newStatus = statusMap[action] || 'PENDING_CONTACT'

    // Actualizar los leads - SOLO status (stage no existe)
    const updatedLeads = await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: {
        status: newStatus,
        ...(action === 'APPROVE' && { assignedToId: adminUser.id }),
        ...(action === 'CONTACTED' && { contactedAt: new Date() }),
        ...(action === 'APPROVE' && { approvedAt: new Date() }),
        ...(action === 'REJECT' && { rejectedAt: new Date() })
      }
    })

    console.log(`✅ ${updatedLeads.count} leads actualizados a: ${newStatus}`)

    // Crear nota si existe
    if (notes && notes.trim()) {
      const noteContent = `[ACCIÓN MASIVA - ${action}]: ${notes}\n\nEjecutado por: ${adminUser.name}`
      
      await prisma.note.createMany({
        data: leadIds.map(leadId => ({
          content: noteContent,
          isInternal: true,
          leadId: leadId,
          authorId: adminUser.id
        }))
      })
      
      console.log('📝 Notas creadas')
    }

    return NextResponse.json({
      success: true,
      message: `${updatedLeads.count} leads actualizados a ${newStatus}`,
      count: updatedLeads.count,
      status: newStatus
    })

  } catch (error: any) {
    console.error('❌ Error en acción masiva:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno: ' + error.message },
      { status: 500 }
    )
  }
}