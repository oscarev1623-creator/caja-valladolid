const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function importLeads() {
  const data = JSON.parse(fs.readFileSync('./little-dew-58458726_backup-mayo-2026_neondb_2026-05-01_15-10-51.json', 'utf8'))
  
  console.log(`📥 Importando ${data.length} leads...`)
  
  for (const lead of data) {
    try {
      await prisma.lead.create({
        data: {
          id: lead.id,
          fullName: lead.fullName,
          phone: lead.phone,
          email: lead.email,
          estimatedAmount: lead.estimatedAmount || 0,
          creditType: lead.creditType || 'TRADITIONAL',
          message: lead.message || '',
          status: lead.status || 'PENDING_CONTACT',
          source: lead.source || 'WEB_FORM',
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
          // ... otros campos si los necesitas
        }
      })
      console.log(`✅ ${lead.fullName}`)
    } catch (error) {
      console.error(`❌ Error con ${lead.fullName}:`, error.message)
    }
  }
  
  console.log('✅ Importación completada')
}

importLeads()