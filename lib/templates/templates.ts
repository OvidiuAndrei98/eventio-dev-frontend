import { ElementType, Template } from '@/core/types'; // Asigură-te că tipurile sunt actualizate

// lib/defaultTemplates.js
export const defaultTemplates: Template[] = [
  {
    templateId: 'wedding-responsive-demo',
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
        position: { top: 0, left: 0, right: 0, bottom: 0 },
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
            position: { top: 50, left: 30, right: 0, bottom: 0 }, // Desktop: Centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 36, // Număr (px intenție la 600px)
              color: '#4b3732', // Maro închis
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: aliniat stânga, font mai mic, lățime mai mare, poziție diferită
                position: { top: 30, left: 5, right: 0, bottom: 0 },
                style: {
                  fontSize: 24, // Font mai mic pe mobil
                  textAlign: 'left',
                },
              },
              tablet: {
                // Pe tabletă: font intermediar, poziție similară desktop
                position: { top: 30, left: 50, right: 0, bottom: 0 },
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
            position: { top: 60, left: 50, right: 0, bottom: 0 }, // Desktop: sub titlu, centrat
            style: {
              fontFamily: 'Great Vibes', // Font caligrafic
              fontSize: 24, // Număr
              color: '#7d665d', // Maro mediu
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { top: 5, left: 65, right: 0, bottom: 0 },
                style: { fontSize: 18, textAlign: 'left' },
              },
              tablet: {
                // Pe tabletă: font intermediar, poziție similară desktop
                position: { top: 60, left: 50, right: 0, bottom: 0 },
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
        position: { top: 50, left: 30, right: 0, bottom: 0 },
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
            position: { top: 15, left: 50, right: 0, bottom: 0 }, // Desktop: centrat
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
                position: { top: 5, left: 5, right: 0, bottom: 0 }, // Poziție la începutul secțiunii pe mobil
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
            position: { top: 35, left: 50, right: 0, bottom: 0 }, // Desktop: sub nume, centrat
            style: {
              fontFamily: 'Arial',
              fontSize: 18,
              color: '#7d665d',
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: sub nume, aliniat stânga, poziție diferită
                position: { top: 25, left: 5, right: 0, bottom: 0 }, // Poziție sub nume pe mobil
                style: { textAlign: 'left' },
              },
              tablet: {
                // Pe tabletă: similar desktop
                position: { top: 35, left: 50, right: 0, bottom: 0 },
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
            position: { top: 45, left: 50, right: 0, bottom: 0 }, // Desktop: sub separator, centrat
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
                position: { top: 35, left: 5, right: 0, bottom: 0 }, // Poziție sub separator pe mobil
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
        name: 'RSVP Section',
        position: { top: 50, left: 30, right: 0, bottom: 0 },
        type: ElementType.Section,
        responsive: {},
        disabled: false,
        style: {
          zIndex: 1,
          backgroundColor: 'rgba(240, 230, 224, 0.7)', // Fundal semi-transparent crem
          height: 300,
        },
        elements: [
          {
            id: 'rsvp-heading',
            disabled: false,
            type: ElementType.Text,
            name: 'Text',
            content: 'Vă rugăm să confirmați prezența',
            position: { top: 15, left: 50, right: 0, bottom: 0 }, // Desktop: centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 20, // Număr
              color: '#4b3732',
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { top: 10, left: 5, right: 0, bottom: 0 },
                style: { fontSize: 16 },
              },
            },
          },
          {
            id: 'rsvp-deadline',
            type: ElementType.Text,
            name: 'Text',
            disabled: false,
            content: 'Termen limită: 1 August 2024',
            position: { top: 40, left: 50, right: 0, bottom: 0 }, // Desktop: sub antet, centrat
            style: {
              fontFamily: 'Playfair Display',
              fontSize: 18, // Număr
              color: '#7d665d',
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { top: 30, left: 5, right: 0, bottom: 0 },
                style: { fontSize: 14 },
              },
            },
          },
          {
            id: 'rsvp-link-text',
            type: ElementType.Text,
            name: 'Text',
            content: 'Confirmați aici:',
            disabled: false,
            position: { top: 60, left: 50, right: 0, bottom: 0 }, // Desktop: sub termen, centrat
            style: {
              fontFamily: 'Arial',

              fontSize: 16, // Număr
              color: '#4b3732',
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, aliniat stânga
                position: { top: 50, left: 5, right: 0, bottom: 0 },
                style: { fontSize: 12 },
              },
            },
          },
          {
            id: 'rsvp-link-button',
            name: 'Text',
            disabled: false,
            type: ElementType.Text, // Folosim text ca și cum ar fi un buton
            content: '[Pagina Confirmare]',
            position: { top: 75, left: 50, right: 0, bottom: 0 }, // Desktop: sub text link, centrat
            style: {
              fontFamily: 'Arial',
              fontSize: 16, // Număr
              color: '#ffffff', // Text alb
              backgroundColor: '#a0522d', // Fundal maro arămiu
              padding: '8px 15px', // Padding în pixeli (va fi scalat)
              borderRadius: '5px', // Border radius în pixeli (va fi scalat)
              textAlign: 'center',
            },
            responsive: {
              mobile: {
                // Pe mobil: font mai mic, poziție diferită, lățime mai mare, padding/border-radius scalate (din cauza styleScaleFactor)
                position: { top: 65, left: 5, right: 0, bottom: 0 }, // Poziție sub text link pe mobil
                style: { fontSize: 14 },
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
  return defaultTemplates.find((template) => template.templateId === id);
};
