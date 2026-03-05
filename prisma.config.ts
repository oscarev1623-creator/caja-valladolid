// prisma.config.ts
import "dotenv/config";  // Asegúrate de importar dotenv para cargar las variables de entorno

import { defineConfig } from 'prisma';

export default defineConfig({
  datasources: {
    db: {
      provider: 'postgresql',  // El proveedor de la base de datos
      url: process.env.DATABASE_URL,  // La URL de la base de datos, que se carga desde .env
    },
  },
});
