import { ElementType, Template } from '@/core/types'; // Asigură-te că tipurile sunt actualizate

// lib/defaultTemplates.js
export const defaultTemplates: Template[] = [
  {
    id: 'wedding-classic-floral-responsive-number',
    name: 'Invitație Nuntă Responsivă (Numere Procente)',
    type: 'wedding',
    description:
      'Un template clasic de nuntă cu poziționare în procente (numere) pentru responsivitate.',
    thumbnailUrl: '/thumbnails/classic-floral-responsive.jpg', // Placeholder
    settings: {
      backgroundColor: '#f9f5f0',
      // pageSize este eliminat
    },
    elements: [
      // Secțiunea de fundal (convertită la numere procente)
      {
        id: 'section-background',
        position: 'relative',
        style: {
          zIndex: 0,
        },
        elements: [
          {
            id: 'background-image',
            type: ElementType.Image,
            url: '/templates/classic-floral/background.jpg',
            position: { x: 0, y: 0 }, // Numere procente
            size: { width: 100, height: 100 }, // Numere procente
            style: {
              opacity: 0.7,
            },
          },
        ],
      },
      // Secțiunea principală de conținut (convertită la numere procente)
      {
        id: 'section-main-content',
        position: 'relative',
        style: {
          zIndex: 1,
        },
        elements: [
          // Elementele din secțiunea de conținut principal (convertite la numere procente)
          {
            id: 'header-text',
            type: ElementType.Text,
            content: 'Suntem încântați să vă invităm la',
            position: { x: 20, y: 3.64 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '20px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
            },
          },
          {
            id: 'main-title',
            type: ElementType.Text,
            content: 'Căsătoria',
            position: { x: 10, y: 10.91 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '48px', // Rămâne PX
              color: '#8b4513',
              textAlign: 'center',
              lineHeight: '1.4',
            },
          },
          {
            id: 'names-text',
            type: ElementType.Text,
            content: 'Maria Popescu\n& \nAndrei Ionescu',
            position: { x: 10, y: 23.64 }, // Numere procente
            style: {
              fontFamily: 'Great Vibes',
              fontSize: '40px', // Rămâne PX
              color: '#8b4513',
              textAlign: 'center',
              lineHeight: '1.4',
            },
          },
          {
            id: 'separator-line',
            type: ElementType.Text,
            content: '— ♦ —',
            position: { x: 40, y: 49.09 }, // Numere procente
            style: {
              fontFamily: 'Arial',
              fontSize: '18px', // Rămâne PX
              color: '#8b4513',
              textAlign: 'center',
            },
          },
          {
            id: 'event-date-time',
            type: ElementType.Text,
            content: 'Sâmbătă, 14 Septembrie 2024\nOra 16:00',
            position: { x: 20, y: 58.18 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '22px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
              lineHeight: '1.5',
            },
          },
          {
            id: 'event-location-heading',
            type: ElementType.Text,
            content: 'Locația:',
            position: { x: 20, y: 72.73 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '20px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
            },
          },
          {
            id: 'event-location-details',
            type: ElementType.Text,
            content:
              'Restaurant "La Castel"\nStr. Florilor, Nr. 10,\nOraș, Județ',
            position: { x: 20, y: 78.18 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '18px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
              lineHeight: '1.4',
            },
          },
        ],
      },
      // Secțiunea RSVP (convertită la numere procente)
      {
        id: 'section-rsvp',
        position: 'relative',
        style: {
          backgroundColor: '#f0e0d6',
          border: '1px solid #d3b8a8', // Rămâne PX
          borderRadius: '10px', // Rămâne PX
          zIndex: 2,
        },
        elements: [
          // Elementele din secțiunea RSVP (convertite la numere procente)
          {
            id: 'rsvp-heading',
            type: ElementType.Text,
            content: 'Vă rugăm să confirmați prezența',
            position: { x: 10, y: 11.76 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '20px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
            },
          },
          {
            id: 'rsvp-deadline',
            type: ElementType.Text,
            content: 'Termen limită: 1 August 2024',
            position: { x: 20, y: 32.35 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '18px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
            },
          },
          {
            id: 'rsvp-instructions',
            type: ElementType.Text,
            content: 'Confirmați online accesând link-ul:',
            position: { x: 20, y: 52.94 }, // Numere procente
            style: {
              fontFamily: 'Playfair Display',
              fontSize: '16px', // Rămâne PX
              color: '#5a2d2d',
              textAlign: 'center',
            },
          },
          {
            id: 'rsvp-link',
            type: ElementType.Text,
            content: '[Link către pagina de confirmare]',
            position: { x: 20, y: 67.65 }, // Numere procente
            style: {
              fontFamily: 'Arial',
              fontSize: '16px', // Rămâne PX
              color: '#0000ff',
              textDecoration: 'underline',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  },
];

export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.id === id);
};
