import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const password = searchParams.get('p') || 'admin123'
  
  const hash = await bcrypt.hash(password, 10)
  
  return NextResponse.json({ password, hash })
}