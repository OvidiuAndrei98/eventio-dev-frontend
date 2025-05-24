import { ElementType, Template } from '@/core/types';

export const defaultTemplates: Template[] = [
  {
    name: 'Demo Invitație Nuntă',
    elements: [
      {
        responsive: {},
        backgroundImage: {
          name: 'Elena-Doru_767.jpg',
          opacity: 'rgba(0,0,0,0.24)',
          url: '/demo_template_1/template_1_1.jpeg',
        },
        style: {
          height: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          zIndex: 2,
        },
        name: 'Header',
        type: ElementType.Section,
        elements: [
          {
            position: {
              elementAlignment: 'auto',
            },
            style: {
              color: '#aeaba0cf',
              width: 100,
            },
            name: 'Blob sus',
            disabled: false,
            id: 'element-dd1308b4-5632-46a3-b0e1-0784cfeeaa4b',
            type: ElementType.Blob,
            responsive: {
              mobile: {
                position: {
                  x: 0,
                  y: 0,
                  elementAlignment: 'auto',
                },
              },
            },
            blobName: 'blob_7',
          },
          {
            position: {
              elementAlignment: 'auto',
            },
            type: ElementType.Blob,
            style: {
              width: 100,
              color: '#aeaba078',
            },
            name: 'Blob jos',
            blobName: 'blob_3',
            id: 'element-e6c11664-84fa-429b-85c1-b4cb2cd96342',
            disabled: false,
            responsive: {
              mobile: {
                position: {
                  y: 79.5,
                  x: 0,
                  elementAlignment: 'auto',
                },
              },
            },
          },
          {
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            style: {
              height: 100,
              backgroundColor: '#a9876ea8',
              width: 100,
            },
            responsive: {
              mobile: {
                style: {
                  height: 100,
                  width: 150,
                  borderRadius: 15,
                },
                position: {
                  x: 82.3,
                  elementAlignment: 'center',
                  y: 53.5,
                },
              },
            },
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            type: ElementType.Container,
            name: 'Container',
            id: 'element-0a5f1e57-759e-476a-a524-16d393c9ec13',
            disabled: false,
          },
          {
            responsive: {
              mobile: {
                style: {
                  fontSize: 20,
                },
                position: {
                  elementAlignment: 'auto',
                  x: 11.8,
                  y: 42.5,
                },
              },
            },
            name: 'Nume mire',
            disabled: false,
            style: {
              color: '#ffffff',
            },
            content: 'Doru',
            type: ElementType.Text,
            id: 'element-3e4f52fa-df62-4772-b820-afb520cd1453',
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
          },
          {
            type: ElementType.Text,
            style: {
              color: '#ffffff',
            },
            name: 'Nume mireasa',
            responsive: {
              mobile: {
                style: {
                  fontSize: 20,
                },
                position: {
                  y: 42.5,
                  x: 73.5,
                  elementAlignment: 'auto',
                },
              },
            },
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            disabled: false,
            content: 'Elena',
            id: 'element-e6fe456e-4cb0-4d45-ad50-7a59aaf9d04e',
          },
          {
            style: {
              color: '#ffffff',
            },
            disabled: false,
            id: 'element-fac7a20d-8c55-468a-9083-0a1dafe43963',
            responsive: {
              mobile: {
                position: {
                  x: 44.9,
                  elementAlignment: 'center',
                  y: 53.5,
                },
              },
            },
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            type: ElementType.Text,
            content: 'Nașii',
            name: 'Nașii',
          },
          {
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            disabled: false,
            id: 'element-72ecd937-7d42-425b-bb79-f3af32e5c4dd',
            content: 'Narci și Andu',
            type: ElementType.Text,
            name: 'Nume nași',
            responsive: {
              mobile: {
                position: {
                  x: 45.1,
                  y: 59.8,
                  elementAlignment: 'center',
                },
              },
            },
            style: {
              color: '#ffffff',
            },
          },
          {
            type: ElementType.Text,
            style: {
              color: '#ffffff',
            },
            name: 'Când',
            content: '09 Septembrie 2025',
            id: 'element-c4714338-ad9e-4a7f-b5f4-db6429c5a8f2',
            responsive: {
              mobile: {
                position: {
                  y: 67,
                  x: 34.3,
                  elementAlignment: 'center',
                },
              },
            },
            disabled: false,
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
          },
        ],
        disabled: false,
        id: 'section-header',
        position: {
          y: 0,
          x: 0,
        },
      },
      {
        style: {
          zIndex: 1,
          backgroundColor: '#120b01f0',
          height: 300,
        },
        elements: [
          {
            style: {
              width: 100,
              height: 100,
              backgroundColor: '#b4b0b099',
            },
            type: ElementType.Container,
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            disabled: false,
            name: 'Container',
            id: 'element-e84a1cff-0a5f-4778-825e-de99da7c2790',
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            responsive: {
              mobile: {
                borderStyles: {
                  size: '2',
                  sides: 'dashed dashed dashed dashed',
                  color: '#000000',
                },
                position: {
                  x: 5.1,
                  elementAlignment: 'auto',
                  y: 54,
                },
                style: {
                  width: 290,
                  borderRadius: 10,
                  height: 130,
                },
              },
            },
          },
          {
            disabled: false,
            name: 'Container',
            style: {
              width: 100,
              backgroundColor: '#b4b0b099',
              height: 100,
            },
            id: 'element-1ec2d9b9-09e2-41fa-84ff-ba2efd84624c',
            responsive: {
              mobile: {
                borderStyles: {
                  color: '#0e0e0e',
                  sides: 'dashed dashed dashed dashed',
                  size: '2',
                },
                style: {
                  borderRadius: 10,
                  width: 290,
                  height: 130,
                },
                position: {
                  elementAlignment: 'auto',
                  x: 16.9,
                  y: 3,
                },
              },
            },
            type: ElementType.Container,
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
          },
          {
            content: 'O zi specială, un moment unic, o invitație din suflet.',
            responsive: {
              mobile: {
                style: {
                  fontSize: 12,
                },
                position: {
                  x: 6,
                  y: 60.3,
                  elementAlignment: 'auto',
                },
              },
            },
            type: ElementType.Text,
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            name: 'Mesaj',
            style: {
              color: '#ffffff',
            },
            id: 'element-d4f1a364-8283-4fd2-9fa6-0a8e4f99ebf4',
            disabled: true,
          },
          {
            content:
              'Vă așteptăm să ne fiți alături la începutul călătoriei noastre împreună',
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            responsive: {
              mobile: {
                style: {
                  fontSize: 12,
                },
                position: {
                  y: 9.7,
                  elementAlignment: 'auto',
                  x: 22.6,
                },
              },
            },
            style: {
              color: '#ffffff',
            },
            id: 'element-1c023bc2-5d22-482a-8f24-b3176f4c8a8f',
            disabled: true,
            type: ElementType.Text,
            name: 'Mesaj',
          },
          {
            id: 'element-77464651-1662-4856-8c6a-840d91610651',
            type: ElementType.Image,
            style: {
              width: 100,
              backgroundSize: 'cover',
              height: 100,
              backgroundRepeat: 'no-repeat',
              borderRadius: 0,
            },
            name: 'Poza mireasa',
            backgroundImage: {
              url: '/demo_template_1/template_1_2.jpeg',
              opacity: 'rgba(0,0,0,0.15)',
              name: 'Elena-Doru_207.jpg',
            },
            disabled: false,
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            responsive: {
              mobile: {
                position: {
                  x: 0.5,
                  y: 2.3,
                  elementAlignment: 'auto',
                },
                style: {
                  borderRadius: 50,
                  width: 130,
                  height: 130,
                },
              },
            },
          },
          {
            backgroundImage: {
              name: 'Elena-Doru_764.jpg',
              opacity: 'rgba(0,0,0,0.15)',
              url: '/demo_template_1/template_1_3.jpeg',
            },
            responsive: {
              mobile: {
                position: {
                  y: 53.7,
                  elementAlignment: 'auto',
                  x: 63.8,
                },
                style: {
                  borderRadius: 50,
                  width: 130,
                  height: 130,
                },
              },
            },
            id: 'element-91dacb85-7278-4efa-8e7f-7e417eba7431',
            style: {
              width: 100,
              borderRadius: 0,
              backgroundSize: 'cover',
              height: 100,
              backgroundRepeat: 'no-repeat',
            },
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            disabled: false,
            name: 'Poza mire',
            type: ElementType.Image,
          },
        ],
        disabled: false,
        backgroundImage: {
          url: '/demo_template_1/template_1_4.png',
          name: 'Elena-Doru_122(1).png',
          opacity: 'rgba(32,28,28,0.21)',
        },
        name: 'Detalii eveniment',
        type: ElementType.Section,
        position: {
          x: 30,
          elementAlignment: 'auto',
          y: 50,
        },
        responsive: {},
        id: 'section-main-details',
      },
      {
        type: ElementType.Section,
        name: 'Sectiune',
        style: {
          backgroundColor: '#ffffff',
          height: 300,
        },
        responsive: {},
        position: {},
        elements: [
          {
            name: 'Blob',
            disabled: false,
            position: {
              elementAlignment: 'auto',
            },
            style: {
              width: 100,
            },
            type: ElementType.Blob,
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'auto',
                  y: 72.9,
                  x: 0,
                },
              },
            },
            id: 'element-38c55d58-8ea6-4744-bbfe-37f5d7d14e45',
            blobName: 'blob_3',
          },
          {
            blobName: 'blob_5',
            id: 'element-5bd27ebf-3c73-47c2-a4f3-f789b7b81f50',
            disabled: false,
            responsive: {
              mobile: {
                position: {
                  y: 0,
                  elementAlignment: 'auto',
                  x: 0,
                },
              },
            },
            type: ElementType.Blob,
            style: {
              width: 100,
            },
            position: {
              elementAlignment: 'auto',
            },
            name: 'Blob',
          },
          {
            type: ElementType.Image,
            disabled: false,
            name: 'LOGO Cununia civilă',
            style: {
              width: 100,
              borderRadius: 0,
              backgroundSize: 'cover',
              height: 100,
              backgroundRepeat: 'no-repeat',
            },
            responsive: {
              mobile: {
                style: {
                  width: 100,
                  borderRadius: 50,
                  height: 100,
                },
                position: {
                  y: 22,
                  elementAlignment: 'self-start',
                  x: 36.2,
                },
              },
            },
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            id: 'element-09b595a1-fece-4269-954d-18e32c42ea03',
            backgroundImage: {
              opacity: 'rgba(0,0,0,0)',
              url: '/demo_template_1/template_1_5.png',
              name: 'Wedding arch.png',
            },
          },
          {
            disabled: false,
            style: {},
            id: 'element-ea937ab5-d0ab-4d2b-9033-65a939cc3348',
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
            responsive: {
              mobile: {
                style: {
                  fontSize: 12,
                },
                position: {
                  elementAlignment: 'auto',
                  x: 4.4,
                  y: 55,
                },
              },
            },
            type: ElementType.Text,
            name: 'Cununia civilă',
            content: 'Cununia civilă',
          },
          {
            disabled: false,
            backgroundImage: {
              name: 'Church (1).png',
              url: '/demo_template_1/template_1_6.png',
              opacity: 'rgba(0,0,0,0)',
            },
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            type: ElementType.Image,
            name: 'LOGO Cununia religioasă',
            style: {
              borderRadius: 0,
              height: 100,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              width: 100,
            },
            responsive: {
              mobile: {
                style: {
                  borderRadius: 50,
                },
                position: {
                  elementAlignment: 'center',
                  x: 5.4,
                  y: 22,
                },
              },
            },
            id: 'element-778b8c6b-45ec-4b0b-b0fd-b5a735185b00',
          },
          {
            disabled: false,
            style: {},
            type: ElementType.Text,
            content: 'Cununia religioasă',
            id: 'element-0296f46d-ef1a-4e6e-9922-f843549eaae6',
            responsive: {
              mobile: {
                position: {
                  y: 55.7,
                  x: 34.9,
                  elementAlignment: 'auto',
                },
                style: {
                  fontSize: 12,
                },
              },
            },
            name: 'Cununia religioasă',
            position: {
              elementAlignment: 'auto',
              x: 40,
            },
          },
          {
            backgroundImage: {
              url: '/demo_template_1/template_1_7.png',
              opacity: 'rgba(0,0,0,0)',
              name: 'Champagne.png',
            },
            style: {
              backgroundSize: 'cover',
              width: 100,
              borderRadius: 0,
              backgroundRepeat: 'no-repeat',
              height: 100,
            },
            name: 'LOGO Petrecerea',
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            type: ElementType.Image,
            responsive: {
              mobile: {
                position: {
                  x: 72.9,
                  elementAlignment: 'self-end',
                  y: 22,
                },
                style: {
                  borderRadius: 50,
                },
              },
            },
            disabled: false,
            id: 'element-6c6009f3-ba05-4e61-a4f4-aeee99a8fbf5',
          },
          {
            position: {
              x: 40,
              elementAlignment: 'auto',
            },
            responsive: {
              mobile: {
                position: {
                  x: 74.7,
                  y: 56,
                  elementAlignment: 'auto',
                },
                style: {
                  fontSize: 12,
                },
              },
            },
            type: ElementType.Text,
            style: {},
            id: 'element-515edda4-d779-47db-8a85-727d24529d33',
            content: 'Petrecerea',
            name: 'Petrecerea',
            disabled: false,
          },
        ],
        id: 'section-c07485ca-b854-435d-b8f4-56dee3c11c44',
        disabled: false,
      },
      {
        responsive: {},
        disabled: false,
        name: 'Sectiune RSVP',
        position: {},
        type: ElementType.RSVP_SECTION,
        id: 'section-rsvp',
        elements: [
          {
            disabled: false,
            responsive: {
              mobile: {
                style: {
                  fontSize: 14,
                },
                position: {
                  y: 0,
                  x: 0,
                  elementAlignment: 'auto',
                },
              },
            },
            type: ElementType.RSVP_ELEMENT,
            id: 'element-75610eef-09c9-47d2-80b7-78f361408bc7',
            position: {
              x: 0,
              elementAlignment: 'auto',
              y: 0,
            },
            name: 'RSVP',
            style: {
              zIndex: 3,
              fontSize: 16,
              color: '#ffffff',
            },
          },
        ],
        style: {
          height: 'auto',
          justifyContent: 'center',
        },
      },
    ],
    settings: {
      backgroundColor: '#f8f0e8',
    },
    description:
      'Un template demonstrativ care utilizează poziționare și stiluri specifice pe breakpoint-uri.',
    templateId: 'demo-template-1',
    thumbnailUrl: '/thumbnails/thumbnail-1.jpg',
    type: 'wedding',
    userId: 'demo-template-1',
    eventId: 'demo-template-1',
  },
];

export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.templateId === id);
};
