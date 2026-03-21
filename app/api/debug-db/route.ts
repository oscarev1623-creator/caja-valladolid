import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Intenta conectar y contar usuarios
    const userCount = await prisma.user.count();
    return NextResponse.json({
      success: true,
      message: 'Conexión a BD exitosa',
      userCount,
      envVars: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlStart: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Error conectando a BD',
      details: error.message
    }, { status: 500 });
  }
}