import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database backup...');
  try {
    const projects = await prisma.project.findMany({});
    const services = await prisma.service.findMany({});
    const lookbookSlides = await prisma.lookbookSlide.findMany({});
    const users = await prisma.user.findMany({});
    const reservations = await prisma.reservation.findMany({});

    const backupData = {
      projects,
      services,
      lookbookSlides,
      users,
      reservations,
      backupTimestamp: new Date().toISOString(),
    };

    const backupPath = path.join(__dirname, '../../db_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`Backup successfully saved to ${backupPath}`);
    console.log(`Backed up:
      - Projects: ${projects.length}
      - Services: ${services.length}
      - LookbookSlides: ${lookbookSlides.length}
      - Users: ${users.length}
      - Reservations: ${reservations.length}
    `);
  } catch (error) {
    console.error('Error creating backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
