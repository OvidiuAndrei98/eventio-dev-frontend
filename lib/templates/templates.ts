import { ElementType, Template } from '@/core/types';

export const defaultTemplates: Template[] = [
  {
    eventId: 'template-wedding-1',
    eventDate: 'template-wedding-1',
    settings: {
      aditionalLocations: [
        {
          locationStartTime: '11:00',
          locationImage: {
            url: '/templates_images/wedding/wedding_t_1/wedding_t_1_1.jpg',
            name: 'Cununia civilă',
          },
          locationId: 'd674b4f4-7308-4bdc-a462-9b1f069c964e',
          formatted_address: 'Calea Dudești 191, București',
          name: 'Primăria Sectorului 3',
          location: {
            long: '26.1364112',
            lat: '44.42046269999999',
          },
          title: 'Cununia civilă',
        },
        {
          formatted_address: 'Calea Șerban Vodă 29, București 030167',
          locationImage: {
            name: 'Cununia religioasă',
            url: '/templates_images/wedding/wedding_t_1/wedding_t_1_2.jpg',
          },
          title: 'Cununia religioasă',
          locationId: '9eccad30-ce78-40ff-9ada-f445842a4d89',
          locationStartTime: '15:00',
          location: {
            lat: '44.42387039999999',
            long: '26.1033748',
          },
          name: 'Biserica Sfântul Spiridon-Nou',
        },
      ],
      eventAditionalQuestions: [],
      eventActive: true,
      backgroundColor: '#f8f0e8',
      eventLocation: {
        location: {
          long: '26.1514274',
          lat: '44.4093253',
        },
        locationId: '08027958-e5a8-4888-aabd-084acc53b235',
        formatted_address:
          'Strada Locotenent Nicolae Pascu 81, București 077160',
        locationStartTime: '20:00',
        title: 'Petrecerea',
        locationImage: {
          name: 'Petrecerea',
          url: '/templates_images/wedding/wedding_t_1/wedding_t_1_3.jpg',
        },
        name: 'Reina Events',
      },
    },
    templateId: 'template-wedding-1',
    elements: [
      {
        position: {
          elementAlignment: 'auto',
          left: 0,
        },
        backgroundImage: {
          url: '/templates_images/wedding/wedding_t_1/wedding_t_1_4.jpg',
          name: 'Header Background',
          opacity: 'rgba(0,0,0,0.15)',
        },
        name: 'Header',
        id: 'section-header',
        style: {
          zIndex: 2,
          backgroundColor: '#000000',
          height: 1200,
        },
        type: ElementType.Section,
        disabled: false,
        elements: [
          {
            style: {
              backgroundColor: '#c2ab9b6b',
              height: 200,
              borderRadius: 25,
              width: 50,
            },
            type: ElementType.Container,
            position: {
              right: 25.06,
              elementAlignment: 'center',
              bottom: 33.51,
            },
            borderStyles: {
              color: '#1677ff',
              size: '1',
              sides: 'none none none none',
            },
            name: 'Container',
            responsive: {
              mobile: {
                position: {
                  left: 22.64,
                  elementAlignment: 'center',
                  bottom: 30.2,
                },
                style: {
                  width: 55,
                  borderRadius: 25,
                  height: 125,
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'center',
                  left: 25.07,
                  bottom: 31.08,
                },
                style: {
                  width: 50,
                  borderRadius: 10,
                  height: 170,
                },
              },
            },
            id: 'element-0a5f1e57-759e-476a-a524-16d393c9ec13',
            disabled: false,
          },
          {
            id: 'element-3e4f52fa-df62-4772-b820-afb520cd1453',
            name: 'Nume mire',
            type: ElementType.Text,
            style: {
              fontWeight: '500',
              fontSize: 60,
              color: '#ffffff',
              fontFamily: 'Pacifico',
            },
            content: 'David',
            disabled: false,
            position: {
              top: 35,
              left: 5,
              elementAlignment: 'auto',
            },
            responsive: {
              mobile: {
                position: {
                  top: 43,
                  elementAlignment: 'auto',
                  left: 2,
                },
                style: {
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: 22,
                },
              },
              tablet: {
                style: {
                  fontWeight: '700',
                  fontSize: 30,
                },
                position: {
                  elementAlignment: 'self-start',
                  top: 42.47,
                  left: 3,
                },
              },
            },
          },
          {
            disabled: false,
            style: {
              fontSize: 60,
              fontWeight: '500',
              color: '#ffffff',
              fontFamily: 'Pacifico',
              textAlign: 'center',
            },
            content: 'Corina',
            position: {
              top: 35,
              right: 5,
              elementAlignment: 'auto',
            },
            responsive: {
              mobile: {
                style: {
                  fontSize: 22,
                  fontWeight: '500',
                  textAlign: 'end',
                },
                position: {
                  elementAlignment: 'self-end',
                  right: 2,
                  top: 43,
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'self-end',
                  right: 3,
                  top: 42.46,
                },
                style: {
                  fontWeight: '700',
                  fontSize: 30,
                },
              },
            },
            type: ElementType.Text,
            name: 'Nume mireasă',
            id: 'element-e6fe456e-4cb0-4d45-ad50-7a59aaf9d04e',
          },
          {
            name: 'Nașii, când',
            style: {
              fontWeight: '500',
              fontSize: 40,
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'Pacifico',
            },
            content: 'Nașii\nRobert și Diana\n06 Septembrie 2025',
            position: {
              bottom: 33.7,
              elementAlignment: 'center',
              left: 27.95,
            },
            type: ElementType.Text,
            id: 'element-fac7a20d-8c55-468a-9083-0a1dafe43963',
            responsive: {
              mobile: {
                position: {
                  left: 21.41,
                  bottom: 31.48,
                  elementAlignment: 'center',
                },
                style: {
                  fontSize: 20,
                  textAlign: 'center',
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'center',
                  left: 27.97,
                  bottom: 32.19,
                },
                style: {
                  textAlign: 'center',
                  fontSize: 30,
                },
              },
            },
            disabled: false,
          },
          {
            blobName: 'blob_1',
            style: {
              color: '#00000078',
              width: 100,
            },
            responsive: {
              mobile: {
                position: {
                  left: 0,
                  bottom: 0,
                  elementAlignment: 'center',
                },
              },
            },
            position: {
              left: 0,
              bottom: 0,
              elementAlignment: 'center',
            },
            name: 'Blob',
            id: 'element-814ef20f-1b2c-43e6-84f0-73f593907728',
            disabled: false,
            type: ElementType.Blob,
          },
        ],
        responsive: {
          tablet: {
            style: {
              height: 850,
            },
          },
          mobile: {
            style: {
              height: 700,
            },
          },
        },
      },
      {
        style: {
          backgroundColor: '#fffffff0',
          height: 1200,
          zIndex: 1,
        },
        id: 'section-main-details',
        elements: [
          {
            disabled: false,
            id: 'element-e84a1cff-0a5f-4778-825e-de99da7c2790',
            name: 'Container',
            borderStyles: {
              sides: 'dashed dashed dashed dashed',
              size: '1',
              color: '#000000',
            },
            position: {
              elementAlignment: 'auto',
              right: 4.98,
              top: 8.25,
            },
            type: ElementType.Container,
            responsive: {
              mobile: {
                borderStyles: {
                  sides: 'dashed dashed dashed dashed',
                  size: '2',
                  color: '#000000',
                },
                style: {
                  width: 73,
                  borderRadius: 10,
                  height: 145,
                },
                position: {
                  right: 4.73,
                  top: 7.5,
                  elementAlignment: 'auto',
                },
              },
              tablet: {
                position: {
                  left: 4.86,
                  bottom: 12.82,
                  elementAlignment: 'auto',
                },
                style: {
                  width: 80,
                  borderRadius: 20,
                  height: 195,
                },
                borderStyles: {
                  sides: 'dashed dashed dashed dashed',
                  color: '#000000',
                  size: '1',
                },
              },
            },
            style: {
              height: 245,
              borderRadius: 20,
              backgroundColor: '#0a0a0af2',
              width: 80,
            },
          },
          {
            style: {
              borderRadius: 20,
              width: 80,
              height: 245,
              backgroundColor: '#0a0a0af2',
            },
            type: ElementType.Container,
            name: 'Container',
            responsive: {
              tablet: {
                position: {
                  right: 5.2,
                  elementAlignment: 'auto',
                  top: 5.4,
                },
                borderStyles: {
                  sides: 'dashed dashed dashed dashed',
                  color: '#000000',
                  size: '1',
                },
                style: {
                  height: 195,
                  borderRadius: 20,
                  width: 75,
                },
              },
              mobile: {
                borderStyles: {
                  sides: 'dashed dashed dashed dashed',
                  size: '2',
                  color: '#0e0e0e',
                },
                position: {
                  left: 4.33,
                  bottom: 19.81,
                  elementAlignment: 'auto',
                },
                style: {
                  width: 73,
                  borderRadius: 10,
                  height: 145,
                },
              },
            },
            position: {
              left: 5.13,
              bottom: 16.65,
              elementAlignment: 'auto',
            },
            id: 'element-1ec2d9b9-09e2-41fa-84ff-ba2efd84624c',
            borderStyles: {
              sides: 'dashed dashed dashed dashed',
              color: '#000000',
              size: '1',
            },
            disabled: false,
          },
          {
            name: 'Poză mireasă',
            style: {
              borderRadius: 50,
              height: 250,
              width: 250,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            },
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
            responsive: {
              tablet: {
                style: {
                  width: 200,
                  height: 200,
                },
                position: {
                  top: 5,
                  left: 5,
                  elementAlignment: 'auto',
                },
              },
              mobile: {
                position: {
                  left: 3,
                  top: 7.11,
                  elementAlignment: 'auto',
                },
                style: {
                  width: 150,
                  height: 150,
                  borderRadius: 50,
                },
              },
            },
            id: 'element-9f483bb4-eebf-42bb-a0f5-cca31daa57b3',
            disabled: false,
            position: {
              top: 7.79,
              elementAlignment: 'auto',
              left: 5,
            },
            backgroundImage: {
              url: '/templates_images/wedding/wedding_t_1/wedding_t_1_5.jpg',
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
            },
            type: ElementType.Image,
          },
          {
            content:
              'Vă așteptăm să ne\n fiți alături la începutul \ncălătoriei \nnoastre împreună!',
            name: 'Mesaj mireasă',
            id: 'element-80f66717-b71b-4fa0-b489-15085d7cdc63',
            type: ElementType.Text,
            disabled: false,
            style: {
              fontWeight: '500',
              color: '#ffffff',
              fontFamily: 'Pacifico',
              textAlign: 'center',
              fontSize: 33,
            },
            responsive: {
              mobile: {
                style: {
                  fontSize: 15,
                  fontWeight: '700',
                },
                position: {
                  elementAlignment: 'auto',
                  right: 6.13,
                  top: 10.03,
                },
              },
              tablet: {
                position: {
                  top: 7.31,
                  right: 15.69,
                  elementAlignment: 'auto',
                },
                style: {
                  fontSize: 25,
                },
              },
            },
            position: {
              top: 9.44,
              elementAlignment: 'auto',
              right: 15.04,
            },
          },
          {
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
            name: 'Poză mire',
            style: {
              borderRadius: 50,
              width: 250,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: 250,
            },
            disabled: false,
            position: {
              bottom: 16.33,
              right: 5,
              elementAlignment: 'auto',
            },
            type: ElementType.Image,
            backgroundImage: {
              opacity: 'rgba(0,0,0,0.15)',
              name: 'Demo Image',
              url: '/templates_images/wedding/wedding_t_1/wedding_t_1_6.jpg',
            },
            id: 'element-91dacb85-7278-4efa-8e7f-7e417eba7431',
            responsive: {
              mobile: {
                style: {
                  borderRadius: 50,
                  width: 150,
                  height: 150,
                },
                position: {
                  right: 3,
                  elementAlignment: 'auto',
                  bottom: 19.36,
                },
              },
              tablet: {
                position: {
                  right: 5,
                  elementAlignment: 'auto',
                  bottom: 12.42,
                },
                style: {
                  borderRadius: 50,
                  width: 200,
                  height: 200,
                },
              },
            },
          },
          {
            responsive: {
              tablet: {
                style: {
                  fontSize: 25,
                },
                position: {
                  bottom: 17.15,
                  left: 20.61,
                  elementAlignment: 'auto',
                },
              },
              mobile: {
                style: {
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '700',
                },
                position: {
                  left: 7.38,
                  bottom: 24.56,
                  elementAlignment: 'auto',
                },
              },
            },
            name: 'Mesaj mire',
            style: {
              textAlign: 'center',
              fontSize: 33,
              fontFamily: 'Pacifico',
              color: '#ffffff',
              fontWeight: '500',
              textShadow: '0 #000000',
            },
            type: ElementType.Text,
            content:
              'O zi specială, \nun moment unic,\n o invitație din suflet',
            disabled: false,
            id: 'element-a19a621c-78c5-4ab2-a4e7-478753ed495e',
            position: {
              bottom: 20.14,
              left: 20.05,
              elementAlignment: 'auto',
            },
          },
        ],
        name: 'Detalii eveniment',
        disabled: false,
        type: ElementType.Section,
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        position: {
          elementAlignment: 'auto',
        },
        backgroundImage: {
          opacity: 'rgba(0,0,0,0)',
          name: 'Demo Image',
          url: '/templates_images/wedding/wedding_t_1/wedding_t_1_7.jpg',
        },
      },
      {
        name: 'Sectiune Locatii',
        id: 'section-6d3b061e-e8f4-4370-b579-54372a4ecfbb',
        disabled: false,
        backgroundImage: {
          opacity: 'rgba(0,0,0,0.1)',
          url: '/templates_images/wedding/wedding_t_1/wedding_t_1_8.jpg',
          name: 'Demo Image',
        },
        style: {
          justifyContent: 'center',
          height: 'auto',
        },
        elements: [
          {
            style: {
              backgroundColor: '#00000000',
            },
            responsive: {
              mobile: {
                borderStyles: {
                  color: '#000000',
                  size: '1px',
                  sides: 'solid solid solid solid',
                },
                style: {
                  borderRadius: 25,
                },
              },
            },
            name: 'Locatii Eveniment',
            buttonStyle: {
              color: '#ffffff',
              backgroundColor: '#b79764b3',
            },
            id: 'element-c6619fba-65a3-4650-9f76-645e81a2955e',
            type: ElementType.locationsElement,
            disabled: false,
            position: { elementAlignment: 'auto' },
            titleStyle: {
              color: '#000000',
              fontFamily: 'Pacifico',
            },
          },
        ],
        responsive: {},
        position: {
          elementAlignment: 'auto',
        },
        type: ElementType.LocationsSection,
      },
      {
        style: {
          height: 'auto',
          justifyContent: 'center',
        },
        type: ElementType.RSVP_SECTION,
        backgroundImage: {
          name: 'Demo Image',
          opacity: 'rgba(0,0,0,0)',
          url: '/templates_images/wedding/wedding_t_1/wedding_t_1_9.jpg',
        },
        responsive: {},
        position: {
          elementAlignment: 'auto',
        },
        elements: [
          {
            position: {
              elementAlignment: 'auto',
              left: 0,
            },
            id: 'element-75610eef-09c9-47d2-80b7-78f361408bc7',
            disabled: false,
            type: ElementType.RSVP_ELEMENT,
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
            style: {
              fontSize: 16,
              zIndex: 3,
              color: '#ffffff',
            },
            name: 'RSVP',
          },
        ],
        name: 'Sectiune RSVP',
        disabled: false,
        id: 'section-rsvp',
      },
    ],
    userId: 'template-wedding-1',
    description:
      'O invitație digitală ce evocă măreția și solemnitatea unirii, sub un cer plin de promisiuni. Designul clasic, amplificat de ambianța naturală și lumina discretă, prefigurează o celebrare a iubirii eterne, marcată de eleganță și rafinament.',
    name: 'Legământ Sub Stele',
    thumbnailUrl:
      '/templates_images/wedding/wedding_t_1/template_1_thumbnail.svg',
    type: 'wedding',
  },
  {
    eventId: 'template-wedding-2',
    userId: 'template-wedding-2',
    templateId: 'template-wedding-2',
    settings: {
      eventLocation: {
        location: {
          lat: '44.4093253',
          long: '26.1514274',
        },
        locationImage: {
          url: '/templates_images/wedding/wedding_t_2/wedding_t_2_1.jpg',
          name: 'Petrecerea',
        },
        formatted_address:
          'Strada Locotenent Nicolae Pascu 81, București 077160',
        title: 'Petrecerea',
        locationId: 'dc998d5e-d967-4a08-993f-317e7386ea18',
        locationStartTime: '21:00',
        name: 'Reina Events',
      },
      eventActive: true,
      aditionalLocations: [
        {
          location: {
            lat: '44.4210169',
            long: '26.0933476',
          },
          title: 'Cununia civilă',
          formatted_address: 'Strada Gramont 26, București',
          name: 'Oficiul Stării Civile Sector 4',
          locationStartTime: '12:00',
          locationId: 'a47407ea-7d78-4418-9dfa-42f4156544a8',
          locationImage: {
            url: '/templates_images/wedding/wedding_t_2/wedding_t_2_2.jpg',
            name: 'Cununia civilă',
          },
        },
        {
          title: 'Cununia religioasă',
          formatted_address: 'Calea Șerban Vodă 29, București 030167',
          locationId: 'd79e58a1-fb76-43c2-ac22-57f4cf58b45c',
          name: 'Biserica Sfântul Spiridon-Nou',
          location: {
            lat: '44.42387039999999',
            long: '26.1033748',
          },
          locationStartTime: '15:00',
          locationImage: {
            name: 'Cununia religioasă',
            url: '/templates_images/wedding/wedding_t_2/wedding_t_2_3.jpg',
          },
        },
      ],
      eventAditionalQuestions: [],
      backgroundColor: '#f8f0e8',
    },
    thumbnailUrl:
      '/templates_images/wedding/wedding_t_2/template_2_thumbnail.svg',
    description:
      'Cu o paletă de culori calde, inspirate de apus, această invitație digitală impune o notă de grandoare și pasiune. Compoziția centrată pe portretul vostru transmite o poveste de dragoste profundă, invitând oaspeții să împărtășească emoția unui moment de o importanță deosebită.',
    elements: [
      {
        backgroundImage: {
          opacity: 'rgba(22,22,22,0.37)',
          name: 'Header Background',
          url: '/templates_images/wedding/wedding_t_2/wedding_t_2_4.jpg',
        },
        position: {
          left: 0,
          elementAlignment: 'auto',
        },
        id: 'section-header',
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        disabled: false,
        name: 'Header',
        elements: [
          {
            borderStyles: {
              color: '#ffffff',
              sides: 'solid solid solid solid',
              size: '2',
            },
            name: 'Poză miri',
            type: ElementType.Image,
            style: {
              width: 450,
              height: 450,
              borderRadius: 50,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            },
            backgroundImage: {
              opacity: 'rgba(0,0,0,0)',
              name: 'Demo Image',
              url: '/templates_images/wedding/wedding_t_2/wedding_t_2_5.jpg',
            },
            id: 'element-ee8a7ed2-c1d6-4e54-b507-664943303718',
            disabled: false,
            position: {
              top: 22.74,
              left: 24.43,
              elementAlignment: 'center',
            },
            responsive: {
              tablet: {
                style: {
                  height: 350,
                  width: 350,
                },
              },
              mobile: {
                position: {
                  top: 28.92,
                  left: 13.98,
                  elementAlignment: 'center',
                },
                style: {
                  height: 225,
                  borderRadius: 50,
                  width: 225,
                },
              },
            },
          },
          {
            position: {
              left: 26.73,
              top: 8.63,
              elementAlignment: 'center',
            },
            content: 'Irina & Bogdan',
            disabled: false,
            id: 'element-90a6ee8f-3a2d-48a8-bd1b-5fd52975d48d',
            responsive: {
              tablet: {
                style: {
                  fontSize: 45,
                },
              },
              mobile: {
                position: {
                  right: 20.61,
                  top: 13.12,
                  elementAlignment: 'center',
                },
                style: {
                  fontWeight: '500',
                  fontSize: 35,
                },
              },
            },
            style: {
              textAlign: 'center',
              color: '#ffffff',
              fontWeight: '500',
              fontFamily: 'Great Vibes',
              fontSize: 65,
            },
            name: 'Nume miri',
            type: ElementType.Text,
          },
          {
            style: {
              color: '#ffffff',
              textShadow: '2 #000000',
              fontFamily: 'Great Vibes',
              fontSize: 55,
              fontWeight: '500',
              textAlign: 'center',
            },
            name: 'Când',
            type: ElementType.Text,
            disabled: false,
            responsive: {
              tablet: {
                style: {
                  fontSize: 34,
                },
              },
              mobile: {
                style: {
                  fontSize: 25,
                  fontWeight: '700',
                },
                position: {
                  left: 23.68,
                  bottom: 22.43,
                  elementAlignment: 'center',
                },
              },
            },
            position: {
              bottom: 27.77,
              left: 24.78,
              elementAlignment: 'center',
            },
            id: 'element-88ba24bf-6e64-48f6-815c-e0808a59613f',
            content: '09 Septembrie 2025',
          },
          {
            type: ElementType.Countdown,
            responsive: {
              tablet: {
                style: {
                  fontSize: 44,
                },
                position: {
                  bottom: 15.9,
                  right: 31.45,
                  elementAlignment: 'center',
                },
              },
              mobile: {
                position: {
                  elementAlignment: 'center',
                  left: 16.51,
                  bottom: 12.77,
                },
                style: {
                  fontWeight: '700',
                  fontSize: 25,
                },
              },
            },
            id: 'element-1ce8f463-3677-4999-a002-405308529c47',
            style: {
              fontFamily: 'Caveat',
              fontSize: 55,
              color: '#ffffff',
            },
            name: 'Numaratoare inversa',
            disabled: false,
            position: {
              right: 26.58,
              elementAlignment: 'center',
              bottom: 18.89,
            },
          },
          {
            position: {
              elementAlignment: 'center',
              left: 0,
              bottom: 0,
            },
            responsive: {},
            name: 'Blob',
            disabled: false,
            blobName: 'blob_1',
            type: ElementType.Blob,
            style: {
              width: 100,
              color: '#ffffff',
            },
            id: 'element-12a713c1-69a8-461a-90aa-a1767a0325a9',
          },
        ],
        style: {
          zIndex: 2,
          height: 1200,
          backgroundColor: '#ffffff',
          backgroundAttachment: 'scroll',
        },
        type: ElementType.Section,
      },
      {
        disabled: false,
        elements: [
          {
            name: 'Mesaj miri',
            disabled: false,
            id: 'element-3a7d7b4f-c8d9-4f5c-ac53-1d179335b2ba',
            position: {
              elementAlignment: 'center',
              left: 0,
              top: 19.44,
            },
            type: ElementType.Text,
            style: {
              fontFamily: 'Great Vibes',
              fontWeight: '500',
              textAlign: 'center',
              fontSize: 54,
            },
            content:
              'De la prima întâlnire la momentul în care am știut că suntem făcuți unul pentru celălalt, povestea noastră e una de neuitat.',
            responsive: {
              tablet: {
                style: {
                  fontSize: 40,
                },
              },
              mobile: {
                position: {
                  left: 0,
                  elementAlignment: 'center',
                  top: 23.74,
                },
                style: {
                  fontSize: 25,
                },
              },
            },
          },
          {
            content:
              'Acum, suntem gata să scriem cel mai frumos capitol și vă invităm să ni vă alăturați în ziua nunții, pentru a sărbători acest nou început.',
            style: {
              fontSize: 55,
              fontWeight: '500',
              textAlign: 'center',
              fontFamily: 'Great Vibes',
            },
            disabled: false,
            type: ElementType.Text,
            name: 'Mesaj miri',
            responsive: {
              tablet: {
                position: {
                  bottom: 14.41,
                  left: 5.11,
                  elementAlignment: 'center',
                },
                style: {
                  fontSize: 40,
                },
              },
              mobile: {
                style: {
                  fontSize: 25,
                },
                position: {
                  bottom: 22.69,
                  elementAlignment: 'center',
                  left: 0,
                },
              },
            },
            position: {
              left: 5.11,
              elementAlignment: 'center',
              bottom: 14.41,
            },
            id: 'element-d04b9a3e-61e3-46de-a0b9-75a186125953',
          },
          {
            name: 'Imagine animata',
            gifUrl: '/gifs/purple-blue-flower.gif',
            disabled: false,
            position: {
              right: 26.87,
              elementAlignment: 'center',
              bottom: 43.4,
            },
            responsive: {
              mobile: {
                style: {
                  width: 250,
                },
                position: {
                  elementAlignment: 'center',
                  bottom: 43.55,
                  left: 13.98,
                },
              },
              tablet: {
                style: {
                  width: 300,
                },
                position: {
                  left: 23.56,
                  bottom: 42.15,
                  elementAlignment: 'center',
                },
              },
            },
            id: 'element-cde03741-76ac-4531-9744-4e3db2627152',
            style: {
              width: 400,
            },
            type: ElementType.GifElement,
          },
          {
            id: 'element-2a784c3f-8fd7-4e4c-89ab-bb32234b315e',
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            position: {
              bottom: 2.86,
              right: 5.29,
              elementAlignment: 'auto',
            },
            responsive: {
              tablet: {
                position: {
                  right: 1.36,
                  elementAlignment: 'self-end',
                  bottom: 2,
                },
                style: {
                  height: 120,
                  width: 130,
                },
              },
              mobile: {
                position: {
                  elementAlignment: 'self-start',
                  top: 3.87,
                  left: 2.57,
                },
                style: {
                  width: 110,
                  height: 100,
                },
              },
            },
            style: {
              backgroundRepeat: 'no-repeat',
              width: 170,
              borderRadius: 0,
              backgroundSize: 'cover',
              height: 150,
            },
            name: 'Trandafir',
            type: ElementType.Image,
            backgroundImage: {
              url: '/templates_images/wedding/wedding_t_2/wedding_t_2_6.png',
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
            },
            disabled: false,
          },
          {
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            backgroundImage: {
              url: '/templates_images/wedding/wedding_t_2/wedding_t_2_7.png',
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
            },
            style: {
              width: 170,
              borderRadius: 0,
              backgroundRepeat: 'no-repeat',
              height: 150,
              backgroundSize: 'cover',
            },
            position: {
              top: 2.32,
              elementAlignment: 'self-start',
              left: 5.91,
            },
            disabled: false,
            type: ElementType.Image,
            name: 'Trandafir',
            id: 'element-401fa47d-9dbd-4dfb-8621-cab21ec37a58',
            responsive: {
              mobile: {
                style: {
                  width: 110,
                  height: 100,
                },
                position: {
                  bottom: 5.11,
                  elementAlignment: 'self-end',
                  right: 2.57,
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'self-start',
                  left: 1.32,
                  top: 2,
                },
                style: {
                  width: 130,
                  height: 120,
                },
              },
            },
          },
        ],
        id: 'section-5b905ee1-7f9d-4a9e-9211-1898b5e2706a',
        name: 'Secțiune mesaj miri',
        position: {
          elementAlignment: 'auto',
        },
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        type: ElementType.Section,
        style: {
          backgroundColor: '#ffffff',
          height: 1200,
        },
      },
      {
        elements: [
          {
            style: {
              color: '#ffffff',
              width: 100,
            },
            type: ElementType.Blob,
            name: 'Blob',
            id: 'element-2ea67952-32b7-477c-b6bd-1d262173488d',
            disabled: false,
            position: {
              elementAlignment: 'center',
              top: 0,
              left: 0,
            },
            blobName: 'blob_7',
            responsive: {},
          },
          {
            position: {
              left: 0,
              bottom: 0,
              elementAlignment: 'center',
            },
            responsive: {},
            disabled: false,
            blobName: 'blob_8',
            name: 'Blob',
            style: {
              color: '#ffffff',
              width: 100,
            },
            id: 'element-2c281872-79cb-427a-90e6-5e18389e515d',
            type: ElementType.Blob,
          },
          {
            borderStyles: {
              color: '#1677ff',
              size: '1',
              sides: 'none none none none',
            },
            name: 'Container',
            id: 'element-b0bc3d0e-79d1-4660-8b3f-00ff1157dc51',
            type: ElementType.Container,
            responsive: {
              mobile: {
                style: {
                  borderRadius: 20,
                  height: 130,
                  width: 95,
                },
                position: {
                  top: 36.18,
                  elementAlignment: 'center',
                  right: 2.72,
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'center',
                  left: 4.14,
                  top: 35.17,
                },
                style: {
                  height: 250,
                },
              },
            },
            position: {
              top: 14.9,
              elementAlignment: 'center',
              left: 4.1,
            },
            style: {
              height: 300,
              width: 92,
              borderRadius: 20,
              backgroundColor: '#0202024d',
            },
            disabled: false,
          },
          {
            disabled: false,
            id: 'element-a0305b34-86b6-492c-8b3a-47230606e639',
            position: {
              left: 5.2,
              top: 15.03,
              elementAlignment: 'center',
            },
            content:
              'Vă invităm să fiți parte din povestea noastră de dragoste!\n\nI & B\n    Două inimi                                   Un singur drum',
            type: ElementType.Text,
            responsive: {
              tablet: {
                style: {
                  width: 90,
                  fontSize: 35,
                },
                position: {
                  left: 5.13,
                  top: 36.42,
                  elementAlignment: 'center',
                },
              },
              mobile: {
                style: {
                  fontSize: 18,
                  width: 95,
                  fontWeight: '500',
                  textAlign: 'center',
                },
                position: {
                  elementAlignment: 'center',
                  top: 36.73,
                  right: 2.72,
                },
              },
            },
            style: {
              fontFamily: 'Great Vibes',
              textAlign: 'center',
              fontSize: 45,
              fontWeight: '700',
              textShadow: '0 #000000',
              color: '#ffffff',
              width: 90,
            },
            name: 'Mesaj miri',
          },
        ],
        style: {
          height: 1200,
          zIndex: 1,
          backgroundColor: '#fffffff0',
        },
        disabled: false,
        responsive: {
          tablet: {
            style: {
              height: 850,
            },
          },
          mobile: {
            style: {
              height: 700,
            },
          },
        },
        type: ElementType.Section,
        name: 'Detalii eveniment',
        position: {
          elementAlignment: 'auto',
        },
        backgroundImage: {
          opacity: 'rgba(0,0,0,0)',
          url: '/templates_images/wedding/wedding_t_2/wedding_t_2_8.jpg',
          name: 'Demo Image',
        },
        id: 'section-main-details',
      },
      {
        elements: [
          {
            addressStyle: {
              color: '#4a5565',
            },
            timeStyle: {
              color: '#4a5565',
            },
            buttonStyle: {
              color: '#1e232c',
              backgroundColor: '#AAAFBF',
            },
            id: 'element-d23aed3d-c2dd-46ff-9068-e8f340ea4693',
            style: {
              width: 100,
            },
            responsive: {},
            dateStyle: {
              color: '#1e2939',
            },
            type: ElementType.locationsElement,
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            name: 'Locatii Eveniment',
            titleStyle: {
              color: '#364153',
            },
            position: { elementAlignment: 'auto' },
            disabled: false,
          },
        ],
        position: {
          elementAlignment: 'auto',
        },
        responsive: {},
        name: 'Sectiune Locatii',
        id: 'section-a13325a0-b80a-41fc-8d51-14923903aac5',
        disabled: false,
        style: {
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          height: 'auto',
        },
        type: ElementType.LocationsSection,
      },
      {
        id: 'section-rsvp',
        name: 'Sectiune RSVP',
        disabled: false,
        type: ElementType.RSVP_SECTION,
        position: {
          elementAlignment: 'auto',
        },
        elements: [
          {
            name: 'RSVP',
            style: {
              fontSize: 16,
              zIndex: 3,
              color: '#ffffff',
            },
            type: ElementType.RSVP_ELEMENT,
            responsive: {
              mobile: {
                style: {
                  fontSize: 14,
                },
                position: {
                  left: 0,
                  elementAlignment: 'auto',
                },
              },
            },
            disabled: false,
            position: {
              left: 0,
              elementAlignment: 'auto',
            },
            id: 'element-75610eef-09c9-47d2-80b7-78f361408bc7',
          },
        ],
        style: {
          height: 'auto',
          justifyContent: 'center',
        },
        backgroundImage: {
          name: 'Demo Image',
          url: '/templates_images/wedding/wedding_t_2/wedding_t_2_9.jpg',
          opacity: 'rgba(0,0,0,0)',
        },
        responsive: {},
      },
    ],
    eventDate: 'template-wedding-2',
    type: 'wedding',
    name: 'Amurgul Iubirii Eterne',
  },
  {
    settings: {
      backgroundColor: '#f8f0e8',
      eventAditionalQuestions: [],
      eventActive: true,
      eventLocation: {
        location: {
          lat: '44.4093253',
          long: '26.1514274',
        },
        locationImage: {
          name: 'Demo Image',
          url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_1.png',
        },
        locationId: '0b8a6274-2ef7-4239-973c-69edec03d3cd',
        locationStartTime: '19:00',
        formatted_address:
          'Strada Locotenent Nicolae Pascu 81, București 077160',
        name: 'Reina Events',
        title: 'Sărbătoarea micuțului',
      },
      aditionalLocations: [
        {
          formatted_address: 'Calea Șerban Vodă 29, București 030167',
          locationStartTime: '13:00',
          name: 'Biserica Sfântul Spiridon-Nou',
          locationImage: {
            url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_2.png',
            name: 'Demo Image',
          },
          title: 'Taina botezului',
          locationId: '6bddee98-56c1-4152-98c4-3593e6e36d1c',
          location: {
            long: '26.1033748',
            lat: '44.42387039999999',
          },
        },
      ],
    },
    eventDate: 'template-bapthism-1',
    eventId: 'template-bapthism-1',
    thumbnailUrl:
      '/templates_images/bapthism/bapthism_t_1/template_1_thumbnail.svg',
    description:
      ' O invitație digitală plină de fantezie și bucurie, ce transformă botezul într-un eveniment de poveste. Detaliile aurii, elementele ludice și universul tematic creează o atmosferă de celebrare magică și plină de zâmbete pentru cel mic.',
    name: 'Micuțul Visător',
    elements: [
      {
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        style: {
          height: 1200,
          zIndex: 2,
          backgroundColor: '#ffffff',
        },
        disabled: false,
        name: 'Header',
        type: ElementType.Section,
        elements: [
          {
            type: ElementType.Image,
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'center',
                  left: 6.77,
                  top: 18.3,
                },
                style: {
                  borderRadius: 25,
                  width: 300,
                  height: 300,
                },
              },
              tablet: {
                style: {
                  width: 550,
                  height: 450,
                },
              },
            },
            position: {
              right: 7.39,
              elementAlignment: 'center',
              top: 14.11,
            },
            borderStyles: {
              sides: 'none none none none',
              size: '1',
              color: '#1677ff',
            },
            id: 'element-9e241099-6f41-4f84-994b-2cbf0033a87f',
            backgroundImage: {
              name: 'Demo Image',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_3.png',
              opacity: 'rgba(0,0,0,0)',
            },
            name: 'Imagine DJ baby',
            style: {
              backgroundRepeat: 'no-repeat',
              width: 750,
              backgroundSize: 'cover',
              height: 650,
              borderRadius: 25,
            },
            disabled: false,
          },
          {
            borderStyles: {
              sides: 'none none none none',
              size: '1',
              color: '#1677ff',
            },
            position: {
              elementAlignment: 'self-end',
              bottom: 3,
              right: 6.55,
            },
            style: {
              backgroundSize: 'cover',
              width: 125,
              borderRadius: 0,
              backgroundRepeat: 'no-repeat',
              height: 125,
            },
            type: ElementType.Image,
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'self-start',
                  top: 3.5,
                  left: 4.6,
                },
                style: {
                  width: 75,
                  height: 75,
                },
              },
              tablet: {
                style: {
                  width: 100,
                  height: 100,
                },
              },
            },
            id: 'element-3b34071a-f114-4a32-8ae3-9ab94cdd7f97',
            backgroundImage: {
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_4.png',
            },
            name: 'Imagine glob disco',
            disabled: false,
          },
          {
            responsive: {
              tablet: {
                style: {
                  width: 100,
                  height: 100,
                },
              },
              mobile: {
                style: {
                  width: 75,
                  height: 75,
                },
                position: {
                  top: 3.5,
                  right: 2.57,
                  elementAlignment: 'self-end',
                },
              },
            },
            borderStyles: {
              color: '#1677ff',
              size: '1',
              sides: 'none none none none',
            },
            name: 'Imagine glob disco',
            type: ElementType.Image,
            style: {
              borderRadius: 0,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: 125,
              height: 125,
            },
            id: 'element-7d604b2c-d5b1-434e-8a0a-fa816c847114',
            disabled: false,
            backgroundImage: {
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_4.png',
            },
            position: {
              elementAlignment: 'self-start',
              left: 3.54,
              bottom: 3,
            },
          },
          {
            disabled: false,
            style: {
              backgroundColor: '#02020236',
              borderRadius: 15,
              width: 50,
              height: 200,
            },
            position: {
              bottom: 32.81,
              right: 25.06,
              elementAlignment: 'center',
            },
            name: 'Container',
            borderStyles: {
              color: '#1677ff',
              sides: 'none none none none',
              size: '1',
            },
            type: ElementType.Container,
            id: 'element-029f6224-44dc-4183-b956-b3527eeebb9b',
            responsive: {
              mobile: {
                style: {
                  borderRadius: 15,
                  width: 65,
                },
                position: {
                  left: 17.65,
                  elementAlignment: 'center',
                  bottom: 42.43,
                },
              },
              tablet: {
                position: {
                  left: 25.07,
                  bottom: 35.9,
                  elementAlignment: 'center',
                },
                style: {
                  width: 45,
                  height: 145,
                },
              },
            },
          },
          {
            type: ElementType.Text,
            style: {
              fontWeight: '500',
              textShadow: '20 #000000',
              color: '#f5deb0',
              fontFamily: 'Allura',
              fontSize: 55,
              textAlign: 'center',
            },
            content: 'Rareș\n6 Septembrie 2025',
            name: 'Nume copil, Dată',
            responsive: {
              mobile: {
                style: {
                  fontSize: 25,
                  fontWeight: '700',
                },
                position: {
                  bottom: 42.91,
                  elementAlignment: 'center',
                  right: 21.16,
                },
              },
              tablet: {
                position: {
                  bottom: 37.07,
                  elementAlignment: 'center',
                  right: 29.74,
                },
                style: {
                  fontSize: 35,
                },
              },
            },
            id: 'element-5a6470b5-351d-4272-b94b-21926c717799',
            position: {
              elementAlignment: 'center',
              right: 24.91,
              bottom: 33.85,
            },
            disabled: false,
          },
          {
            type: ElementType.Text,
            name: 'Mesaj',
            disabled: false,
            responsive: {
              tablet: {
                style: {
                  fontSize: 30,
                },
              },
              mobile: {
                style: {
                  fontSize: 20,
                },
                position: {
                  elementAlignment: 'center',
                  bottom: 19.31,
                  left: 0,
                },
              },
            },
            position: {
              bottom: 15.87,
              left: 0,
              elementAlignment: 'center',
            },
            content:
              'Sunt mic, dar vă pregătesc o petrecere mare! După botez, vă invit să sărbătorim împreună un moment magic și plin de bucurie!',
            id: 'element-83ed5dc7-839a-4326-92a0-338356f33ede',
            style: {
              fontSize: 40,
              fontWeight: '500',
              textAlign: 'center',
              fontFamily: 'Allura',
            },
          },
          {
            backgroundImage: {
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_4.png',
            },
            id: 'element-6dfe424b-9611-471f-889f-0b33688e55c8',
            responsive: {
              tablet: {
                style: {
                  height: 100,
                  width: 100,
                },
              },
              mobile: {
                position: {
                  left: 2.54,
                  bottom: 5,
                  elementAlignment: 'self-start',
                },
                style: {
                  height: 75,
                  width: 75,
                },
              },
            },
            name: 'Imagine glob disco',
            position: {
              elementAlignment: 'self-end',
              top: 3,
              right: 2.99,
            },
            disabled: false,
            type: ElementType.Image,
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
            style: {
              width: 125,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              height: 125,
              borderRadius: 0,
            },
          },
          {
            position: {
              top: 3,
              left: 2.51,
              elementAlignment: 'self-start',
            },
            name: 'Imagine glob disco',
            backgroundImage: {
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_4.png',
            },
            style: {
              width: 125,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: 125,
              borderRadius: 0,
            },
            disabled: false,
            borderStyles: {
              color: '#1677ff',
              size: '1',
              sides: 'none none none none',
            },
            responsive: {
              tablet: {
                style: {
                  height: 100,
                  width: 100,
                },
              },
              mobile: {
                position: {
                  bottom: 5,
                  elementAlignment: 'self-end',
                  left: 2.69,
                },
                style: {
                  height: 75,
                  width: 75,
                },
              },
            },
            type: ElementType.Image,
            id: 'element-628f0a46-9f6d-4da5-8204-ed37309d03ad',
          },
        ],
        position: {
          left: 0,
          elementAlignment: 'auto',
        },
        id: 'section-header',
      },
      {
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        elements: [
          {
            position: {
              left: 0,
              top: 0,
              elementAlignment: 'center',
            },
            responsive: {
              tablet: {
                position: {
                  left: 0,
                  top: 0,
                  elementAlignment: 'center',
                },
              },
              mobile: {
                position: {
                  left: 0,
                  top: 0,
                  elementAlignment: 'center',
                },
              },
            },
            style: {
              color: '#ffffff',
              width: 100,
            },
            name: 'Blob',
            id: 'element-7fcfbcc2-1e5c-444e-9e58-51574d308f30',
            type: ElementType.Blob,
            disabled: false,
            blobName: 'blob_5',
          },
          {
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'center',
                  right: 35.59,
                  top: 9.18,
                },
                style: {
                  height: 50,
                },
              },
              tablet: {
                style: {
                  height: 50,
                  width: 100,
                },
              },
            },
            type: ElementType.Image,
            style: {
              width: 150,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              borderRadius: 0,
              height: 75,
            },
            id: 'element-9d58fa1f-04a2-4426-8e3b-497a91c2c4db',
            disabled: false,
            position: {
              top: 12.23,
              left: 41.48,
              elementAlignment: 'center',
            },
            name: 'Imagine DJ',
            borderStyles: {
              size: '1',
              color: '#1677ff',
              sides: 'none none none none',
            },
            backgroundImage: {
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_8.png',
            },
          },
          {
            name: 'Imagine copil',
            borderStyles: {
              sides: 'solid solid solid solid',
              size: '2',
              color: '#f5deb0',
            },
            style: {
              backgroundRepeat: 'no-repeat',
              borderRadius: 50,
              width: 350,
              backgroundSize: 'cover',
              height: 350,
            },
            position: {
              elementAlignment: 'center',
              top: 22.4,
              right: 30.11,
            },
            responsive: {
              tablet: {
                style: {
                  height: 250,
                  width: 250,
                },
                position: {
                  left: 31.62,
                  elementAlignment: 'center',
                  top: 20.41,
                },
              },
              mobile: {
                position: {
                  top: 17.98,
                  right: 12.91,
                  elementAlignment: 'center',
                },
                style: {
                  height: 250,
                  width: 250,
                  borderRadius: 50,
                },
              },
            },
            type: ElementType.Image,
            backgroundImage: {
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_9.png',
              name: 'Demo Image',
            },
            disabled: false,
            id: 'element-28545596-8a45-4fe6-b674-b4294db0e3ff',
          },
          {
            type: ElementType.Image,
            style: {
              height: 175,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: 175,
              borderRadius: 50,
            },
            position: {
              bottom: 30.67,
              elementAlignment: 'self-start',
              left: 8.55,
            },
            disabled: false,
            name: 'Imagine Parinți',
            backgroundImage: {
              name: 'Demo Image',
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_10.png',
              opacity: 'rgba(0,0,0,0)',
            },
            id: 'element-f6b7ccc6-6e25-4db3-9f33-cdf5418b0a5b',
            borderStyles: {
              sides: 'solid solid solid solid',
              color: '#f5deb0',
              size: '2',
            },
            responsive: {
              mobile: {
                style: {
                  borderRadius: 50,
                  height: 125,
                  width: 125,
                },
                position: {
                  bottom: 26.82,
                  elementAlignment: 'self-start',
                  left: 7.37,
                },
              },
              tablet: {
                style: {
                  height: 150,
                  width: 150,
                },
              },
            },
          },
          {
            style: {
              borderRadius: 50,
              backgroundRepeat: 'no-repeat',
              height: 175,
              backgroundSize: 'cover',
              width: 175,
            },
            responsive: {
              mobile: {
                position: {
                  elementAlignment: 'self-end',
                  bottom: 6.89,
                  right: 13.75,
                },
                style: {
                  borderRadius: 50,
                  width: 125,
                  height: 125,
                },
              },
              tablet: {
                style: {
                  width: 150,
                  height: 150,
                },
                position: {
                  right: 1.32,
                  elementAlignment: 'self-end',
                  bottom: 13.11,
                },
              },
            },
            name: 'Imagine Nași',
            disabled: false,
            position: {
              right: 1.14,
              bottom: 16.83,
              elementAlignment: 'self-end',
            },
            borderStyles: {
              color: '#f5deb0',
              size: '2',
              sides: 'solid solid solid solid',
            },
            type: ElementType.Image,
            backgroundImage: {
              url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_11.png',
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
            },
            id: 'element-cc0bba7a-72c5-41f0-bb94-cc213729828b',
          },
          {
            name: 'Nume părinți',
            id: 'element-f51c8c59-eee3-4002-81a8-faf33650dde5',
            responsive: {
              mobile: {
                position: {
                  bottom: 29.72,
                  elementAlignment: 'auto',
                  right: 15,
                },
                style: {
                  fontSize: 20,
                },
              },
              tablet: {
                position: {
                  left: 24.18,
                  elementAlignment: 'auto',
                  bottom: 32.74,
                },
                style: {
                  fontSize: 30,
                },
              },
            },
            position: {
              left: 29.43,
              bottom: 32.66,
              elementAlignment: 'auto',
            },
            disabled: false,
            content: 'Părinții\nAndreea și Patrick',
            type: ElementType.Text,
            style: {
              fontFamily: 'Allura',
              fontWeight: '500',
              textAlign: 'center',
              fontSize: 35,
            },
          },
          {
            position: {
              right: 29.44,
              bottom: 18.87,
              elementAlignment: 'auto',
            },
            content: 'Nașii\nMaria și Cristi',
            type: ElementType.Text,
            id: 'element-f55f8b9e-e4fd-4502-9d96-4806695b63b6',
            name: 'Nume nași',
            responsive: {
              tablet: {
                style: {
                  fontSize: 30,
                },
                position: {
                  right: 28.56,
                  elementAlignment: 'auto',
                  bottom: 15.77,
                },
              },
              mobile: {
                style: {
                  fontSize: 20,
                },
                position: {
                  elementAlignment: 'auto',
                  left: 15,
                  bottom: 10.35,
                },
              },
            },
            style: {
              fontSize: 35,
              textAlign: 'center',
              fontWeight: '500',
              fontFamily: 'Allura',
            },
            disabled: false,
          },
          {
            disabled: false,
            blobName: 'blob_2',
            style: {
              color: '#ffffff',
              width: 100,
            },
            position: {
              elementAlignment: 'center',
              left: 0,
              bottom: 0,
            },
            responsive: {},
            name: 'Blob',
            id: 'element-bfb105c0-d1cc-4429-96ae-4ead8431d049',
            type: ElementType.Blob,
          },
        ],
        backgroundImage: {
          opacity: 'rgba(0,0,0,0.05)',
          url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_12.png',
          name: 'Demo Image',
        },
        type: ElementType.Section,
        disabled: false,
        position: {
          elementAlignment: 'auto',
        },
        style: {
          zIndex: 1,
          backgroundColor: '#ffffff',
          height: 1200,
        },
        id: 'section-main-details',
        name: 'Detalii eveniment',
      },
      {
        id: 'section-efe49894-d5f0-46c8-85cd-e397885c1f57',
        style: {
          backgroundColor: '#ffffff',
          height: 'auto',
          justifyContent: 'center',
        },
        elements: [
          {
            disabled: false,
            id: 'element-3d453429-e631-4fdb-8dd8-b1c2f1d8d72a',
            buttonStyle: {
              color: '#0a0b02',
              backgroundColor: '#f5deb0',
            },
            style: {
              width: 100,
            },
            responsive: {},
            name: 'Locatii Eveniment',
            timeStyle: {
              color: '#4a5565',
            },
            dateStyle: {
              color: '#1e2939',
            },
            type: ElementType.locationsElement,
            titleStyle: {
              color: '#364153',
            },
            addressStyle: {
              color: '#4a5565',
            },
            borderStyles: {
              sides: 'none none none none',
              size: '1',
              color: '#1677ff',
            },
            position: { elementAlignment: 'auto' },
          },
        ],
        type: ElementType.LocationsSection,
        position: {
          elementAlignment: 'auto',
        },
        responsive: {},
        name: 'Sectiune Locatii',
        disabled: false,
      },
      {
        style: {
          justifyContent: 'center',
          height: 'auto',
        },
        elements: [
          {
            disabled: false,
            id: 'element-75610eef-09c9-47d2-80b7-78f361408bc7',
            name: 'RSVP',
            position: {
              elementAlignment: 'auto',
              left: 0,
            },
            style: {
              zIndex: 3,
              fontSize: 16,
              color: '#ffffff',
            },
            responsive: {
              mobile: {
                style: {
                  fontSize: 14,
                },
                position: {
                  elementAlignment: 'auto',
                  left: 0,
                },
              },
            },
            type: ElementType.RSVP_ELEMENT,
          },
        ],
        name: 'Sectiune RSVP',
        position: {
          elementAlignment: 'auto',
        },
        id: 'section-rsvp',
        disabled: false,
        type: ElementType.RSVP_SECTION,
        backgroundImage: {
          name: 'Demo Image',
          opacity: 'rgba(0,0,0,0)',
          url: '/templates_images/bapthism/bapthism_t_1/bapthism_t_1_13.png',
        },
        responsive: {},
      },
    ],
    templateId: 'template-bapthism-1',
    type: 'bapthism',
    userId: 'template-bapthism-1',
  },
  {
    name: 'Prima Poveste Dulce',
    templateId: 'template-bapthism-2',
    eventDate: 'template-bapthism-2',
    type: 'bapthism',
    userId: 'template-bapthism-2',
    description:
      'O invitație digitală adorabilă și plină de farmec, ce introduce oaspeții într-o lume de dulceață și inocență. Cu un design vesel și elemente grafice jucăușe, este alegerea perfectă pentru a anunța botezul într-un mod cald, personal și absolut încântător.',
    eventId: '344e36c8-8dcf-4927-9ff3-f8c15dbb9ad4',
    thumbnailUrl:
      '/templates_images/bapthism/bapthism_t_2/template_2_thumbnail.svg',
    elements: [
      {
        type: ElementType.Section,
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        position: {
          elementAlignment: 'auto',
          left: 0,
        },
        name: 'Header',
        style: {
          backgroundColor: '#fbcbcb80',
          height: 1200,
          zIndex: 2,
        },
        disabled: false,
        id: 'section-header',
        elements: [
          {
            responsive: {
              tablet: {
                style: {
                  height: 450,
                  width: 480,
                },
                position: {
                  right: 14.71,
                  elementAlignment: 'center',
                  bottom: 21.06,
                },
              },
              mobile: {
                style: {
                  borderRadius: 25,
                  height: 350,
                  width: 320,
                },
                position: {
                  elementAlignment: 'center',
                  bottom: 23.24,
                  left: 3.89,
                },
              },
            },
            disabled: false,
            style: {
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: 650,
              width: 685,
              borderRadius: 25,
            },
            position: {
              elementAlignment: 'center',
              bottom: 19.58,
              left: 14.77,
            },
            type: ElementType.Image,
            borderStyles: {
              size: '1',
              sides: 'none none none none',
              color: '#1677ff',
            },
            id: 'element-5d509536-286b-4569-bb33-15355fc0d7bc',
            backgroundImage: {
              name: 'Demo image',
              url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_1.png',
              opacity: 'rgba(0,0,0,0)',
            },
            name: 'Imagine ',
          },
          {
            position: {
              top: 0,
              left: 0,
              elementAlignment: 'center',
            },
            name: 'Blob',
            id: 'element-63c49a46-abed-404d-8541-c795bf36d907',
            disabled: false,
            type: ElementType.Blob,
            responsive: {},
            style: {
              width: 100,
              color: '#fbcbcb99',
            },
            blobName: 'blob_6',
          },
          {
            type: ElementType.Text,
            name: 'Nume copil, Când',
            position: {
              top: 11.85,
              left: 32.82,
              elementAlignment: 'center',
            },
            style: {
              color: '#000000',
              fontWeight: '500',
              fontFamily: 'Allura',
              fontSize: 50,
              textShadow: '1 #000000',
              textAlign: 'center',
            },
            id: 'element-9f7e0a2c-5461-4ad8-adf6-3ff758f09210',
            disabled: false,
            content: 'Daria\n21 Iulie 2025',
            responsive: {
              tablet: {
                style: {
                  fontSize: 35,
                },
                position: {
                  left: 31.81,
                  top: 12.17,
                  elementAlignment: 'center',
                },
              },
              mobile: {
                style: {
                  fontSize: 30,
                },
                position: {
                  top: 10.24,
                  right: 24.16,
                  elementAlignment: 'center',
                },
              },
            },
          },
          {
            id: 'element-80156d2e-3187-4d7c-8608-4d9e1650fb4b',
            responsive: {
              tablet: {
                style: {
                  fontSize: 25,
                },
              },
              mobile: {
                style: {
                  fontSize: 20,
                },
                position: {
                  left: 23.09,
                  elementAlignment: 'center',
                  bottom: 13.86,
                },
              },
            },
            disabled: false,
            position: {
              bottom: 11.7,
              elementAlignment: 'center',
              left: 31.49,
            },
            type: ElementType.Countdown,
            style: {
              textShadow: '1 #000000',
              fontFamily: 'Allura',
              fontSize: 35,
              color: '#000000',
            },
            name: 'Numaratoare inversa',
          },
          {
            disabled: false,
            position: {
              elementAlignment: 'auto',
              left: 11.07,
              top: 17.05,
            },
            type: ElementType.Image,
            style: {
              height: 75,
              backgroundRepeat: 'no-repeat',
              borderRadius: 0,
              backgroundSize: 'cover',
              width: 75,
            },
            borderStyles: {
              color: '#1677ff',
              size: '1',
              sides: 'none none none none',
            },
            backgroundImage: {
              opacity: 'rgba(0,0,0,0)',
              name: 'Demo Image',
              url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_2.png',
            },
            name: 'Imagine inimă',
            id: 'element-f91782de-1381-4f43-aeb1-771239341082',
            responsive: {
              tablet: {
                style: {
                  height: 60,
                  width: 60,
                },
                position: {
                  left: 14.66,
                  elementAlignment: 'auto',
                  top: 17.55,
                },
              },
              mobile: {
                style: {
                  width: 50,
                  height: 50,
                },
                position: {
                  elementAlignment: 'self-start',
                  left: 2.54,
                  top: 14,
                },
              },
            },
          },
          {
            id: 'element-b6e82d91-4831-48bf-8143-5524d27ce6ed',
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
            disabled: false,
            name: 'Imagine inimă',
            backgroundImage: {
              url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_2.png',
              opacity: 'rgba(0,0,0,0)',
              name: 'Demo Image',
            },
            position: {
              top: 17.23,
              right: 11.07,
              elementAlignment: 'auto',
            },
            type: ElementType.Image,
            responsive: {
              mobile: {
                position: {
                  top: 14,
                  elementAlignment: 'self-end',
                  left: 42.06,
                },
                style: {
                  height: 50,
                  width: 50,
                },
              },
              tablet: {
                style: {
                  width: 60,
                  height: 60,
                },
                position: {
                  elementAlignment: 'auto',
                  right: 14.66,
                  top: 17.47,
                },
              },
            },
            style: {
              height: 75,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              borderRadius: 0,
              width: 75,
            },
          },
          {
            id: 'element-eb49d6ad-652f-4f07-add7-9cc803ca812d',
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
            responsive: {
              tablet: {
                style: {
                  width: 60,
                  height: 60,
                },
              },
              mobile: {
                style: {
                  width: 50,
                  height: 50,
                },
                position: {
                  right: 42.8,
                  bottom: 3.17,
                  elementAlignment: 'center',
                },
              },
            },
            disabled: false,
            name: 'Imagine drum',
            position: {
              bottom: 2.69,
              right: 45.74,
              elementAlignment: 'center',
            },
            type: ElementType.Image,
            backgroundImage: {
              name: 'Demo Image',
              opacity: 'rgba(0,0,0,0)',
              url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_4.png',
            },
            style: {
              backgroundRepeat: 'no-repeat',
              width: 75,
              borderRadius: 0,
              height: 75,
              backgroundSize: 'cover',
            },
          },
        ],
      },
      {
        id: 'section-main-details',
        position: {
          elementAlignment: 'auto',
        },
        type: ElementType.Section,
        disabled: false,
        responsive: {
          mobile: {
            style: {
              height: 700,
            },
          },
          tablet: {
            style: {
              height: 850,
            },
          },
        },
        style: {
          zIndex: 1,
          height: 1200,
          backgroundColor: '#fbcbcb80',
        },
        elements: [
          {
            backgroundImage: {
              opacity: 'rgba(0,0,0,0)',
              name: 'Demo Image',
              url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_5.png',
            },
            style: {
              height: 550,
              backgroundSize: 'cover',
              borderRadius: 50,
              backgroundRepeat: 'no-repeat',
              width: 520,
            },
            responsive: {
              mobile: {
                style: {
                  width: 300,
                  height: 300,
                  borderRadius: 50,
                },
                position: {
                  elementAlignment: 'center',
                  left: 6.77,
                  bottom: 27.65,
                },
              },
              tablet: {
                position: {
                  elementAlignment: 'center',
                  right: 20.45,
                  top: 21.04,
                },
                style: {
                  height: 380,
                  width: 380,
                },
              },
            },
            disabled: false,
            borderStyles: {
              color: '#1677ff',
              sides: 'none none none none',
              size: '1',
            },
            position: {
              right: 20.45,
              top: 21.04,
              elementAlignment: 'center',
            },
            type: ElementType.Image,
            name: 'Imagine',
            id: 'element-d732944e-88a5-41c7-a3ce-f871bea6dc00',
          },
          {
            id: 'element-c5d91006-177f-49e9-92c1-007a047a7d2a',
            position: {
              left: 0,
              top: 2,
              elementAlignment: 'center',
            },
            content:
              'Sunt mic, dar deja am un drum important de parcurs!\nVă aștept cu nerăbdare să călătorim împreună pe acest drum magic!',
            style: {
              textAlign: 'center',
              fontSize: 40,
              fontWeight: '500',
              textShadow: '1 #000000',
              fontFamily: 'Allura',
            },
            disabled: false,
            name: 'Mesaj',
            responsive: {
              tablet: {
                style: {
                  fontSize: 30,
                },
              },
              mobile: {
                position: {
                  left: 0,
                  elementAlignment: 'auto',
                  top: 2.99,
                },
                style: {
                  fontWeight: '500',
                  fontSize: 25,
                },
              },
            },
            type: ElementType.Text,
          },
          {
            style: {
              color: '#fbcbcbe6',
              width: 100,
            },
            id: 'element-34d36b14-f398-4519-a581-38c06c9b8671',
            name: 'Blob',
            responsive: {},
            disabled: false,
            type: ElementType.Blob,
            position: {
              elementAlignment: 'center',
              bottom: 0,
              left: 0,
            },
            blobName: 'blob_1',
          },
          {
            style: {
              fontSize: 30,
              fontWeight: '500',
              textAlign: 'center',
              fontFamily: 'Allura',
            },
            content: 'Părinții\nLavinia și Tudor',
            id: 'element-154e0c1f-b9ee-4a86-ad57-c3f8f1580dcf',
            name: 'Nume părinți',
            position: {
              elementAlignment: 'auto',
              bottom: 20.07,
              right: 7,
            },
            disabled: false,
            responsive: {
              tablet: {
                position: {
                  bottom: 17,
                  elementAlignment: 'auto',
                  right: 8,
                },
                style: {
                  fontSize: 25,
                },
              },
              mobile: {
                position: {
                  bottom: 14.4,
                  elementAlignment: 'self-start',
                  left: 2.77,
                },
                style: {
                  textAlign: 'center',
                  fontSize: 25,
                },
              },
            },
            type: ElementType.Text,
          },
          {
            name: 'Nume nași',
            content: 'Nașii\nMihaela și Ștefan',
            type: ElementType.Text,
            style: {
              fontSize: 30,
              fontWeight: '500',
              fontFamily: 'Allura',
              textAlign: 'center',
            },
            position: {
              left: 7,
              elementAlignment: 'auto',
              bottom: 24.88,
            },
            id: 'element-2d9e7805-b14b-472d-92aa-dc31019dd399',
            responsive: {
              tablet: {
                style: {
                  fontSize: 25,
                },
                position: {
                  elementAlignment: 'auto',
                  bottom: 21.12,
                  left: 8,
                },
              },
              mobile: {
                style: {
                  fontSize: 25,
                  textAlign: 'center',
                },
                position: {
                  elementAlignment: 'self-end',
                  right: 2.77,
                  bottom: 7.35,
                },
              },
            },
            disabled: false,
          },
        ],
        name: 'Detalii eveniment',
      },
      {
        style: {
          justifyContent: 'center',
          backgroundColor: '#fbcbcbe6',
          height: 'auto',
        },
        responsive: {},
        position: {
          elementAlignment: 'auto',
        },
        elements: [
          {
            disabled: false,
            borderStyles: {
              sides: 'none none none none',
              color: '#1677ff',
              size: '1',
            },
            titleStyle: {
              color: '#364153',
            },
            type: ElementType.locationsElement,
            style: {
              width: 100,
            },
            addressStyle: {
              color: '#4a5565',
            },
            timeStyle: {
              color: '#4a5565',
            },
            id: 'element-f1232a13-3b65-48a4-afc2-c9340843a888',
            position: { elementAlignment: 'auto' },
            buttonStyle: {
              backgroundColor: '#df7eb296',
              color: '#7b1b46',
            },
            name: 'Locatii Eveniment',
            dateStyle: {
              color: '#1e2939',
            },
            responsive: {
              mobile: {
                borderStyles: {
                  color: '#000000',
                  size: '2',
                  sides: 'solid solid solid solid',
                },
                style: {
                  borderRadius: 50,
                },
              },
            },
          },
        ],
        type: ElementType.LocationsSection,
        disabled: false,
        id: 'section-1a5dcba1-5ccb-4c41-a54f-7f5fed9dae38',
        name: 'Sectiune Locatii',
      },
      {
        backgroundImage: {
          url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_6.png',
          name: 'Demo Image',
          opacity: '#ffffff',
        },
        type: ElementType.RSVP_SECTION,
        responsive: {},
        id: 'section-rsvp',
        style: {
          backgroundColor: '#ffffff',
          justifyContent: 'center',
          height: 'auto',
        },
        elements: [
          {
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
            id: 'element-75610eef-09c9-47d2-80b7-78f361408bc7',
            name: 'RSVP',
            style: {
              zIndex: 3,
              fontSize: 16,
              color: '#ffffff',
            },
          },
        ],
        name: 'Sectiune RSVP',
        disabled: false,
        position: {
          elementAlignment: 'auto',
        },
      },
    ],
    settings: {
      eventActive: true,
      eventAditionalQuestions: [],
      aditionalLocations: [
        {
          formatted_address: 'Calea Șerban Vodă 29, București 030167',
          locationStartTime: '18:00',
          title: 'Taina botezului',
          location: {
            long: '26.1033748',
            lat: '44.42387039999999',
          },
          name: 'Biserica Sfântul Spiridon-Nou',
          locationImage: {
            name: 'Demo Image',
            url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_7.png',
          },
          locationId: 'a62eb1a5-6864-456d-85f9-56e80e910789',
        },
      ],
      eventLocation: {
        name: 'Reina Events',
        title: 'Petrecerea micuțului',
        locationId: '11a83e14-add5-48a0-bd07-a6430784a556',
        formatted_address:
          'Strada Locotenent Nicolae Pascu 81, București 077160',
        locationStartTime: '18:00',
        location: {
          lat: '44.4093253',
          long: '26.1514274',
        },
        locationImage: {
          url: '/templates_images/bapthism/bapthism_t_2/bapthism_t_2_8.png',
          name: 'Demo Image',
        },
      },
      backgroundColor: '#f8f0e8',
    },
  },
];

export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.templateId === id);
};
