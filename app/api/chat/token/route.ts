import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (!token) {
    return NextResponse.json({ success: false, error: 'Token requerido' }, { status: 400 })
  }

  try {
    // Buscar lead por chatToken
    const lead = await prisma.lead.findUnique({
      where: { chatToken: token }
    })

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 404 })
    }

    // ✅ Validar que el lead tenga email
    if (!lead.email) {
      return NextResponse.json({ success: false, error: 'Lead sin email' }, { status: 400 })
    }

    // Buscar conversación asociada al email del lead
    const conversation = await prisma.chatConversation.findFirst({
      where: {
        userEmail: lead.email, // ✅ Ahora TypeScript sabe que no es null
        status: 'active'
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      conversationId: conversation?.id || null,
      lead: {
        id: lead.id,
        name: lead.fullName,
        email: lead.email,
        phone: lead.phone || ''
      }
    })

  } catch (error) {
    console.error('Error validando token:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}