import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'cajavalladolid-secret-2024')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: payload
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    )
  }
}