import { ElementType, Template } from '@/core/types';

export const defaultTemplates: Template[] = [
  {
    templateId: 'demo-template',
    eventId: 'demo-template',
    userId: 'demo-template',
    name: 'Demo Invitație Nuntă',
    type: 'wedding',
    description:
      'Un template demonstrativ care utilizează poziționare și stiluri specifice pe breakpoint-uri.',
    thumbnailUrl: '/thumbnails/thumbnail-1.jpg',
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
        position: { y: 0, x: 0 },
        type: ElementType.Section,
        responsive: {},
        disabled: false,
        elements: [
          {
            id: 'header-title',
            disabled: false,
            name: 'Text',
            type: ElementType.Text,
            content: 'Invitație la Căsătorie',
            position: { y: 50, x: 30, elementAlignment: 'auto' }, // Desky: Centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 36, // Număr (px intenție la 600px)
              color: '#4b3732', // Maro închis
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: aliniat stânga, font mai mic, lățime mai mare, poziție diferită
                position: { y: 30, x: 5, elementAlignment: 'auto' },
                style: {
                  fontSize: 24, // Font mai mic pe mobil
                  textAlign: 'left',
                },
              },
              tablet: {
                // Pe tabletă: font intermediar, poziție similară desky
                position: { y: 30, x: 50, elementAlignment: 'auto' },
                style: { fontSize: 30, textAlign: 'center' },
              },
            },
          },
          {
            id: 'header-slogan',
            disabled: false,
            name: 'Text',
            type: ElementType.Text,
            content: '"O nouă poveste începe..."',
            position: { y: 60, x: 50, elementAlignment: 'auto' }, // Desky: sub titlu, centrat
            style: {
              fontFamily: 'Great Vibes', // Font caligrafic
              fontSize: 24, // Număr
              color: '#7d665d', // Maro mediu
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { y: 5, x: 65, elementAlignment: 'auto' },
                style: { fontSize: 18, textAlign: 'left' },
              },
              tablet: {
                // Pe tabletă: font intermediar, poziție similară desky
                position: { y: 60, x: 50, elementAlignment: 'auto' },
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
        position: { y: 50, x: 30, elementAlignment: 'auto' },
        type: ElementType.Section,
        responsive: {},
        disabled: false,
        elements: [
          {
            id: 'main-names',
            disabled: false,
            name: 'Text',
            type: ElementType.Text,
            content: 'Andreea Popescu\nși\nIon Ionescu',
            position: { y: 15, x: 50, elementAlignment: 'auto' }, // Desky: centrat
            style: {
              fontFamily: 'Great Vibes',
              fontSize: 40, // Număr
              color: '#4b3732',
              textAlign: 'center',
              lineHeight: '1.3',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { y: 5, x: 5, elementAlignment: 'auto' }, // Poziție la începutul secțiunii pe mobil
                style: { fontSize: 30 },
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
            disabled: false,
            name: 'Text',
            content: '***',
            position: { y: 35, x: 50, elementAlignment: 'auto' }, // Desky: sub nume, centrat
            style: {
              fontFamily: 'Arial',
              fontSize: 18,
              color: '#7d665d',
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: sub nume, aliniat stânga, poziție diferită
                position: { y: 25, x: 5, elementAlignment: 'auto' }, // Poziție sub nume pe mobil
                style: { textAlign: 'left' },
              },
              tablet: {
                // Pe tabletă: similar desky
                position: { y: 35, x: 50, elementAlignment: 'auto' },
                style: { textAlign: 'center' },
              },
            },
          },
          {
            id: 'main-date-location',
            disabled: false,
            type: ElementType.Text,
            name: 'Text',
            content:
              'Sâmbătă, 21 Septembrie 2024\nOra 17:00\n\nRestaurant Panoramic\nStr. Speranței, Nr. 12\nOrașul Nostru',
            position: { y: 45, x: 50, elementAlignment: 'auto' }, // Desky: sub separator, centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 20,
              color: '#4b3732',
              textAlign: 'center',
              lineHeight: '1.6',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită (sub separator), aliniat stânga
                position: { y: 35, x: 5, elementAlignment: 'auto' }, // Poziție sub separator pe mobil
                style: { fontSize: 16 },
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
        name: 'Sectiune RSVP',
        disabled: false,
        type: ElementType.RSVP_SECTION,
        position: {},
        responsive: {},
        style: { height: 'auto', justifyContent: 'center' },
        elements: [
          {
            id: `element-${crypto.randomUUID()}`,
            name: 'RSVP',
            disabled: false,
            type: ElementType.RSVP_ELEMENT,
            position: { y: 0, x: 0, elementAlignment: 'auto' }, // Desky: sub text link, centrat
            style: {
              fontSize: 16,
              color: '#ffffff',
              zIndex: 3,
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, lățime mai mare, padding/border-radius scalate (din cauza styleScaleFactor)
                position: { y: 0, x: 0, elementAlignment: 'auto' }, // Poziție sub text link pe mobil
                style: { fontSize: 14 },
              },
              // Nu am adăugat display: none aici, dar ai putea dacă vrei să ascunzi link-ul pe mobil
            },
          },
        ],
      },
    ],
  },
];

export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.templateId === id);
};
