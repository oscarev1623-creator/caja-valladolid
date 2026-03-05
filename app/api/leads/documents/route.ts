import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'leadId requerido' },
        { status: 400 }
      )
    }

    const documents = await prisma.document.findMany({
      where: { leadId },
      orderBy: { uploadedAt: 'desc' },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      documents
    })

  } catch (error: any) {
    console.error('❌ Error documentos:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}