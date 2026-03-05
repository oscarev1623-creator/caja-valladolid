import path from 'path'
import fs from 'fs'

// Parchear PDFKit para que use las fuentes locales
export function patchPDFKit() {
  try {
    // Rutas a las fuentes descargadas
    const fontsDir = path.join(process.cwd(), 'public', 'fonts')
    
    // Mapeo de fuentes a archivos locales
    const fontFiles = {
      'Helvetica.afm': path.join(fontsDir, 'Helvetica.afm'),
      'Helvetica-Bold.afm': path.join(fontsDir, 'Helvetica-Bold.afm'),
      'Helvetica-Oblique.afm': path.join(fontsDir, 'Helvetica-Oblique.afm'),
      'Helvetica-BoldOblique.afm': path.join(fontsDir, 'Helvetica-Bold.afm') // Usamos Bold como fallback
    }

    // Verificar que los archivos existen
    for (const [fontFile, fontPath] of Object.entries(fontFiles)) {
      if (!fs.existsSync(fontPath)) {
        console.warn(`⚠️ Fuente no encontrada: ${fontPath}`)
      } else {
        console.log(`✅ Fuente encontrada: ${fontFile}`)
      }
    }

    // Parchear el módulo 'fs' para interceptar las llamadas a readFileSync
    const originalReadFileSync = fs.readFileSync
    
    // @ts-ignore - Parcheamos fs.readFileSync
    fs.readFileSync = function(path, options) {
      const pathStr = path.toString()
      
      // Interceptar rutas de fuentes de Helvetica
      for (const [fontFile, localPath] of Object.entries(fontFiles)) {
        if (pathStr.includes(fontFile) || pathStr.includes('data/Helvetica')) {
          console.log(`🔄 Redirigiendo: ${pathStr} -> ${localPath}`)
          return originalReadFileSync(localPath, options)
        }
      }
      
      return originalReadFileSync(path, options)
    }

    console.log('✅ PDFKit parcheado correctamente')
  } catch (error) {
    console.error('❌ Error parcheando PDFKit:', error)
  }
}