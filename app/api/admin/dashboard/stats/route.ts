import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Verificar autenticación por cookie
    const cookieStore = cookies()
    const session = cookieStore.get('admin_session')
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
    
    // Obtener leads
    const totalLeads = await prisma.lead.count()
    
    const pendingLeads = await prisma.lead.count({
      where: { status: 'PENDING_CONTACT' }
    })
    
    const approvedLeads = await prisma.lead.count({
      where: { status: 'APPROVED' }
    })
    
    const rejectedLeads = await prisma.lead.count({
      where: { status: 'REJECTED' }
    })
    
    // Calcular monto total
    const leadsWithAmount = await prisma.lead.findMany({
      where: { estimatedAmount: { not: null } },
      select: { estimatedAmount: true }
    })
    
    const totalAmount = leadsWithAmount.reduce((sum, lead) => sum + (lead.estimatedAmount || 0), 0)
    
    // Tasa de conversión
    const conversionRate = totalLeads > 0 
      ? Math.round((approvedLeads / totalLeads) * 100) 
      : 0
    
    // Leads recientes (últimos 5)
    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        estimatedAmount: true,
        creditType: true,
        status: true,
        createdAt: true
      }
    })
    
    // Formatear leads recientes
    const formattedRecentLeads = recentLeads.map(lead => ({
      id: lead.id,
      name: lead.fullName,
      email: lead.email,
      amount: lead.estimatedAmount ? `$${lead.estimatedAmount.toLocaleString()}` : 'N/A',
      type: lead.creditType === 'CRYPTO' ? 'Cripto' : 'Tradicional',
      status: lead.status,
      date: new Date(lead.createdAt).toLocaleDateString('es-MX')
    }))
    
    // Obtener conversaciones activas
    const activeConversations = await prisma.chatConversation.count({
      where: { status: 'active' }
    })
    
    // Mensajes no leídos
    const unreadMessages = await prisma.chatMessage.count({
      where: { isRead: false, senderType: 'user' }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        pendingLeads,
        approvedLeads,
        rejectedLeads,
        totalAmount,
        conversionRate,
        activeConversations,
        unreadMessages
      },
      recentLeads: formattedRecentLeads
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar estadísticas',
        stats: {
          totalLeads: 0,
          pendingLeads: 0,
          approvedLeads: 0,
          rejectedLeads: 0,
          totalAmount: 0,
          conversionRate: 0,
          activeConversations: 0,
          unreadMessages: 0
        },
        recentLeads: []
      },
      { status: 500 }
    )
  }
}