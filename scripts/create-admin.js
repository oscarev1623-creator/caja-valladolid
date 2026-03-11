// scripts/create-admin.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = 'admin123' // Cambia esto por la contraseña que quieras
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@cajavalladolid.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN'
    }
  })

  console.log('✅ Administrador creado:', admin.email)
  console.log('🔑 Contraseña:', password)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())