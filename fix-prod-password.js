const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://a8cb9ae6d687cd4fcf531ab885d81440fc1a6efb238124682e7be37d99d62bf3:sk_4cTLGePuR7rImJW_SwHno@db.prisma.io:5432/postgres?sslmode=require'
    }
  }
});

async function main() {
  console.log('🔍 Buscando usuario...');
  
  // Verificar si existe
  const existing = await prisma.user.findUnique({
    where: { email: 'oscarev1623@gmail.com' }
  });
  
  if (existing) {
    console.log('✅ Usuario encontrado:', existing.email);
    console.log('🔐 Hash actual:', existing.password.substring(0, 30) + '...');
  } else {
    console.log('❌ Usuario NO encontrado');
  }
  
  // Actualizar/crear con nueva contraseña
  const hashed = await bcrypt.hash('Dolar100$', 10);
  console.log('🆕 Nuevo hash generado:', hashed);
  
  const user = await prisma.user.upsert({
    where: { email: 'oscarev1623@gmail.com' },
    update: { password: hashed },
    create: {
      email: 'oscarev1623@gmail.com',
      password: hashed,
      name: 'Oscar',
      role: 'ADMIN'
    }
  });
  
  console.log('✅ Usuario actualizado:', user.email);
  console.log('🔐 Nuevo hash en BD:', user.password.substring(0, 30) + '...');
  
  // Verificar que funciona
  const verify = await bcrypt.compare('Dolar100$', user.password);
  console.log('🔍 Verificación:', verify ? '✅ CORRECTA' : '❌ INCORRECTA');
  
  await prisma.$disconnect();
}

main().catch(console.error);