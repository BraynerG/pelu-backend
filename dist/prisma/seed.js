"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.reservation.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.lookbookSlide.deleteMany({});
    console.log('Base de datos limpia: Servicios, reservaciones y lookbook antiguos eliminados.');
    const slides = [
        {
            url: '/images/hero_salon.png',
            title: 'KAREN MENDEZ',
            subtitle: 'Diseño capilar orgánico y rituales de alta costura para realzar tu esencia.',
            tag: 'HAIR DESIGNER',
            accent: 'RITUALES DE AUTOR',
        },
        {
            url: '/images/service_balayage.png',
            title: 'ILUMINACIÓN SUPREMA',
            subtitle: 'Técnicas artísticas de Balayage tridimensional y destellos de sol que dan vida a tu cabello.',
            tag: 'TENDENCIAS 2026',
            accent: 'ALTA PELUQUERÍA',
        },
        {
            url: '/images/service_makeup.png',
            title: 'EDITORIAL GLOW',
            subtitle: 'Maquillaje profesional y preparación de piel satinada para eventos inolvidables.',
            tag: 'MAQUILLAJE & MIRADA',
            accent: 'ESTILO EXCLUSIVO',
        }
    ];
    for (const slide of slides) {
        await prisma.lookbookSlide.create({
            data: slide,
        });
    }
    console.log('Slides de Lookbook dinámicos agregados correctamente.');
    const services = [
        {
            name: 'Corte de Autor & Styling',
            description: 'Un corte personalizado diseñado por Karen Mendez para adaptarse a tus facciones. Incluye lavado capilar orgánico, masaje craneal hidratante y peinado de pasarela.',
            price: 45,
            duration: 45,
            imageUrl: '/images/service_haircut.png',
            category: 'hair',
            steps: [
                'Diagnóstico personalizado de visagismo y morfología facial',
                'Lavado capilar orgánico con masaje craneal Kobido relajante',
                'Corte de precisión de autor a tijera y texturizado a navaja',
                'Styling térmico protector y peinado editorial con acabado pulido'
            ]
        },
        {
            name: 'Balayage Iluminación Suprema',
            description: 'Técnica artística a mano alzada para crear un degradado natural de luz y color tridimensional. Incluye matización premium y tratamiento protector Olaplex.',
            price: 120,
            duration: 180,
            imageUrl: '/images/service_balayage.png',
            category: 'hair',
            steps: [
                'Análisis cromático del cabello y prueba de elasticidad de la fibra',
                'Aplicación artística de aclaración Olaplex a mano alzada',
                'Matización con pigmentos orgánicos y barros botánicos',
                'Tratamiento de nutrición profunda y sellador ácido de cutícula'
            ]
        },
        {
            name: 'Ritual Facial Vitamina C Radiante',
            description: 'Tratamiento antioxidante intensivo que devuelve la luminosidad inmediata a tu piel. Incluye doble limpieza, exfoliación enzimática, mascarilla de vitamina C pura y masaje facial tensor.',
            price: 85,
            duration: 60,
            imageUrl: '/images/service_facial.png',
            category: 'spa',
            steps: [
                'Doble limpieza facial japonesa con bálsamos y espumas botánicas',
                'Exfoliación enzimática suave asistida por vapor de ozono',
                'Aplicación de mascarilla de vitamina C pura concentrada al 15%',
                'Masaje Kobido tensor facial con rodillos fríos de cuarzo rosa'
            ]
        },
        {
            name: 'Maquillaje Social & Glow Premium',
            description: 'Maquillaje profesional personalizado de larga duración. Perfecto para eventos o sesiones de fotos, utilizando productos icónicos de firmas de alta gama con efecto piel satinada.',
            price: 75,
            duration: 60,
            imageUrl: '/images/service_makeup.png',
            category: 'makeup',
            steps: [
                'Preparación intensiva de piel con brumas hidratantes y sérum de ácido hialurónico',
                'Estudio cromático adaptado a tus facciones, tono de ojos y outfit',
                'Aplicación impecable de base de alta definición y corrector perfeccionador',
                'Diseño de mirada tridimensional con pestañas individuales y fijador HD'
            ]
        },
        {
            name: 'Lifting de Pestañas & Diseño de Cejas',
            description: 'Tratamiento combinado para realzar tu mirada. Eleva e hidrata tus pestañas naturales de forma duradera, acompañado de un perfilado de cejas experto y tinte suave de henna.',
            price: 50,
            duration: 60,
            imageUrl: '/images/service_makeup.png',
            category: 'makeup',
            steps: [
                'Estudio de la mirada y arquitectura de cejas según proporción áurea',
                'Lifting y queratinización profunda de pestañas naturales',
                'Perfilado preciso de cejas con hilo de seda orgánico',
                'Tinte suave de henna orgánica para añadir densidad y definición natural'
            ]
        }
    ];
    for (const service of services) {
        await prisma.service.create({
            data: service,
        });
    }
    console.log('Nuevos servicios premium con categorías y pasos detallados agregados correctamente.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map