const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true }
  });
  console.log('📋 Usuarios en la BD:', users);
  await prisma.();
}

main().catch(console.error);
