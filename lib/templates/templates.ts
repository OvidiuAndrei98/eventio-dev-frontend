import { ElementType, Template } from '@/core/types'; // Asigură-te că tipurile sunt actualizate

// lib/defaultTemplates.js
export const defaultTemplates: Template[] = [
  {
    id: 'wedding-responsive-demo',
    name: 'Demo Invitație Nuntă Responsivă',
    type: 'wedding',
    description:
      'Un template demonstrativ care utilizează poziționare și stiluri specifice pe breakpoint-uri.',
    thumbnailUrl: '/thumbnails/responsive-demo.jpg', // Placeholder
    settings: {
      backgroundColor: '#f8f0e8', // Un crem delicat
    },
    elements: [
      {
        id: 'section-header',
        name: 'Header',
        style: {
          zIndex: 2, // Deasupra fundalului, sub secțiunile principale
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fundal semi-transparent
          height: 300,
        },
        position: { x: 0, y: 0 },
        type: ElementType.Section,
        responsive: {},
        elements: [
          {
            id: 'header-title',
            name: 'Text',
            type: ElementType.Text,
            content: 'Invitație la Căsătorie',
            position: { x: 50, y: 30 }, // Desktop: Centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 36, // Număr (px intenție la 600px)
              color: '#4b3732', // Maro închis
              textAlign: 'center',
              width: 80, // Lățime 80% din secțiunea părinte
            },
            responsive: {
              mobile: {
                // Pe mobil: aliniat stânga, font mai mic, lățime mai mare, poziție diferită
                position: { x: 5, y: 35 },
                style: {
                  fontSize: 24, // Font mai mic pe mobil
                  textAlign: 'left',
                  width: 90,
                },
              },
              tablet: {
                // Pe tabletă: font intermediar, poziție similară desktop
                position: { x: 50, y: 30 },
                style: { fontSize: 30, textAlign: 'center' },
              },
            },
          },
          {
            id: 'header-slogan',
            name: 'Text',
            type: ElementType.Text,
            content: '"O nouă poveste începe..."',
            position: { x: 50, y: 60 }, // Desktop: sub titlu, centrat
            style: {
              fontFamily: 'Great Vibes', // Font caligrafic
              fontSize: 24, // Număr
              color: '#7d665d', // Maro mediu
              textAlign: 'center',
              width: 70,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { x: 5, y: 65 },
                style: { fontSize: 18, textAlign: 'left' },
              },
              tablet: {
                // Pe tabletă: font intermediar, poziție similară desktop
                position: { x: 50, y: 60 },
                style: { fontSize: 20, textAlign: 'center' },
              },
            },
          },
        ],
      },

      // --- Secțiunea Detalii Principale (Nume, Data, Locația) ---
      {
        id: 'section-main-details',
        style: { zIndex: 1, height: 300 }, // Sub antet, peste fundal
        name: 'Detalii eveniment',
        position: { x: 0, y: 0 },
        type: ElementType.Section,
        responsive: {},
        elements: [
          {
            id: 'main-names',
            name: 'Text',
            type: ElementType.Text,
            content: 'Andreea Popescu\nși\nIon Ionescu',
            position: { x: 50, y: 15 }, // Desktop: centrat
            style: {
              fontFamily: 'Great Vibes',
              fontSize: 40, // Număr
              color: '#4b3732',
              textAlign: 'center',
              lineHeight: '1.3',
              width: 70,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { x: 5, y: 5 }, // Poziție la începutul secțiunii pe mobil
                style: { fontSize: 30, textAlign: 'left', width: 90 },
              },
              tablet: {
                // Pe tabletă: font intermediar
                style: { fontSize: 35 },
              },
            },
          },
          {
            id: 'main-separator',
            type: ElementType.Text,
            name: 'Text',
            content: '***',
            position: { x: 50, y: 35 }, // Desktop: sub nume, centrat
            style: {
              fontFamily: 'Arial',
              fontSize: 18,
              color: '#7d665d',
              textAlign: 'center',
              width: 20,
            },
            responsive: {
              mobile: {
                // Pe mobil: sub nume, aliniat stânga, poziție diferită
                position: { x: 5, y: 25 }, // Poziție sub nume pe mobil
                style: { textAlign: 'left' },
              },
              tablet: {
                // Pe tabletă: similar desktop
                position: { x: 50, y: 35 },
                style: { textAlign: 'center' },
              },
            },
          },
          {
            id: 'main-date-location',
            type: ElementType.Text,
            name: 'Text',
            content:
              'Sâmbătă, 21 Septembrie 2024\nOra 17:00\n\nRestaurant Panoramic\nStr. Speranței, Nr. 12\nOrașul Nostru',
            position: { x: 50, y: 45 }, // Desktop: sub separator, centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 20,
              color: '#4b3732',
              textAlign: 'center',
              lineHeight: '1.6',
              width: 80,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită (sub separator), aliniat stânga
                position: { x: 5, y: 35 }, // Poziție sub separator pe mobil
                style: { fontSize: 16, textAlign: 'left', width: 90 },
              },
              tablet: {
                // Pe tabletă: font intermediar
                style: { fontSize: 18 },
              },
            },
          },
        ],
      },

      // --- Secțiunea RSVP ---
      {
        id: 'section-rsvp',
        name: 'RSVP Section',
        position: { x: 0, y: 0 },
        type: ElementType.Section,
        responsive: {},
        style: {
          zIndex: 1,
          backgroundColor: 'rgba(240, 230, 224, 0.7)', // Fundal semi-transparent crem
          height: 300,
        },
        elements: [
          {
            id: 'rsvp-heading',
            type: ElementType.Text,
            name: 'Text',
            content: 'Vă rugăm să confirmați prezența',
            position: { x: 50, y: 15 }, // Desktop: centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 20, // Număr
              color: '#4b3732',
              textAlign: 'center',
              width: 80,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { x: 5, y: 10 },
                style: { fontSize: 16, textAlign: 'left', width: 90 },
              },
            },
          },
          {
            id: 'rsvp-deadline',
            type: ElementType.Text,
            name: 'Text',
            content: 'Termen limită: 1 August 2024',
            position: { x: 50, y: 40 }, // Desktop: sub antet, centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 18, // Număr
              color: '#7d665d',
              textAlign: 'center',
              width: 60,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { x: 5, y: 30 },
                style: { fontSize: 14, textAlign: 'left', width: 90 },
              },
            },
          },
          {
            id: 'rsvp-link-text',
            type: ElementType.Text,
            name: 'Text',
            content: 'Confirmați aici:',
            position: { x: 50, y: 60 }, // Desktop: sub termen, centrat
            style: {
              fontFamily: 'Arial',
              fontSize: 16, // Număr
              color: '#4b3732',
              textAlign: 'center',
              width: 50,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { x: 5, y: 50 },
                style: { fontSize: 12, textAlign: 'left', width: 90 },
              },
            },
          },
          {
            id: 'rsvp-link-button',
            name: 'Text',
            type: ElementType.Text, // Folosim text ca și cum ar fi un buton
            content: '[Pagina Confirmare]',
            position: { x: 50, y: 75 }, // Desktop: sub text link, centrat
            style: {
              fontFamily: 'Arial',
              fontSize: 16, // Număr
              color: '#ffffff', // Text alb
              backgroundColor: '#a0522d', // Fundal maro arămiu
              padding: '8px 15px', // Padding în pixeli (va fi scalat)
              borderRadius: '5px', // Border radius în pixeli (va fi scalat)
              textAlign: 'center',
              width: 40,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, lățime mai mare, padding/border-radius scalate (din cauza styleScaleFactor)
                position: { x: 5, y: 65 }, // Poziție sub text link pe mobil
                style: { fontSize: 14, width: 90 }, // Lățime mai mare pe mobil
              },
              // Nu am adăugat display: none aici, dar ai putea dacă vrei să ascunzi link-ul pe mobil
            },
          },
        ],
      },

      // Poți adăuga alte secțiuni aici
    ],
  },
];

export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.id === id);
};
