// app/api/chat/upload/route.ts
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const conversationId = formData.get('conversationId') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validación de tamaño (ej: máximo 10MB)
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB' 
      }, { status: 400 })
    }

    // Validación de tipos permitidos
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: 'File type not allowed' 
      }, { status: 400 })
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const blobPath = `chat/${conversationId}/${timestamp}-${safeName}`

    const blob = await put(blobPath, file, {
      access: 'public',
    })

    let fileType = 'document'
    if (file.type.startsWith('image/')) fileType = 'image'
    else if (file.type === 'application/pdf') fileType = 'pdf'
    else if (file.type.startsWith('video/')) fileType = 'video'

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileType,
      fileName: file.name,
      fileSize: file.size
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 })
  }
}