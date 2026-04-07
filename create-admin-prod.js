const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('Dolar100$', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'oscarev1623@gmail.com' },
    update: { password: hashed },
    create: {
      email: 'oscarev1623@gmail.com',
      password: hashed,
      name: 'Oscar',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin creado en producción:', admin.email);
  await prisma.$disconnect();
}

main().catch(console.error);