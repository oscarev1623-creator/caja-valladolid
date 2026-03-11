const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function handler(req, res) {
  // Proteger con el mismo secreto
  if (req.query.secret !== process.env.ADMIN_CREATION_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = handler;