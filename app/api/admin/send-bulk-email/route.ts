import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendReactivationEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        email: { not: null },
        status: { notIn: ['REJECTED'] }
      },
      select: { id: true, fullName: true, email: true }
    })

    let sent = 0
    let failed = 0

    for (const lead of leads) {
      if (!lead.email) continue

      try {
        await sendReactivationEmail({
          to: lead.email,
          nombre: lead.fullName
        })
        sent++
      } catch (error) {
        console.error(`Error enviando a ${lead.email}:`, error)
        failed++
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      message: `✅ ${sent} correos enviados, ${failed} fallidos de ${leads.length} leads`,
      sent,
      failed,
      total: leads.length
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
