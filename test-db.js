// test-db.js
const { PrismaClient } = require('@prisma/client')

async function main() {
  console.log('🔍 Probando conexión a PostgreSQL...')
  console.log('URL:', process.env.DATABASE_URL)
  
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ Conexión exitosa')
    
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    console.log('✅ Consulta exitosa:', result)
    
    const count = await prisma.lead.count()
    console.log(`✅ Total leads: ${count}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()