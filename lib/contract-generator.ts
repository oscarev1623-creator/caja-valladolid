// app/lib/contract-generator.ts
import PDFDocument from 'pdfkit'

export class ContractGenerator {
  static generateContract(lead: any, terms: any): Buffer {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []
    
    doc.on('data', chunk => chunks.push(chunk))
    
    // Encabezado
    doc.fontSize(20)
      .font('Helvetica-Bold')
      .text('CONTRATO DE PRÉSTAMO', { align: 'center' })
    
    doc.moveDown()
    doc.fontSize(12)
      .font('Helvetica')
      .text(`Número de contrato: ${generateContractNumber()}`, { align: 'center' })
    
    // Fecha y lugar
    doc.moveDown()
    doc.text(`En ${terms.city}, a ${new Date().toLocaleDateString('es-MX')}`)
    
    // Partes
    doc.moveDown()
    doc.font('Helvetica-Bold').text('PRIMERA.- PARTES')
    doc.font('Helvetica')
    doc.text(`Por una parte, ${lead.fullName}, con RFC ${lead.rfc},`)
    doc.text(`domiciliado en ${lead.address}, en lo sucesivo "EL CLIENTE".`)
    doc.moveDown()
    doc.text('Por otra parte, CAJA POPULAR SAN BERNARDINO DE SIENA VALLADOLID,')
    doc.text('con registro oficial 29198, representada en este acto por su apoderado legal,')
    doc.text('en lo sucesivo "LA INSTITUCIÓN".')
    
    // Cláusulas
    doc.moveDown()
    doc.font('Helvetica-Bold').text('SEGUNDA.- OBJETO')
    doc.font('Helvetica')
    doc.text('LA INSTITUCIÓN otorga a EL CLIENTE un préstamo por la cantidad de:')
    doc.moveDown()
    doc.fontSize(14)
      .text(`${formatCurrency(terms.amount)} (${numberToWords(terms.amount)} PESOS)`, { align: 'center' })
    
    doc.moveDown()
    doc.fontSize(12)
    doc.font('Helvetica-Bold').text('TERCERA.- PLAZO Y AMORTIZACIÓN')
    doc.font('Helvetica')
    doc.text(`1. Plazo: ${terms.termMonths} meses`)
    doc.text(`2. Tasa de interés anual fija: ${terms.interestRate}%`)
    doc.text(`3. Pago mensual: ${formatCurrency(terms.monthlyPayment)}`)
    doc.text(`4. Anticipo requerido: ${formatCurrency(terms.advancePayment)} (${(terms.advancePayment/terms.amount*100).toFixed(1)}% del total)`)
    doc.text('   Este anticipo será descontado del monto total del préstamo.')
    
    // Más cláusulas...
    doc.moveDown()
    doc.font('Helvetica-Bold').text('CUARTA.- SEGURO DE VIDA')
    doc.font('Helvetica')
    doc.text('El crédito incluye seguro de vida por el monto total del adeudo.')
    doc.text(`Costo del seguro: ${formatCurrency(terms.insuranceCost || terms.amount * 0.001)} mensual.`)
    
    // Firmas
    doc.moveDown(3)
    doc.text('_________________________', 100, doc.y, { width: 200, align: 'center' })
    doc.text('EL CLIENTE', 100, doc.y + 20, { width: 200, align: 'center' })
    
    doc.text('_________________________', 300, doc.y - 40, { width: 200, align: 'center' })
    doc.text('LA INSTITUCIÓN', 300, doc.y - 20, { width: 200, align: 'center' })
    
    // Pie de página
    doc.fontSize(8)
      .text('Registro Oficial: 29198 • CONDUSEF ID: 4930 • Av. Principal #123, Centro, Valladolid, Mich.', 
        50, doc.page.height - 50, { align: 'center' })
    
    doc.end()
    
    return Buffer.concat(chunks)
  }
}

function generateContractNumber(): string {
  return `CT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

function numberToWords(num: number): string {
  // Implementar conversión de números a palabras en español
  const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
  const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  // ... más lógica
  return 'Ciento cincuenta mil'
}