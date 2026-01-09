'use client';

import { useRouter } from 'next/navigation';
import './style.css';
import { Button } from 'antd';
import { Features } from '../(home)/components/features/Features';
import PricesSection from '../(home)/components/prices/PricesSection';
import AnimatedContent from '@/components/animatedContainer/AnimatedContent';
import {
  ExportOutlined,
  EditOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  LineChartOutlined,
  CheckOutlined,
  MobileOutlined,
  UserSwitchOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import FaqSection from '../(home)/components/faqSection/FaqSection';
import CategorySection from '../(home)/components/categorySection/CategorySection';

const MAJORAT_FEATURES_DATA = [
  {
    title: 'Gestionare RSVP în timp real',
    content:
      'Monitorizează lista de invitați și primește confirmările de participare instantaneu. Gestionează răspunsurile prietenilor pe măsură ce sunt trimise, direct din platformă.',
    srcImage: '/landing_images/videos/feat_responses_v2.mp4',
  },
  {
    title: 'Statistici privind participarea',
    content:
      'Vizualizează rapid numărul de persoane confirmate și alte detalii relevante pentru a planifica corect logistica petrecerii tale de 18 ani.',
    srcImage: '/landing_images/videos/feat_statistics_v3.mp4',
  },
  {
    title: 'Organizarea planului de mese',
    content:
      'Gestionează eficient așezarea la mese a invitaților. Planificatorul nostru îți permite să organizezi grupurile de prieteni pentru a asigura o atmosferă plăcută.',
    srcImage: '/landing_images/videos/feat_tables.mp4',
  },
  {
    title: 'Editor Drag & Drop personalizabil',
    content:
      'Personalizează designul invitației tale într-un mod simplu. Poți repoziționa elementele, schimba culorile și fonturile, astfel încât rezultatul final să fie exact așa cum l-ai planificat.',
    srcImage: '/landing_images/videos/feat_editor.mp4',
  },
];

const MAJORAT_GRID_ITEMS = [
  {
    label: 'Exportă lista de invitați rapid',
    icon: <ExportOutlined />,
  },
  {
    label: 'Personalizare vizuală completă',
    icon: <EditOutlined />,
  },
  {
    label: 'Planificator de buget inclus',
    icon: <TableOutlined />,
  },
  {
    label: 'Adaugă întrebări despre meniu',
    icon: <QuestionCircleOutlined />,
  },
  {
    label: 'Harta locației prin Google Maps',
    icon: <EnvironmentOutlined />,
  },
  {
    label: 'Gestionează grupurile de prieteni',
    icon: <UserSwitchOutlined />,
  },
  {
    label: 'Statistici detaliate eveniment',
    icon: <LineChartOutlined />,
  },
  {
    label: 'Confirmări RSVP pe WhatsApp',
    icon: <CheckOutlined />,
  },
  {
    label: 'Accesibil de pe orice dispozitiv',
    icon: <MobileOutlined />,
  },
];

const checkmark = (
  <span style={{ color: '#a259ff', fontWeight: 'bold' }}>{'\u2713'}</span>
);
const redX = (
  <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{'\u2717'}</span>
);

const MAJORAT_PRICE_DATA = [
  {
    key: '1',
    functionalitati: 'Personalizare intuitivă a invitației de majorat',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '2',
    functionalitati: 'Organizarea digitală a planului de mese',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '3',
    functionalitati: 'Numărătoare inversă până la petrecere',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '4',
    functionalitati: 'Gestionarea listei de prieteni la mese',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '5',
    functionalitati: 'Formular RSVP online (Confirmări/Refuzuri)',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '6',
    functionalitati: 'Plată unică',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '7',
    functionalitati: 'Statistici prezență (Confirmări live)',
    basic: redX,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '8',
    functionalitati: 'Distribuire rapidă pe WhatsApp și Social Media',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '9',
    functionalitati: 'Monitorizare răspunsuri în timp real',
    basic: redX,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '10',
    functionalitati: 'Export listă invitați în format Excel',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '11',
    functionalitati: 'Export plan locație (Format PDF)',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '15',
    functionalitati: 'Export listă acces poartă/intrare (PDF)',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '12',
    functionalitati: 'Checklist organizare (În curând)',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '13',
    functionalitati: 'Planificator avansat pentru majorat',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '14',
    functionalitati: 'Suport tehnic prioritar',
    basic: redX,
    premium: checkmark,
    ultimate: checkmark,
  },
];

const MAJORAT_FAQ = [
  {
    question: 'Cum aflu cine a confirmat participarea la majorat?',
    answer:
      'Toate confirmările sunt centralizate într-un dashboard dedicat. Veți putea vizualiza în timp real lista participanților și răspunsurile acestora la întrebările suplimentare.',
  },
  {
    question: 'Pot folosi invitația și pentru a oferi locația exactă pe hartă?',
    answer:
      'Da, invitațiile includ integrare cu Google Maps. Invitații pot accesa butonul de locație pentru a primi instrucțiuni de navigare direct către locul petrecerii.',
  },
  {
    question:
      'Se poate exporta lista de invitați pentru a o da la intrarea în club?',
    answer:
      'În pachetul Ultimate, aveți opțiunea de a exporta lista completă de confirmări în format Excel sau PDF, facilitând controlul accesului la eveniment.',
  },
  {
    question: 'Funcționează corect pe orice tip de smartphone?',
    answer:
      'Invitațiile sunt complet responsive, ceea ce înseamnă că se vor adapta automat și vor arăta impecabil pe orice dispozitiv (iOS, Android) sau browser.',
  },
];

const WeddingInvitationsPage = () => {
  const router = useRouter();
  return (
    <div className="landing-wedding overflow-hidden">
      <div className=" hero-section relative inset-0 min-h-[100dvh]">
        <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto mt-[50px] lg:mt-0">
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={true}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            classNamme="flex flex-col justify-center items-center p-6"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-[var(--secondary-color)]">
              Organizează-ți majoratul cu o invitație digitală completă
            </h1>
            <p className="text-lg lg:text-xl text-center mb-6 text-gray-500">
              Configurează invitația de majorat și trimite link-ul prin WhatsApp
              în câteva minute. Gestionează confirmările RSVP automat și ai
              lista finală de invitați mereu la îndemână.
            </p>
            <Button
              onClick={() => router.push('/dashboard')}
              type="primary"
              size="large"
              className="try-button !p-8 !text-xl !font-bold !rounded-full !text-white"
            >
              Creează-ți Invitația Acum
            </Button>
          </AnimatedContent>
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            classNamme="flex items-center justify-center p-6"
          >
            <img
              src="/templates_images/anniversary/anniversary_t_2/template_2_thumbnail.png"
              alt="Sample Anniversary Invitation"
              className="max-w-full max-h-[50vh] lg:max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </AnimatedContent>
        </div>
      </div>
      <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      <Features
        smallTitle="INVITAȚIE MAJORAT"
        mainTitle="Funcții dedicate pentru petrecerea ta de 18 ani"
        featuresData={MAJORAT_FEATURES_DATA}
        gridItems={MAJORAT_GRID_ITEMS}
      />
      <CategorySection type="anniversary" limit={3} />
      <PricesSection
        dataSource={MAJORAT_PRICE_DATA}
        smallHeader="OFERTE MAJORAT"
        primaryTitle="Pachete accesibile pentru majoratul tău"
      />
      <FaqSection items={MAJORAT_FAQ} />
    </div>
  );
};
export default WeddingInvitationsPage;
