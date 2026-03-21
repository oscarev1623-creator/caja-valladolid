const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    // 1. Eliminar usuario existente
    await prisma.user.deleteMany({
      where: { email: 'oscarev1623@gmail.com' }
    });
    
    // 2. Crear nuevo con contraseña hasheada
    const hashed = await bcrypt.hash('Dolar100$', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'oscarev1623@gmail.com',
        password: hashed,
        name: 'Admin',
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin creado:', admin.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();