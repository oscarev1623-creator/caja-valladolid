import { NextResponse } from 'next/server'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const leadsDir = join(process.cwd(), 'tmp_leads')
    
    // Leer todos los archivos JSON
    const files = readdirSync(leadsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = readFileSync(join(leadsDir, file), 'utf-8')
        return JSON.parse(content)
      })
    
    return NextResponse.json({
      success: true,
      count: files.length,
      leads: files
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error leyendo leads temporales',
      leads: []
    })
  }
}