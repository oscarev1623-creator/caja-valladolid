const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:wilMmmkXweLZnbipmcwuYwLnKuSILRiy@mainline.proxy.rlwy.net:47015/railway'
    }
  }
});

async function fixPassword() {
  try {
    console.log('🔧 Iniciando corrección...');
    
    // Generar hash
    const hashed = await bcrypt.hash('Dolar100$', 10);
    console.log('🔐 Hash generado:', hashed);
    
    // Actualizar usuario
    const user = await prisma.user.update({
      where: { email: 'oscarev1623@gmail.com' },
      data: { password: hashed }
    });
    
    console.log('✅ Usuario actualizado:', user.email);
    
    // Verificar
    const verify = await bcrypt.compare('Dolar100$', user.password);
    console.log('🔍 Verificación:', verify ? '✅ CORRECTA' : '❌ INCORRECTA');
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixPassword();