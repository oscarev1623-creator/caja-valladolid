import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { sendConfirmationEmail } from '@/lib/email'

const prisma = new PrismaClient()

// Función para obtener el asesor con menos leads asignados
async function getBestAgent() {
  console.log('🔍 Buscando el mejor asesor para el lead...')
  
  const agents = await prisma.user.findMany({
    where: {
      role: 'agent',
      isActive: true
    }
  })

  if (agents.length === 0) {
    console.log('⚠️ No hay agentes, usando admin')
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
    return admin
  }

  const agentsWithLoad = await Promise.all(agents.map(async (agent) => {
    const leadCount = await prisma.lead.count({
      where: { assignedToId: agent.id }
    })
    return { ...agent, currentLoad: leadCount }
  }))

  agentsWithLoad.sort((a, b) => a.currentLoad - b.currentLoad)
  console.log(`✅ Asesor seleccionado: ${agentsWithLoad[0].name}`)
  return agentsWithLoad[0]
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, estimatedAmount, creditType, message } = await request.json()

    console.log('📥 Datos recibidos:', { firstName, lastName, email, phone, estimatedAmount })

    if (!firstName || !lastName || !email || !phone || !estimatedAmount) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`.trim()
    const uniqueToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const mappedCreditType = creditType === 'crypto' ? 'CRYPTO' : 'TRADITIONAL'

    const bestAgent = await getBestAgent()
    const assignedToId = bestAgent?.id || null

    const lead = await prisma.lead.create({
      data: {
        fullName,
        firstName,
        lastName,
        email,
        phone,
        estimatedAmount: parseFloat(estimatedAmount),
        creditType: mappedCreditType,
        message: message || '',
        uniqueToken,
        tokenExpiresAt: expiresAt,
        status: 'PENDING_DOCUMENTS',
        source: 'CALCULATOR',
        assignedToId: assignedToId
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, color: true }
        }
      }
    })

    console.log(`✅ Lead creado: ${lead.id}`)

    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const documentLink = `${process.env.NEXT_PUBLIC_URL || 'https://www.cajavalladolid.com'}/formulario-documentos/${uniqueToken}`

    await prisma.ticket.create({
      data: {
        ticketNumber,
        leadId: lead.id,
        uniqueToken,
        linkUrl: documentLink,
        expiresAt,
        status: 'PENDING',
        priority: 'MEDIUM',
      }
    })

    console.log('✅ Ticket creado')

    // Enviar correo de confirmación
    console.log('📧 Llamando a sendConfirmationEmail...')
    try {
await sendConfirmationEmail({
  to: email,
  nombre: fullName,
  leadId: lead.id,
  monto: estimatedAmount,      // ← NUEVO
  tipoCredito: creditType       // ← NUEVO
})
      console.log('✅ sendConfirmationEmail completado')
    } catch (emailError: any) {
      console.error('❌ Error en sendConfirmationEmail:', emailError.message)
      // No lanzar error para que el lead se cree igual
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      token: uniqueToken,
      documentLink,
      message: 'Solicitud recibida. Revisa tu correo para continuar.'
    })

  } catch (error: any) {
    console.error('❌ Error general:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}