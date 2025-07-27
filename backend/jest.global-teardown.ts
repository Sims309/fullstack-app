// backend/jest.global-teardown.ts
import { prisma } from './src/server/prismaClient';

export default async function globalTeardown() {
  console.log('🧹 [globalTeardown] Fermeture des connexions...');
  await prisma.$disconnect(); // Ferme proprement la connexion Prisma
}
