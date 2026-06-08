import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Eliminar slides anteriores
  await prisma.lookbookSlide.deleteMany({});
  console.log('Slides de lookbook anteriores eliminados.');

  // 2. Insertar nuevos slides coherentes con el negocio
  const slides = [
    {
      url: '/images/hero_salon.webp',
      title: 'Karen Mendez Hair Designer',
      subtitle: 'Diseño capilar orgánico y rituales de alta costura concebidos con absoluto rigor y distinción.',
      tag: 'EL SALÓN',
      accent: 'EXPERIENCIA EXCLUSIVA',
    },
    {
      url: '/images/service_haircut.webp',
      title: 'Corte de Autor & Styling',
      subtitle: 'Cortes de precisión diseñados a medida para adaptar a tus facciones y potenciar tu movimiento natural.',
      tag: 'CORTES',
      accent: 'DISEÑO PERSONALIZADO',
    },
    {
      url: '/images/service_balayage.webp',
      title: 'Balayage Signature Gold',
      subtitle: 'Iluminación tridimensional con degradados perfectos y reflejos llenos de vida y brillo supremo.',
      tag: 'COLORACIÓN',
      accent: 'TÉCNICAS PREMIUM',
    },
    {
      url: '/images/service_facial.webp',
      title: 'Ritual Facial Vitamina C',
      subtitle: 'Tratamiento antioxidante intensivo que devuelve la luminosidad inmediata a tu piel con masaje Kobido tensor.',
      tag: 'ESTÉTICA',
      accent: 'SALUD & BIENESTAR',
    },
    {
      url: '/images/service_makeup.webp',
      title: 'Maquillaje Social Glow',
      subtitle: 'Maquillaje profesional de alta gama con efecto piel satinada de larga duración para tus momentos inolvidables.',
      tag: 'MAQUILLAJE',
      accent: 'NOVIAS & SOCIALES',
    }
  ];

  for (const slide of slides) {
    await prisma.lookbookSlide.create({
      data: slide,
    });
  }
  console.log('Nuevos slides coherentes agregados con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
