const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function handler(req, res) {
  // SOLO aceptar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Verificar secreto
  if (req.body.secret !== process.env.ADMIN_CREATION_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { email, password, name = 'Administrador' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hashedPassword, 
        role: 'ADMIN' 
      },
      create: { 
        email, 
        password: hashedPassword, 
        name, 
        role: 'ADMIN' 
      },
    });

    // No enviar la contraseña en la respuesta
    const { password: _, ...adminWithoutPassword } = admin;
    
    res.status(200).json({ 
      success: true, 
      message: 'Admin creado/actualizado correctamente',
      user: adminWithoutPassword 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = handler;