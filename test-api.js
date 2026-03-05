// test-api.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log("🔍 Probando conexión a SQLite...")
    
    // Crear un lead de prueba
    const lead = await prisma.lead.create({
      data: {
        fullName: "Prueba Node.js",
        phone: "5533333333",
        email: "test@node.com"
      }
    })
    
    console.log("✅ Lead creado:", lead.id)
    
    // Contar todos
    const count = await prisma.lead.count()
    console.log("📊 Total leads:", count)
    
  } catch (error) {
    console.error("❌ Error:", error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
