import { ElementType, ImageTemplateElement } from '@/core/types';

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
      position: {
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
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
          position: {}, // Desktop: sub text link, centrat
          style: {
            fontSize: 16,
            color: '#ffffff',
            zIndex: 3,
          },
          responsive: {},
        },
      ],
      position: {
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
      disabled: false,
      responsive: {},
      style: {
        height: 'auto',
        justifyContent: 'center',
      },
    };
  },
  'locations-section': (elementName: string) => {
    return {
      id: `section-${crypto.randomUUID()}`, // Genereaza un ID unic
      type: ElementType.LocationsSection,
      name: elementName
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      elements: [
        {
          id: `element-${crypto.randomUUID()}`,
          name: 'Locatii Eveniment',
          disabled: false,
          type: ElementType.locationsElement,
          position: {}, // Desktop: sub text link, centrat
          style: {},
          responsive: {},
        },
      ],
      position: {
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
      disabled: false,
      responsive: {},
      style: {
        height: 'auto',
        justifyContent: 'center',
      },
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
      position: {
        left: 40,
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
      content: 'text',
      disabled: false,
      responsive: {},
      style: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
      },
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
      position: {
        left: 40,
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
      borderStyles: {
        size: '1',
        color: '#1677ff',
        sides: 'none none none none',
      },
      disabled: false,
      responsive: {},
      backgroundImage: {
        name: 'placeholder-image',
        opacity: 'rgba(0,0,0,0)',
        url: '/placeholder-image.jpg',
      },
      style: {
        width: 100,
        height: 100,
        borderRadius: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },
    } as ImageTemplateElement;
  },
  rsvp: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      name: elementName.toUpperCase(),
      disabled: false,
      type: ElementType.RSVP_ELEMENT,
      position: {
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      }, // Desktop: sub text link, centrat
      style: {
        fontSize: 16,
        color: '#ffffff',
        zIndex: 3,
      },
      responsive: {
        mobile: {
          // Pe mobil: font mai mic, poziție diferită, lățime mai mare, padding/border-radius scalate (din cauza styleScaleFactor)
          position: {
            elementAlignment: 'auto' as
              | 'auto'
              | 'center'
              | 'self-start'
              | 'self-end',
          }, // Poziție sub text link pe mobil
          style: { fontSize: 14 },
        },
      },
    };
  },
  blob: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      name: elementName,
      disabled: false,
      blobName: 'blob_1',
      type: ElementType.Blob,
      position: {
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
      style: { width: 100 },
      responsive: {},
    };
  },
  container: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      name: elementName,
      disabled: false,
      type: ElementType.Container,
      borderStyles: {
        size: '1',
        color: '#1677ff',
        sides: 'none none none none',
      },
      position: {
        left: 40,
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      },
      style: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(2, 2, 2, 0.44)',
      },
      responsive: {},
    };
  },
  locations: (elementName: string) => {
    return {
      id: `element-${crypto.randomUUID()}`,
      name: elementName.toUpperCase(),
      disabled: false,
      type: ElementType.locationsElement,
      position: {
        elementAlignment: 'auto' as
          | 'auto'
          | 'center'
          | 'self-start'
          | 'self-end',
      }, // Desktop: sub text link, centrat
      style: { width: 100 },
      responsive: {},
    };
  },
};
