import { ElementType, Template } from '@/core/types';

export const defaultTemplates: Template[] = [
  {
    thumbnailUrl: '/thumbnails/thumbnail-1.jpg',
    elements: [
      {
        type: ElementType.Section,
        disabled: false,
        style: {
          zIndex: 2,
          height: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
        backgroundImage: {
          opacity: 'rgba(0,0,0,0.24)',
          name: 'Elena-Doru_767.jpg',
          url: '/demo_template_1/template_1_1.jpeg',
        },
        name: 'Header',
        elements: [
          {
            disabled: false,
            blobName: 'blob_7',
            position: {
              left: 0,
              top: 0,
              elementAlignment: 'auto',
            },
            responsive: {
              mobile: {
                position: {
                  top: 0,
                  elementAlignment: 'auto',
                  left: 0,
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'auto',
                  top: 0,
                  left: 0,
                },
              },
            },
            type: ElementType.Blob,
            name: 'Blob sus',
            style: {
              width: 100,
              color: '#aeaba0cf',
            },
            id: 'element-dd1308b4-5632-46a3-b0e1-0784cfeeaa4b',
          },
          {
            blobName: 'blob_3',
            id: 'element-e6c11664-84fa-429b-85c1-b4cb2cd96342',
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'auto',
                  bottom: 0,
                  left: 0,
                },
              },
              tablet: {
                position: {
                  bottom: 0,
                  elementAlignment: 'auto',
                  left: 0,
                },
              },
            },
            position: {
              bottom: 0,
              elementAlignment: 'auto',
              left: 0,
            },
            type: ElementType.Blob,
            name: 'Blob jos',
            style: {
              width: 100,
              color: '#acacacc2',
            },
            disabled: false,
          },
          {
            type: ElementType.Container,
            position: {
              elementAlignment: 'auto',
              top: 36,
              left: 41.7,
            },
            name: 'Container',
            style: {
              width: 20,
              backgroundColor: '#a9876ea8',
              height: 100,
            },
            responsive: {
              mobile: {
                position: {
                  left: 28.39,
                  top: 52.36,
                  elementAlignment: 'center',
                },
                style: {
                  height: 100,
                  width: 45,
                  borderRadius: 15,
                },
              },
              tablet: {
                style: {
                  width: 40,
                  borderRadius: 10,
                  height: 200,
                },
                position: {
                  elementAlignment: 'center',
                  left: 27.52,
                  top: 35.86,
                },
              },
            },
            borderStyles: {
              sides: 'none none none none',
              size: '1',
              color: '#1677ff',
            },
            id: 'element-0a5f1e57-759e-476a-a524-16d393c9ec13',
            disabled: false,
          },
          {
            content: 'Doru',
            id: 'element-3e4f52fa-df62-4772-b820-afb520cd1453',
            type: ElementType.Text,
            style: {
              fontWeight: '500',
              color: '#ffffff',
            },
            responsive: {
              tablet: {
                style: {
                  fontSize: 24,
                  fontWeight: '700',
                },
                position: {
                  top: 17.29,
                  left: 76.57,
                  elementAlignment: 'auto',
                },
              },
              mobile: {
                style: {
                  fontSize: 20,
                },
                position: {
                  left: 11.76,
                  top: 30.34,
                  elementAlignment: 'auto',
                },
              },
            },
            disabled: false,
            name: 'Nume mire',
            position: {
              elementAlignment: 'auto',
              left: 40,
            },
          },
          {
            id: 'element-e6fe456e-4cb0-4d45-ad50-7a59aaf9d04e',
            type: ElementType.Text,
            disabled: false,
            name: 'Nume mireasa',
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'auto',
                  left: 70.14,
                  top: 29.36,
                },
                style: {
                  fontSize: 20,
                },
              },
              tablet: {
                style: {
                  fontWeight: '700',
                  fontSize: 24,
                },
                position: {
                  left: 11.81,
                  top: 18.27,
                  elementAlignment: 'auto',
                },
              },
            },
            content: 'Elena',
            position: {
              left: 40,
              elementAlignment: 'auto',
            },
            style: {
              fontWeight: '500',
              color: '#ffffff',
            },
          },
          {
            type: ElementType.Text,
            content: 'Nașii',
            id: 'element-fac7a20d-8c55-468a-9083-0a1dafe43963',
            style: {
              fontWeight: '500',
              color: '#ffffff',
            },
            position: {
              left: 40,
              elementAlignment: 'auto',
            },
            responsive: {
              mobile: {
                position: {
                  top: 52.18,
                  elementAlignment: 'center',
                  left: 41.98,
                },
              },
              tablet: {
                position: {
                  left: 44.39,
                  top: 37.5,
                  elementAlignment: 'center',
                },
                style: {
                  fontSize: 18,
                },
              },
            },
            name: 'Nașii',
            disabled: false,
          },
          {
            content: 'Narci și Andu',
            position: {
              elementAlignment: 'auto',
              left: 40,
            },
            responsive: {
              tablet: {
                style: {
                  fontSize: 18,
                },
                position: {
                  left: 38.42,
                  top: 51,
                  elementAlignment: 'center',
                },
              },
              mobile: {
                position: {
                  left: 33.47,
                  elementAlignment: 'center',
                  top: 59.92,
                },
              },
            },
            disabled: false,
            type: ElementType.Text,
            style: {
              color: '#ffffff',
              fontWeight: '500',
            },
            name: 'Nume nași',
            id: 'element-72ecd937-7d42-425b-bb79-f3af32e5c4dd',
          },
          {
            name: 'Când',
            position: {
              elementAlignment: 'auto',
              left: 40,
            },
            responsive: {
              mobile: {
                position: {
                  left: 26.29,
                  top: 67.58,
                  elementAlignment: 'center',
                },
              },
              tablet: {
                position: {
                  top: 66.25,
                  elementAlignment: 'center',
                  left: 33.37,
                },
                style: {
                  fontSize: 18,
                },
              },
            },
            disabled: false,
            content: '09 Septembrie 2025',
            style: {
              fontWeight: '500',
              color: '#ffffff',
            },
            id: 'element-c4714338-ad9e-4a7f-b5f4-db6429c5a8f2',
            type: ElementType.Text,
          },
        ],
        id: 'section-header',
        position: {
          elementAlignment: 'auto',
          left: 0,
        },
        responsive: {},
      },
      {
        id: 'section-main-details',
        name: 'Detalii eveniment',
        elements: [
          {
            blobName: 'blob_8',
            position: {
              left: 0,
              bottom: 0,
              elementAlignment: 'auto',
            },
            name: ElementType.Blob,
            style: {
              color: '#edd850',
              width: 100,
            },
            type: ElementType.Blob,
            id: 'element-c350313a-21ca-45d3-b18c-516ce11c4ee4',
            responsive: {
              tablet: {
                position: {
                  left: 0,
                  elementAlignment: 'auto',
                  bottom: 0,
                },
              },
              mobile: {
                position: {
                  bottom: 0,
                  elementAlignment: 'auto',
                  left: 0,
                },
              },
            },
            disabled: false,
          },
          {
            name: 'Container',
            id: 'element-e84a1cff-0a5f-4778-825e-de99da7c2790',
            borderStyles: {
              size: '1',
              color: '#000000',
              sides: 'dashed dashed dashed dashed',
            },
            position: {
              bottom: 3.35,
              elementAlignment: 'auto',
              right: 11.91,
            },
            style: {
              backgroundColor: '#dfdddd33',
              borderRadius: 10,
              width: 70,
              height: 245,
            },
            disabled: false,
            type: ElementType.Container,
            responsive: {
              mobile: {
                style: {
                  width: 73,
                  borderRadius: 10,
                  height: 127,
                },
                borderStyles: {
                  size: '2',
                  color: '#000000',
                  sides: 'dashed dashed dashed dashed',
                },
                position: {
                  top: 7.55,
                  elementAlignment: 'auto',
                  left: 14.68,
                },
              },
              tablet: {
                style: {
                  borderRadius: 10,
                  height: 146,
                  width: 45,
                },
                position: {
                  top: 10.05,
                  elementAlignment: 'auto',
                  left: 9.49,
                },
                borderStyles: {
                  sides: 'dashed dashed dashed dashed',
                  color: '#000000',
                  size: '1',
                },
              },
            },
          },
          {
            name: 'Container',
            position: {
              left: 10.73,
              top: 3.99,
              elementAlignment: 'auto',
            },
            disabled: false,
            id: 'element-1ec2d9b9-09e2-41fa-84ff-ba2efd84624c',
            responsive: {
              tablet: {
                style: {
                  width: 45,
                  height: 145,
                  borderRadius: 10,
                },
                position: {
                  right: 8.98,
                  elementAlignment: 'auto',
                  bottom: 5.95,
                },
                borderStyles: {
                  size: '1',
                  color: '#000000',
                  sides: 'dashed dashed dashed dashed',
                },
              },
              mobile: {
                style: {
                  height: 127,
                  borderRadius: 10,
                  width: 73,
                },
                borderStyles: {
                  size: '2',
                  sides: 'dashed dashed dashed dashed',
                  color: '#0e0e0e',
                },
                position: {
                  left: 8.74,
                  bottom: 5.07,
                  elementAlignment: 'auto',
                },
              },
            },
            type: ElementType.Container,
            style: {
              borderRadius: 10,
              backgroundColor: '#dfdddd24',
              height: 245,
              width: 70,
            },
            borderStyles: {
              color: '#000000',
              sides: 'dashed dashed dashed dashed',
              size: '1',
            },
          },
          {
            disabled: false,
            position: {
              top: 2.8,
              elementAlignment: 'auto',
              left: 1.47,
            },
            id: 'element-91dacb85-7278-4efa-8e7f-7e417eba7431',
            backgroundImage: {
              url: '/demo_template_1/template_1_3.jpeg',
              opacity: 'rgba(0,0,0,0.15)',
              name: 'Elena-Doru_764.jpg',
            },
            name: 'Poza mire',
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            style: {
              backgroundRepeat: 'no-repeat',
              width: 250,
              borderRadius: 50,
              backgroundSize: 'cover',
              height: 250,
            },
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'auto',
                  bottom: 3.71,
                  right: 0,
                },
                style: {
                  width: 130,
                  height: 130,
                  borderRadius: 50,
                },
              },
              tablet: {
                style: {
                  height: 150,
                  borderRadius: 50,
                  width: 150,
                },
                position: {
                  left: 1.09,
                  top: 8.94,
                  elementAlignment: 'auto',
                },
              },
            },
            type: ElementType.Image,
          },
          {
            responsive: {
              mobile: {
                position: {
                  left: 2.29,
                  top: 6.81,
                  elementAlignment: 'auto',
                },
                style: {
                  height: 130,
                  borderRadius: 50,
                  width: 130,
                },
              },
              tablet: {
                position: {
                  bottom: 5.39,
                  right: 1.4,
                  elementAlignment: 'auto',
                },
                style: {
                  width: 150,
                  borderRadius: 50,
                  height: 150,
                },
              },
            },
            type: ElementType.Image,
            position: {
              right: 1.91,
              elementAlignment: 'auto',
              bottom: 2.79,
            },
            name: 'Poza mireasa',
            backgroundImage: {
              name: 'Elena-Doru_207.jpg',
              opacity: 'rgba(0,0,0,0.15)',
              url: '/demo_template_1/template_1_2.jpeg',
            },
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            style: {
              width: 250,
              height: 250,
              backgroundSize: 'cover',
              borderRadius: 50,
              backgroundRepeat: 'no-repeat',
            },
            disabled: false,
            id: 'element-77464651-1662-4856-8c6a-840d91610651',
          },
          {
            style: {
              textAlign: 'start',
              width: 50,
              fontWeight: '700',
              fontSize: 31,
              color: '#ffffff',
            },
            content:
              'Vă așteptăm să ne fiți alături la începutul călătoriei noastre împreună',
            position: {
              bottom: 10.29,
              elementAlignment: 'auto',
              left: 18.62,
            },
            id: 'element-1c023bc2-5d22-482a-8f24-b3176f4c8a8f',
            disabled: false,
            responsive: {
              tablet: {
                position: {
                  right: 23.96,
                  bottom: 8.61,
                  elementAlignment: 'auto',
                },
                style: {
                  width: 30,
                  fontSize: 16,
                },
              },
              mobile: {
                position: {
                  elementAlignment: 'auto',
                  left: 9.38,
                  bottom: 13.22,
                },
                style: {
                  textAlign: 'start',
                  fontSize: 12,
                  width: 51,
                },
              },
            },
            type: ElementType.Text,
            name: 'Mesaj',
          },
          {
            id: 'element-a0305b34-86b6-492c-8b3a-47230606e639',
            position: {
              right: 19.76,
              top: 7.5,
              elementAlignment: 'auto',
            },
            disabled: false,
            responsive: {
              tablet: {
                style: {
                  fontSize: 16,
                  width: 30,
                },
                position: {
                  elementAlignment: 'auto',
                  top: 14.14,
                  left: 23.91,
                },
              },
              mobile: {
                position: {
                  right: 12.96,
                  top: 12.86,
                  elementAlignment: 'auto',
                },
                style: {
                  fontSize: 12,
                  textAlign: 'end',
                  width: 46,
                },
              },
            },
            style: {
              width: 50,
              color: '#ffffff',
              fontWeight: '700',
              textAlign: 'end',
              fontSize: 31,
            },
            name: 'Mesaj',
            type: ElementType.Text,
            content:
              'O zi specială, un moment unic, o invitație din suflet.\nO zi specială, un moment unic, o invitație din suflet.',
          },
        ],
        position: {
          elementAlignment: 'auto',
        },
        type: ElementType.Section,
        disabled: false,
        backgroundImage: {
          opacity: 'rgba(32,28,28,0.21)',
          name: 'Elena-Doru_122(1).png',
          url: '/demo_template_1/template_1_4.png',
        },
        responsive: {
          mobile: {
            style: {
              height: 300,
            },
          },
          tablet: {
            style: {
              height: 449,
            },
          },
        },
        style: {
          backgroundColor: '#fffffff0',
          height: 600,
          zIndex: 1,
        },
      },
      {
        style: {
          height: 300,
          backgroundColor: '#edd850',
        },
        elements: [
          {
            type: ElementType.Blob,
            position: {
              bottom: 0,
              left: 0,
              elementAlignment: 'auto',
            },
            style: {
              color: '#fce8ff',
              width: 100,
            },
            disabled: false,
            name: ElementType.Blob,
            blobName: 'blob_1',
            responsive: {
              tablet: {
                position: {
                  bottom: 0,
                  left: 0,
                  elementAlignment: 'auto',
                },
              },
              mobile: {
                position: {
                  bottom: 0,
                  elementAlignment: 'auto',
                  left: 0,
                },
              },
            },
            id: 'element-7779f98d-3d14-4d42-8df8-a2990d6a0ab7',
          },
          {
            position: {
              elementAlignment: 'auto',
              left: 21.88,
              top: 12.85,
            },
            id: 'element-5ba5fe3c-e4ec-4a1f-939a-e93c215e6e7f',
            type: ElementType.Container,
            disabled: false,
            name: 'Container',
            responsive: {
              tablet: {
                style: {
                  width: 70,
                  height: 0,
                },
                borderStyles: {
                  color: '#fce8ff',
                  sides: 'solid none none none',
                  size: '4',
                },
                position: {
                  elementAlignment: 'auto',
                  right: 15.1,
                  top: 46.7,
                },
              },
              mobile: {
                borderStyles: {
                  sides: 'none none none solid',
                  color: '#fce8ff',
                  size: '4',
                },
                position: {
                  top: 18.22,
                  elementAlignment: 'auto',
                  left: 22.62,
                },
                style: {
                  height: 150,
                  width: 0,
                },
              },
            },
            borderStyles: {
              color: '#fce8ff',
              sides: 'none none none solid',
              size: '4',
            },
            style: {
              backgroundColor: '#ffffff00',
              height: 150,
              width: 0,
            },
          },
          {
            position: {
              right: 11.98,
              elementAlignment: 'auto',
              top: 44.2,
            },
            name: 'Container',
            borderStyles: {
              sides: 'solid none none none',
              color: '#fce8ff',
              size: '4',
            },
            disabled: false,
            type: ElementType.Container,
            responsive: {
              tablet: {
                borderStyles: {
                  sides: 'none none none solid',
                  size: '4',
                  color: '#fce8ff',
                },
                position: {
                  elementAlignment: 'auto',
                  left: 20.55,
                  top: 9.39,
                },
                style: {
                  width: 0,
                  height: 200,
                },
              },
              mobile: {
                style: {
                  width: 70,
                  height: 0,
                },
                position: {
                  elementAlignment: 'auto',
                  top: 46.99,
                  left: 11.15,
                },
                borderStyles: {
                  sides: 'solid none none none',
                  size: '4',
                  color: '#fce8ff',
                },
              },
            },
            id: 'element-4d1071f8-705c-4575-90b9-b2cff8bbd21a',
            style: {
              height: 0,
              width: 70,
              backgroundColor: '#02020200',
            },
          },
          {
            type: ElementType.Text,
            style: {
              textAlign: 'center',
              fontWeight: '700',
              color: '#f09afd',
              fontSize: 42,
            },
            position: {
              top: 19.79,
              elementAlignment: 'auto',
              left: 22.4,
            },
            id: 'element-58568958-36b3-42f9-8181-937188a98fc0',
            responsive: {
              mobile: {
                position: {
                  top: 30.96,
                  left: 22.84,
                  elementAlignment: 'auto',
                },
                style: {
                  fontWeight: '700',
                  fontSize: 24,
                },
              },
              tablet: {
                style: {
                  fontWeight: '700',
                  fontSize: 42,
                },
                position: {
                  top: 22.34,
                  elementAlignment: 'auto',
                  left: 21.4,
                },
              },
            },
            name: 'Text',
            content: 'Party with us',
            disabled: false,
          },
        ],
        type: ElementType.Section,
        position: { elementAlignment: 'auto' },
        name: 'Sectiune',
        id: 'section-f3cd98d3-dd18-493b-8785-d1769a00f6f8',
        disabled: false,
        responsive: {},
      },
      {
        id: 'section-c07485ca-b854-435d-b8f4-56dee3c11c44',
        position: { elementAlignment: 'auto' },
        responsive: {},
        disabled: false,
        elements: [],
        name: 'Sectiune',
        type: ElementType.Section,
        style: {
          backgroundColor: '#fce8ff',
          height: 300,
        },
      },
      {
        style: {
          justifyContent: 'center',
          height: 'auto',
        },
        responsive: {},
        name: 'Sectiune RSVP',
        disabled: false,
        position: { elementAlignment: 'auto' },
        elements: [
          {
            style: {
              color: '#ffffff',
              zIndex: 3,
              fontSize: 16,
            },
            type: ElementType.RSVP_ELEMENT,
            position: {
              elementAlignment: 'auto',
              left: 0,
            },
            disabled: false,
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'auto',
                  left: 0,
                },
                style: {
                  fontSize: 14,
                },
              },
            },
            name: 'RSVP',
            id: 'element-75610eef-09c9-47d2-80b7-78f361408bc7',
          },
        ],
        type: ElementType.RSVP_SECTION,
        id: 'section-rsvp',
      },
    ],
    settings: {
      backgroundColor: '#f8f0e8',
      aditionalLocations: [],
      eventAditionalQuestions: [],
      eventLocation: {
        locationId: 'demo-template-1',
        formatted_address: 'demo-template-1',
        location: { lat: '0', long: '0' },
        name: 'demo-template-1 ',
      },
      eventActive: false,
    },
    description:
      'Un template demonstrativ care utilizează poziționare și stiluri specifice pe breakpoint-uri.',
    type: 'wedding',
    name: 'Demo Invitație Nuntă',
    templateId: 'demo-template-1',
    userId: 'demo-template-1',
    eventId: 'demo-template-1',
    eventDate: 'demo-template-1',
  },
];

export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.templateId === id);
};
