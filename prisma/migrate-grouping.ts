import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING CONSOLIDATED SERVICE VARIANT MIGRATION ---');

  // Load existing data
  const oldServices = await prisma.service.findMany({});
  const oldReservations = await prisma.reservation.findMany({});
  
  console.log(`Found ${oldServices.length} services and ${oldReservations.length} reservations.`);

  // Define new consolidated services and their variants
  // We classify them into detailed categories: 'hair-cut', 'hair-style', 'hair-color', 'hair-treatment', 'hair-straightening', 'makeup', 'spa', 'hair-addon'
  const consolidationPlan = [
    {
      key: 'corte-adulta-peinado',
      name: 'Corte de Cabello & Peinado',
      description: 'Corte personalizado adaptado a tus facciones. Incluye lavado capilar, hidratación, termoprotección y peinado/secado.',
      category: 'hair-cut',
      imageUrl: '/images/service_haircut.webp',
      steps: [
        'Diagnóstico personalizado de visagismo',
        'Lavado capilar con champú seleccionado e hidratación',
        'Corte de precisión de autor',
        'Aplicación de termoprotectores y peinado completo'
      ],
      variants: [
        { name: 'Cabello Corto', price: 24, duration: 120, matchNames: ['corte cabello corto con peinado'] },
        { name: 'Media Melena', price: 30, duration: 120, matchNames: ['corte cabello media melenita y peinado'] },
        { name: 'Cabello Largo', price: 36, duration: 120, matchNames: ['corte cabello largo y peinado'] },
        { name: 'Cabello Extra Largo', price: 40, duration: 150, matchNames: ['corte cabello extra largo y peinado'] }
      ]
    },
    {
      key: 'corte-adulta-solo',
      name: 'Corte de Cabello Solo',
      description: 'Corte de precisión para cuando solo deseas retocar las puntas o cambiar tu estilo sin peinado.',
      category: 'hair-cut',
      imageUrl: '/images/service_haircut.webp',
      steps: ['Diagnóstico de visagismo', 'Lavado express', 'Corte de precisión'],
      variants: [
        { name: 'Adulto Solo', price: 18, duration: 60, matchNames: ['corte cabello adulta solo '] },
        { name: 'Señora (+70)', price: 12, duration: 25, matchNames: ['señora (+70)corte cabello'] }
      ]
    },
    {
      key: 'corte-infantil',
      name: 'Corte Infantil (Niñas)',
      description: 'Corte especial adaptado para las más pequeñas. Menores de 13 años.',
      category: 'hair-cut',
      imageUrl: null,
      steps: ['Lavado suave', 'Corte adaptado', 'Secado rápido'],
      variants: [
        { name: 'Corte Completo (menores 10 años)', price: 15, duration: 60, matchNames: ['corte cabello niña'] },
        { name: 'Solo Flequillo', price: 5, duration: 20, matchNames: ['corte flequillo niña'] }
      ]
    },
    {
      key: 'peinado-adulta',
      name: 'Peinado & Styling Profesional',
      description: 'Lavado con champú premium, tratamiento acondicionador y peinado profesional adaptado a tu estilo.',
      category: 'hair-style',
      imageUrl: '/images/hero_salon.webp',
      steps: ['Lavado capilar orgánico', 'Tratamiento acondicionador', 'Marcado y secado profesional con plancha o cepillo'],
      variants: [
        { name: 'Cabello Corto', price: 15, duration: 40, matchNames: ['peinado adulta corto'] },
        { name: 'Cabello Medio', price: 18, duration: 60, matchNames: ['peinado medio adulta'] },
        { name: 'Cabello Largo', price: 22, duration: 120, matchNames: ['peinado largo'] },
        { name: 'Cabello Extra Largo', price: 25, duration: 120, matchNames: ['peinado extra largo adulta'] },
        { name: 'Corto Señora (+70)', price: 12, duration: 40, matchNames: ['peinado señora corto(+70)'] }
      ]
    },
    {
      key: 'tinte-amoniaco',
      name: 'Tinte Clásico (Con Amoníaco)',
      description: 'Coloración permanente para una cobertura total de canas y unificación del tono capilar.',
      category: 'hair-color',
      imageUrl: null,
      steps: ['Preparación y diagnóstico', 'Aplicación de color de raíz a puntas', 'Lavado con champú ácido sellador e hidratación'],
      variants: [
        { name: 'Solo Raíz', price: 20, duration: 60, matchNames: ['tinte raiz'] },
        { name: 'Cabello Corto (hasta hombros)', price: 40, duration: 120, matchNames: ['tinte todo el cabello corto con amoniaco hasta los hombros'] },
        { name: 'Cabello Medio (hombros a espalda)', price: 45, duration: 120, matchNames: ['tinte todo el cabello de hombros a media espalda con amoniaco'] },
        { name: 'Cabello Largo', price: 55, duration: 150, matchNames: ['tinte todo el cabello con amoniaco largo'] }
      ]
    },
    {
      key: 'tinte-sin-amoniaco',
      name: 'Tinte Orgánico Premium (Plex & Sin Amoníaco)',
      description: 'Coloración de alta gama sin amoníaco con sistema de protección Plex que protege la fibra capilar, ideal para cueros cabelludos sensibles.',
      category: 'hair-color',
      imageUrl: '/images/service_balayage.webp',
      steps: ['Estudio capilar', 'Aplicación de coloración botánica sin amoníaco', 'Tratamiento de nutrición sellador de cutícula'],
      variants: [
        { name: 'Solo Raíz', price: 23, duration: 80, matchNames: ['tinte raiz natural,con plex ,sin amoniaco'] },
        { name: 'Cabello Medio', price: 46, duration: 90, matchNames: ['tinte todo cabello plex sin amoniaco medio'] },
        { name: 'Cabello Largo', price: 56, duration: 90, matchNames: ['tinte todo el cabello plex largo'] },
        { name: 'Cabello Extra Largo', price: 76, duration: 150, matchNames: ['tinte completo extra largo plex sin amoniaco (variable ,según la cantidad'] }
      ]
    },
    {
      key: 'bano-color',
      name: 'Baño de Color / Matiz (Con Amoníaco)',
      description: 'Tratamiento para reavivar el tono de las mechas, aportar un brillo espectacular o matizar reflejos no deseados.',
      category: 'hair-color',
      imageUrl: null,
      steps: ['Lavado preparador', 'Aplicación de matiz semi-permanente', 'Tratamiento hidratante de brillo'],
      variants: [
        { name: 'Cabello Medio', price: 20, duration: 120, matchNames: ['baño color cabello mediano con amoniaco'] },
        { name: 'Cabello Largo', price: 25, duration: 120, matchNames: ['baño color cabello largo con amoniaco'] },
        { name: 'Cabello Extra Largo', price: 30, duration: 150, matchNames: ['baño color con amoniaco en cabello extra largo'] }
      ]
    },
    {
      key: 'mechas-completas',
      name: 'Mechas Clásicas & Peinado',
      description: 'Técnicas de iluminación por secciones (balayage o plata) para aportar luz y relieve. Incluye peinado.',
      category: 'hair-color',
      imageUrl: '/images/service_balayage.webp',
      steps: ['Visagismo y diseño de luces', 'Aplicación del decolorante con protección', 'Matización personalizada', 'Peinado final'],
      variants: [
        { name: 'Cabello Corto (+70 opc)', price: 75, duration: 120, matchNames: ['mechas adulta corto incluye peinado', 'señoras(+70)mechas y peinado,cabello corto'] },
        { name: 'Cabello Medio', price: 120, duration: 150, matchNames: ['mechas cabello medio'] },
        { name: 'Cabello Largo', price: 150, duration: 200, matchNames: ['mechas cabello largo'] },
        { name: 'Cabello Extra Largo', price: 190, duration: 190, matchNames: ['mechas cabello extra largo'] }
      ]
    },
    {
      key: 'botox-capilar',
      name: 'Botox Capilar Discipline',
      description: 'Tratamiento ultra-hidratante que rellena la fibra capilar, reduce drásticamente el frizz y aporta un brillo radiante de pasarela.',
      category: 'hair-treatment',
      imageUrl: null,
      steps: ['Doble lavado clarificante', 'Aplicación de termocontrol con Botox', 'Sellado con plancha infrarroja'],
      variants: [
        { name: 'Cabello Medio (hombros)', price: 65, duration: 120, matchNames: ['botox cabello medio (hombros)'] },
        { name: 'Media Espalda', price: 85, duration: 150, matchNames: ['botox cabello hasta media espalda '] },
        { name: 'Cabello Largo', price: 100, duration: 190, matchNames: ['botox cabello largo'] },
        { name: 'Cabello Extra Largo', price: 150, duration: 240, matchNames: ['botox cabello extra largo'] }
      ]
    },
    {
      key: 'alisado-termo',
      name: 'Alisado Profesional & Orgánico',
      description: 'Tratamiento alisador termoactivo que relaja y alisa permanentemente la onda capilar, dejando el pelo sedoso, liso y sin frizz.',
      category: 'hair-straightening',
      imageUrl: '/images/service_makeup.webp',
      steps: ['Diagnóstico y lavado profundo', 'Aplicación de queratina/alisado', 'Secado y sellado térmico minucioso de cutícula'],
      variants: [
        { name: 'Alisado Brasileño Mínimo', price: 120, duration: 150, matchNames: ['Alisado brasileño minimo'] },
        { name: 'Retoque Raíz (<3 meses)', price: 75, duration: 150, matchNames: ['raiz alisado antes de 3 meses '] },
        { name: 'Flequillo', price: 25, duration: 30, matchNames: ['alisado de flequillo'] },
        { name: 'Corto/Medio (hasta hombros)', price: 140, duration: 180, matchNames: ['alisado hombros antes de media espalda (variable)'] },
        { name: 'Cabello Medio/Largo (media espalda)', price: 160, duration: 180, matchNames: ['alisado media espalda(variable)'] },
        { name: 'Cabello Largo', price: 190, duration: 300, matchNames: ['alisado cabello largo(variable)'] }
      ]
    },
    {
      key: 'hidratacion-celulas-madre',
      name: 'Tratamiento Hidratación Células Madre',
      description: 'Tratamiento rejuvenecedor y reconstructor basado en células madre vegetales. Aporta fuerza, elasticidad y nutrición profunda.',
      category: 'hair-treatment',
      imageUrl: null,
      steps: ['Lavado preparador', 'Aplicación del elixir concentrado de Células Madre', 'Secado express para fijar el tratamiento'],
      variants: [
        { name: 'Cabello Corto', price: 20, duration: 60, matchNames: ['hidratacion celúlas madre cabello corto poco cabello ,secado expess'] },
        { name: 'Cabello Medio', price: 20, duration: 80, matchNames: ['hidratacion celúlas madres cabello medio,secado express'] },
        { name: 'Cabello Largo', price: 35, duration: 120, matchNames: ['tratamiento hidratación celulas madres cabello largo,secado express'] }
      ]
    },
    {
      key: 'hidratacion-olaplex',
      name: 'Tratamiento Reconstructor Olaplex',
      description: 'Tratamiento premium que reconstruye los enlaces de disulfuro rotos en el cabello por procesos químicos o térmicos. Ideal para melenas decoloradas.',
      category: 'hair-treatment',
      imageUrl: null,
      steps: ['Aplicación de Olaplex Nº 1 (Multiplicador de enlaces)', 'Aplicación de Olaplex Nº 2 (Perfeccionador)', 'Corte de puntas estratégico', 'Secado express'],
      variants: [
        { name: 'Cabello Corto', price: 20, duration: 60, matchNames: ['olaplex hidratación cabello corto,corte puntas y secado express'] },
        { name: 'Cabello Medio', price: 35, duration: 80, matchNames: ['olaplex hidratación cabello medio,corte puntas y secado express'] },
        { name: 'Cabello Largo', price: 45, duration: 120, matchNames: ['olaplex hidratación cabello largo,corte puntas y secado express'] }
      ]
    }
  ];

  // For storing IDs of old services mapped to new service and variant IDs
  const mapping: { [oldId: string]: { newServiceId: string; newVariantId: string | null } } = {};

  // 1. Process consolidation
  for (const group of consolidationPlan) {
    console.log(`Creating consolidated service: ${group.name}...`);
    // Find if there is an image to use (take the first available or default)
    const newService = await prisma.service.create({
      data: {
        name: group.name,
        description: group.description,
        price: group.variants[0].price, // initial base price
        duration: group.variants[0].duration, // initial duration
        imageUrl: group.imageUrl,
        category: group.category,
        steps: group.steps,
      }
    });

    for (const v of group.variants) {
      const newVariant = await prisma.serviceVariant.create({
        data: {
          name: v.name,
          price: v.price,
          duration: v.duration,
          serviceId: newService.id
        }
      });

      // Find old services matching this variant
      for (const oldName of v.matchNames) {
        const matches = oldServices.filter(s => s.name.trim().toLowerCase() === oldName.trim().toLowerCase());
        for (const match of matches) {
          mapping[match.id] = {
            newServiceId: newService.id,
            newVariantId: newVariant.id
          };
          console.log(`  Mapped "${match.name}" (ID: ${match.id}) -> "${group.name}" / "${v.name}"`);
        }
      }
    }
  }

  // 2. Transfer services that do not need variants
  const mappedOldIds = Object.keys(mapping);
  const remainingServices = oldServices.filter(s => !mappedOldIds.includes(s.id));

  console.log(`Processing ${remainingServices.length} remaining services without variants...`);
  for (const service of remainingServices) {
    // Map category
    let newCategory = service.category;
    if (service.category === 'hair') {
      const nameLower = service.name.toLowerCase();
      if (nameLower.includes('corte')) {
        newCategory = 'hair-cut';
      } else if (nameLower.includes('peinado') || nameLower.includes('novia')) {
        newCategory = 'hair-style';
      } else if (nameLower.includes('mechas') || nameLower.includes('balayage') || nameLower.includes('tinte') || nameLower.includes('color')) {
        newCategory = 'hair-color';
      } else if (nameLower.includes('hidratacion') || nameLower.includes('olaplex') || nameLower.includes('ampolla')) {
        newCategory = 'hair-treatment';
      } else if (nameLower.includes('alisado')) {
        newCategory = 'hair-straightening';
      } else {
        newCategory = 'hair-addon';
      }
    }

    const newService = await prisma.service.create({
      data: {
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        imageUrl: service.imageUrl,
        category: newCategory,
        steps: service.steps,
      }
    });

    mapping[service.id] = {
      newServiceId: newService.id,
      newVariantId: null
    };
    console.log(`  Mapped independent "${service.name}" (ID: ${service.id}) -> Category: ${newCategory}`);
  }

  // 3. Migrate existing reservations
  console.log('Updating reservations with new service/variant IDs...');
  for (const reservation of oldReservations) {
    const mapInfo = mapping[reservation.serviceId];
    if (mapInfo) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          serviceId: mapInfo.newServiceId,
          variantId: mapInfo.newVariantId
        }
      });
      console.log(`  Updated reservation (ID: ${reservation.id}) to service ${mapInfo.newServiceId} and variant ${mapInfo.newVariantId}`);
    } else {
      console.warn(`  Warning: Could not find mapping for reservation service ID: ${reservation.serviceId}`);
    }
  }

  // 4. Delete old services (Cascade deletes any relations, but reservations were updated)
  console.log('Cleaning up old services...');
  const oldServiceIds = oldServices.map(s => s.id);
  await prisma.reservation.deleteMany({
    where: {
      serviceId: { in: oldServiceIds }
    }
  }); // Delete any dangling invalid test reservations if any
  await prisma.service.deleteMany({
    where: {
      id: { in: oldServiceIds }
    }
  });

  console.log('--- CONSOLIDATED SERVICE VARIANT MIGRATION COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
