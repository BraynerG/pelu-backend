import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- REFINING REMAINING SERVICES ---');
  
  const updates = [
    {
      oldName: 'Mantenimiento mechas ',
      newName: 'Mantenimiento de mechas',
      newDesc: 'Retoque rápido de luz en las secciones más visibles (contornos y zona superior) para refrescar el look entre visitas completas.'
    },
    {
      oldName: 'Agregar plex al tinte ',
      newName: 'Protector capilar Plex adicional',
      newDesc: 'Adición de aditivo protector Plex en la mezcla del tinte para proteger la integridad del cabello durante la coloración.'
    },
    {
      oldName: 'Agregar olaplex a decoloracion ',
      newName: 'Protector de enlaces Olaplex para decoloración',
      newDesc: 'Adición del aditivo reconstructor Olaplex Nº 1 directamente en la mezcla decolorante para proteger la cutícula.'
    },
    {
      oldName: 'Ampolla hidratacion con lavado y secado express',
      newName: 'Tratamiento de ampolla hidratante con secado express',
      newDesc: 'Tratamiento rápido que incluye lavado capilar, aplicación de ampolla hidratante concentrada y secado express.'
    }
  ];

  for (const up of updates) {
    const s = await prisma.service.findFirst({
      where: {
        name: {
          contains: up.oldName.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (s) {
      console.log(`Updating remaining service: "${s.name}" -> "${up.newName}"`);
      await prisma.service.update({
        where: { id: s.id },
        data: {
          name: up.newName,
          description: up.newDesc
        }
      });
    }
  }

  console.log('--- REMAINING SERVICES REFINEMENT COMPLETED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
