const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const leads = await prisma.lead.findMany({
    take: 5,
    select: {
      id: true,
      fullName: true,
      message: true,
      email: true,
      createdAt: true
    }
  });

  console.log('📋 Últimos 5 leads con mensajes:');
  console.table(leads);
  await prisma.$disconnect();
}

check().catch(console.error);