const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:wilMmmkXweLZnbipmcwuYwLnKuSILRiy@mainline.proxy.rlwy.net:47015/railway'
    }
  }
});

async function main() {
  const email = 'oscarev1623@gmail.com';
  const testPassword = 'Dolar100$';
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log('❌ Usuario no encontrado');
    return;
  }
  
  console.log('✅ Usuario encontrado:', user.email);
  console.log('🔐 Hash en BD:', user.password);
  
  const isValid = await bcrypt.compare(testPassword, user.password);
  console.log('🔍 La contraseña es correcta?', isValid ? '✅ SÍ' : '❌ NO');
  
  if (!isValid) {
    // Generar un hash nuevo para comparar
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('🆕 Hash nuevo generado:', newHash);
    console.log('ℹ️ Compara si el hash en BD es diferente');
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);