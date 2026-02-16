import { PrismaClient } from '@prisma/client';

// Función para crear cliente Prisma con configuración optimizada para Vercel
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'production'
          ? process.env.DATABASE_URL
          : process.env.DIRECT_URL, // Usar DIRECT_URL en desarrollo
      },
    },
  });
}

// Singleton pattern para evitar múltiples instancias
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Conectar y verificar al inicio
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma Client conectado correctamente');
  })
  .catch((error) => {
    console.error('❌ Error al conectar Prisma Client:', error);
  });

export default prisma;