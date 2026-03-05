// prisma/seed.ts - VERSIÓN CON UPSERT
import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 ACTUALIZANDO usuario admin...')

  const adminPassword = 'Admin123!'
  const hashedPassword = hashSync(adminPassword, 10)
  
  console.log('🔑 Contraseña a usar:', adminPassword)
  console.log('🔑 Hash generado:', hashedPassword.substring(0, 30) + '...')
  
  // UPSERT: Actualizar si existe, crear si no existe
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cajavalladolid.com' },
    update: {
      password: hashedPassword, // ¡ACTUALIZAR CONTRASEÑA!
      name: 'Administrador Principal',
      role: 'ADMIN'
    },
    create: {
      email: 'admin@cajavalladolid.com',
      password: hashedPassword,
      name: 'Administrador Principal',
      role: 'ADMIN'
    }
  })

  console.log('\n✅ USUARIO ACTUALIZADO/CREADO:')
  console.log('   📧 Email:', admin.email)
  console.log('   🔐 Password:', adminPassword)
  console.log('   🆔 ID:', admin.id)
  console.log('   🔑 Hash almacenado:', admin.password.substring(0, 30) + '...')
  console.log('   📅 Última actualización:', new Date().toLocaleString())
  
  // Verificar que se puede comparar
  const bcrypt = require('bcryptjs')
  const isValid = bcrypt.compareSync(adminPassword, admin.password)
  console.log('\n🔍 VERIFICACIÓN bcrypt.compare:')
  console.log('   Contraseña correcta:', isValid ? '✅ SÍ' : '❌ NO')
  
  if (!isValid) {
    console.log('\n⚠️  ¡ADVERTENCIA! La contraseña no coincide.')
    console.log('   Esto puede pasar si:')
    console.log('   1. El hash se corrompió')
    console.log('   2. Hay un problema con bcrypt')
    console.log('\n   Solución: Forzar recreación completa')
    
    // Forzar eliminación y recreación
    console.log('\n🔄 Forzando recreación...')
    await prisma.user.delete({
      where: { email: 'admin@cajavalladolid.com' }
    })
    
    const newAdmin = await prisma.user.create({
      data: {
        email: 'admin@cajavalladolid.com',
        password: hashSync(adminPassword, 10), // NUEVO hash
        name: 'Administrador Principal',
        role: 'ADMIN'
      }
    })
    
    const newIsValid = bcrypt.compareSync(adminPassword, newAdmin.password)
    console.log('   ✅ Nueva verificación:', newIsValid ? 'CORRECTA' : 'INCORRECTA')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })