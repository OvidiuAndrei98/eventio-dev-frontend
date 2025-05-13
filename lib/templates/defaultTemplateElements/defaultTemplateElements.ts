import { ElementType } from '@/core/types';

export const defaultElements = {
  // >>>>>>>>>>SECTIONS<<<<<<<<<<<<<<<
  section: (elementName: string) => {
    return {
      id: `section-${crypto.randomUUID()}`, // Genereaza un ID unic
      type: ElementType.Section,
      name: elementName
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      elements: [],
      position: {},
      disabled: false,
      responsive: {},
      style: { height: 300 },
    };
  },
  'rsvp-section': (elementName: string) => {
    return {
      id: `section-${crypto.randomUUID()}`, // Genereaza un ID unic
      type: ElementType.RSVP_SECTION,
      name: elementName
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      elements: [
        {
          id: `element-${crypto.randomUUID()}`,
          name: 'RSVP',
          disabled: false,
          type: ElementType.RSVP_ELEMENT,
          position: { top: 0, left: 0, right: 0, bottom: 0 }, // Desktop: sub text link, centrat
          style: {
            fontSize: 16,
            color: '#ffffff',
            zIndex: 3,
          },
          responsive: {
            mobile: {
              // Pe mobil: font mai mic, poziție diferită, lățime mai mare, padding/border-radius scalate (din cauza styleScaleFactor)
              position: { top: 0, left: 0, right: 0, bottom: 0 }, // Poziție sub text link pe mobil
              style: { fontSize: 14 },
            },
            // Nu am adăugat display: none aici, dar ai putea dacă vrei să ascunzi link-ul pe mobil
          },
        },
      ],
      position: {},
      disabled: false,
      responsive: {},
      style: { height: 'auto', justifyContent: 'center' },
    };
  },
  // >>>>>>>>>>ELEMENTS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  text: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      type: ElementType.Text,
      name: elementName
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      position: {},
      content: 'text',
      disabled: false,
      responsive: {},
      style: {},
    };
  },
  image: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      type: ElementType.Image,
      name: elementName
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      position: {},
      content: 'text',
      disabled: false,
      responsive: {},
      style: {},
    };
  },
  rsvp: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      name: 'RSVP',
      disabled: false,
      type: ElementType.RSVP_ELEMENT,
      position: { top: 0, left: 0, right: 0, bottom: 0 }, // Desktop: sub text link, centrat
      style: {
        fontSize: 16,
        color: '#ffffff',
        zIndex: 3,
      },
      responsive: {
        mobile: {
          // Pe mobil: font mai mic, poziție diferită, lățime mai mare, padding/border-radius scalate (din cauza styleScaleFactor)
          position: { top: 0, left: 0, right: 0, bottom: 0 }, // Poziție sub text link pe mobil
          style: { fontSize: 14 },
        },
        // Nu am adăugat display: none aici, dar ai putea dacă vrei să ascunzi link-ul pe mobil
      },
    };
  },
};
