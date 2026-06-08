import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING SERVICE CASING AND COPYWRITING REFINEMENT ---');

  const services = await prisma.service.findMany({
    include: { variants: true }
  });

  const curation: { 
    [key: string]: { 
      name: string; 
      description: string; 
      variants?: { [oldName: string]: string } 
    } 
  } = {
    'Corte de Cabello & Peinado': {
      name: 'Corte de cabello y peinado',
      description: 'Servicio de diseño capilar personalizado adaptado a tus facciones. Incluye lavado capilar orgánico con masaje relajante, corte de precisión y peinado profesional.',
      variants: {
        'Cabello Corto': 'Cabello corto',
        'Media Melena': 'Cabello medio (media melena)',
        'Cabello Largo': 'Cabello largo',
        'Cabello Extra Largo': 'Cabello extra largo'
      }
    },
    'Corte de Cabello Solo': {
      name: 'Corte de cabello solo',
      description: 'Corte de precisión de autor sin servicio de secado ni peinado. Ideal para retocar puntas o mantenimiento rápido.',
      variants: {
        'Adulto Solo': 'Corte adulto',
        'Señora (+70)': 'Corte señora mayor de 70 años'
      }
    },
    'Corte Infantil (Niñas)': {
      name: 'Corte infantil para niñas',
      description: 'Corte de cabello adaptado para niñas menores de 13 años. Incluye lavado suave y secado rápido.',
      variants: {
        'Corte Completo (menores 10 años)': 'Corte completo (menores de 10 años)',
        'Solo Flequillo': 'Solo corte de flequillo'
      }
    },
    'Peinado & Styling Profesional': {
      name: 'Peinado y peinado de autor',
      description: 'Lavado capilar con champú seleccionado según tu tipo de cabello, tratamiento acondicionador express y peinado profesional con plancha o cepillo.',
      variants: {
        'Cabello Corto': 'Cabello corto',
        'Cabello Medio': 'Cabello medio',
        'Cabello Largo': 'Cabello largo',
        'Cabello Extra Largo': 'Cabello extra largo',
        'Corto Señora (+70)': 'Cabello corto para señora mayor de 70 años'
      }
    },
    'Tinte Clásico (Con Amoníaco)': {
      name: 'Tinte clásico con amoníaco',
      description: 'Coloración permanente clásica que garantiza una cobertura total de canas y un color intenso y uniforme de larga duración.',
      variants: {
        'Solo Raíz': 'Solo retoque de raíz',
        'Cabello Corto (hasta hombros)': 'Cabello corto (hasta los hombros)',
        'Cabello Medio (hombros a espalda)': 'Cabello medio (de hombros a media espalda)',
        'Cabello Largo': 'Cabello largo'
      }
    },
    'Tinte Orgánico Premium (Plex & Sin Amoníaco)': {
      name: 'Tinte orgánico premium sin amoníaco con Plex',
      description: 'Coloración de alta gama libre de amoníaco con adición de tratamiento protector Plex. Protege la fibra capilar y evita irritaciones en cueros cabelludos sensibles.',
      variants: {
        'Solo Raíz': 'Solo retoque de raíz',
        'Cabello Medio': 'Cabello medio',
        'Cabello Largo': 'Cabello largo',
        'Cabello Extra Largo': 'Cabello extra largo'
      }
    },
    'Baño de Color / Matiz (Con Amoníaco)': {
      name: 'Baño de color o matiz con amoníaco',
      description: 'Tratamiento semi-permanente para reavivar el color de las mechas, corregir reflejos indeseados o añadir un extra de brillo tridimensional.',
      variants: {
        'Cabello Medio': 'Cabello medio',
        'Cabello Largo': 'Cabello largo',
        'Cabello Extra Largo': 'Cabello extra largo'
      }
    },
    'Mechas Clásicas & Peinado': {
      name: 'Mechas clásicas con peinado',
      description: 'Técnica tradicional de aclaración por secciones para aportar luz, dimensión y contraste natural al cabello. Incluye peinado final.',
      variants: {
        'Cabello Corto (+70 opc)': 'Cabello corto (incluye opción para señora)',
        'Cabello Medio': 'Cabello medio',
        'Cabello Largo': 'Cabello largo',
        'Cabello Extra Largo': 'Cabello extra largo'
      }
    },
    'Botox Capilar Discipline': {
      name: 'Tratamiento de bótox capilar de disciplina',
      description: 'Tratamiento intensivo de hidratación que rellena la fibra capilar, elimina el frizz y devuelve un brillo radiante y sedosidad al cabello.',
      variants: {
        'Cabello Medio (hombros)': 'Cabello medio (hasta los hombros)',
        'Media Espalda': 'Cabello medio-largo (hasta media espalda)',
        'Cabello Largo': 'Cabello largo',
        'Cabello Extra Largo': 'Cabello extra largo'
      }
    },
    'Alisado Profesional & Orgánico': {
      name: 'Alisado profesional orgánico',
      description: 'Tratamiento alisador termoactivo libre de formol que alisa de forma duradera la onda capilar, dejando el pelo disciplinado, suave y fácil de peinar.',
      variants: {
        'Alisado Brasileño Mínimo': 'Alisado brasileño (mínimo de producto)',
        'Retoque Raíz (<3 meses)': 'Retoque de raíz (menos de 3 meses)',
        'Flequillo': 'Solo alisado de flequillo',
        'Corto/Medio (hasta hombros)': 'Cabello corto o medio (hasta los hombros)',
        'Cabello Medio/Largo (media espalda)': 'Cabello medio o largo (hasta media espalda)',
        'Cabello Largo': 'Cabello largo'
      }
    },
    'Tratamiento Hidratación Células Madre': {
      name: 'Tratamiento reconstructor de células madre',
      description: 'Ritual premium reconstructor formulado con células madre vegetales de argán. Devuelve la elasticidad y juventud al cabello dañado.',
      variants: {
        'Cabello Corto': 'Cabello corto',
        'Cabello Medio': 'Cabello medio',
        'Cabello Largo': 'Cabello largo'
      }
    },
    'Tratamiento Reconstructor Olaplex': {
      name: 'Tratamiento reconstructor capilar Olaplex',
      description: 'Tratamiento profesional que repara y multiplica los enlaces de disulfuro rotos en el cabello por procesos químicos de color y decoloración.',
      variants: {
        'Cabello Corto': 'Cabello corto',
        'Cabello Medio': 'Cabello medio',
        'Cabello Largo': 'Cabello largo'
      }
    },
    // Remaining services
    'lavado cabello hidratacion adulta': {
      name: 'Lavado de cabello con hidratación profunda',
      description: 'Lavado capilar purificante acompañado de mascarilla profesional súper nutritiva. No incluye peinado ni secado.'
    },
    'ampolla hidratacion con lavado and secado express': {
      name: 'Ampolla de hidratación con secado express',
      description: 'Tratamiento rápido que incluye lavado, aplicación de ampolla hidratante concentrada y secado express con cepillado rápido.'
    },
    'peinado sencillo  boda...invitada,precio variable(desde)': {
      name: 'Peinado sencillo para invitadas de boda',
      description: 'Peinado elegante y rápido para eventos y celebraciones, realizado en menos de una hora.'
    },
    'novia peinado': {
      name: 'Peinado de novia exclusivo',
      description: 'Diseño de peinado de alta costura para novias. Incluye diagnóstico previo, pruebas y los productos necesarios para un acabado impecable y duradero.'
    },
    'lavado cabello niña y hidratación(menor de 13 años)': {
      name: 'Lavado e hidratación infantil',
      description: 'Lavado suave con champú infantil e hidratación ligera con acondicionador sin aclarado para niñas menores de 13 años.'
    },
    'señora (+70)tinte cabello raiz solo': {
      name: 'Tinte de raíz para señora mayor de 70 años',
      description: 'Aplicación rápida de tinte de mantenimiento en raíces para señoras mayores de 70 años.'
    },
    '***señora (+70)tinte ,corte,peinado': {
      name: 'Servicio completo de tinte, corte y peinado para señora mayor de 70 años',
      description: 'Pack de mantenimiento mensual a precio especial que incluye aplicación de color en raíz, corte de cabello y peinado corto.'
    },
    'mantenimiento mechas ': {
      name: 'Mantenimiento express de mechas',
      description: 'Retoque rápido de luz en las secciones más visibles (contornos y zona superior) para refrescar el look entre visitas completas.'
    },
    'agregar plex al tinte ': {
      name: 'Protector capilar Plex adicional',
      description: 'Adición de aditivo protector Plex en la mezcla del tinte para minimizar el daño y proteger la integridad del cabello.'
    },
    'agregar olaplex a decoloracion ': {
      name: 'Protector de enlaces Olaplex para decoloración',
      description: 'Adición del aditivo reconstructor Olaplex Nº 1 directamente en la mezcla decolorante para proteger la cutícula.'
    }
  };

  for (const s of services) {
    const refined = curation[s.name.trim()];
    if (refined) {
      console.log(`Updating "${s.name}" -> "${refined.name}"`);
      await prisma.service.update({
        where: { id: s.id },
        data: {
          name: refined.name,
          description: refined.description
        }
      });

      if (refined.variants && s.variants.length > 0) {
        for (const v of s.variants) {
          const newVariantName = refined.variants[v.name];
          if (newVariantName) {
            console.log(`  Updating variant "${v.name}" -> "${newVariantName}"`);
            await prisma.serviceVariant.update({
              where: { id: v.id },
              data: { name: newVariantName }
            });
          }
        }
      }
    } else {
      // General regex sentence case fallback
      const sentenceCasedName = s.name.charAt(0).toUpperCase() + s.name.slice(1).toLowerCase();
      console.log(`Fallback casing for "${s.name}" -> "${sentenceCasedName}"`);
      await prisma.service.update({
        where: { id: s.id },
        data: {
          name: sentenceCasedName
        }
      });
    }
  }

  console.log('--- REFINEMENT COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
