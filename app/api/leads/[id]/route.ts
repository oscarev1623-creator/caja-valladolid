import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ CORREGIDO: Promise
) {
  try {
    const { id } = await params;  // ✅ CORREGIDO: await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del lead requerido' }, 
        { status: 400 }
      );
    }

    // Verificar sesión por cookie
    const session = request.cookies.get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        documents: { 
          include: { 
            uploadedBy: { select: { id: true, name: true, email: true } } 
          } 
        },
        notes: { 
          include: { 
            author: { select: { id: true, name: true } } 
          } 
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead no encontrado' }, 
        { status: 404 }
      );
    }

    const serializeDate = (d: Date | null | undefined) => d?.toISOString() || null;

    const leadSafe = {
      ...lead,
      createdAt: serializeDate(lead.createdAt),
      updatedAt: serializeDate(lead.updatedAt),
      contactedAt: serializeDate(lead.contactedAt),
      docsSubmittedAt: serializeDate(lead.docsSubmittedAt),
      approvedAt: serializeDate(lead.approvedAt),
      rejectedAt: serializeDate(lead.rejectedAt),
      tokenExpiresAt: serializeDate(lead.tokenExpiresAt),
      tokenGeneratedAt: serializeDate(lead.tokenGeneratedAt),
      documents: lead.documents.map(d => ({
        ...d,
        uploadedAt: serializeDate(d.uploadedAt)
      })),
      notes: lead.notes.map(n => ({
        ...n,
        createdAt: serializeDate(n.createdAt),
        author: n.author || null
      })),
      assignedTo: lead.assignedTo || null
    };

    return NextResponse.json({ success: true, data: leadSafe });

  } catch (error) {
    console.error('❌ Error GET lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/leads/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = request.cookies.get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const lead = await prisma.lead.update({
      where: { id },
      data: body
    });

    return NextResponse.json({ success: true, data: lead });

  } catch (error) {
    console.error('❌ Error PATCH lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = request.cookies.get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.lead.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado correctamente'
    });

  } catch (error) {
    console.error('❌ Error DELETE lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    );
  }
}