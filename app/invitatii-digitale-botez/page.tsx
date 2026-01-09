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

const BOTEZ_FEATURES_DATA = [
  {
    title: 'Confirmări RSVP Botez',
    content:
      'Monitorizați lista de invitați și primiți confirmările de participare în timp real, cu detalii despre numărul de adulți și copii.',
    srcImage: '/landing_images/videos/feat_responses_v2.mp4',
  },
  {
    title: 'Statistici invitați în timp real',
    content:
      'Vizualizează rapid numărul total de confirmări și preferințele invitaților pentru a lua decizii informate privind meniul de botez.',
    srcImage: '/landing_images/videos/feat_statistics_v3.mp4',
  },
  {
    title: 'Așezare la mese pentru familie',
    content:
      'Proiectați configurația salonului și gestionați așezarea invitaților la mese pentru o coordonare logistică fără erori.',
    srcImage: '/landing_images/videos/feat_tables.mp4',
  },
  {
    title: 'Editor Invitație Botez avansat',
    content:
      'Creează invitația perfectă fără efort. Trage și plasează pozele bebelușului, adaugă elemente grafice noi și schimbă culorile cu un singur click.',
    srcImage: '/landing_images/videos/feat_editor.mp4',
  },
];

const BOTEZ_GRID_ITEMS = [
  {
    label: 'Exportă lista de invitați pentru botez',
    icon: <ExportOutlined />,
  },
  {
    label: 'Design unic cu poza bebelușului',
    icon: <EditOutlined />,
  },
  {
    label: 'Planificator de buget inclus',
    icon: <TableOutlined />,
  },
  {
    label: 'Opțiuni meniu (copii/adulți)',
    icon: <QuestionCircleOutlined />,
  },
  {
    label: 'Harta bisericii și a restaurantului',
    icon: <EnvironmentOutlined />,
  },
  {
    label: 'Gestionează familiile invitate',
    icon: <UserSwitchOutlined />,
  },
  {
    label: 'Statistici privind confirmările live',
    icon: <LineChartOutlined />,
  },
  {
    label: 'Sistem RSVP automat pe WhatsApp',
    icon: <CheckOutlined />,
  },
  {
    label: 'Accesibil rapid de pe telefon',
    icon: <MobileOutlined />,
  },
];

const checkmark = (
  <span style={{ color: '#a259ff', fontWeight: 'bold' }}>{'\u2713'}</span>
);
const redX = (
  <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{'\u2717'}</span>
);

const BOTEZ_PRICE_DATA = [
  {
    key: '1',
    functionalitati: 'Configurare invitație digitală botez',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '2',
    functionalitati: 'Instrument organizare logistică mese',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '3',
    functionalitati: 'Contorizare timp până la ceremonie',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '4',
    functionalitati: 'Sistem distribuție invitați pe categorii',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '5',
    functionalitati: 'Interfață RSVP pentru confirmare prezență',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '6',
    functionalitati: 'Acces securizat (Plată finală)',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '7',
    functionalitati: 'Statistici centralizate confirmări/refuzuri',
    basic: redX,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '8',
    functionalitati: 'Opțiuni partajare link invitație',
    basic: checkmark,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '9',
    functionalitati: 'Acces imediat la datele participanților',
    basic: redX,
    premium: checkmark,
    ultimate: checkmark,
  },
  {
    key: '10',
    functionalitati: 'Descărcare listă finală format Excel',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '11',
    functionalitati: 'Document PDF cu planul locației',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '15',
    functionalitati: 'Generare listă prezență format PDF',
    basic: redX,
    premium: redX,
    ultimate: checkmark,
  },
  {
    key: '14',
    functionalitati: 'Asistență tehnică pentru utilizatori',
    basic: redX,
    premium: checkmark,
    ultimate: checkmark,
  },
];

const BOTEZ_FAQ = [
  {
    question: 'Pot adăuga fotografia bebelușului în invitație?',
    answer:
      'Da, majoritatea modelelor noastre sunt concepute pentru a include una sau mai multe fotografii. Editorul de tip drag-and-drop vă permite să încărcați și să poziționați imaginea dorită simplu și rapid.',
  },
  {
    question: 'Sistemul RSVP permite selectarea meniului pentru copii?',
    answer:
      'Da, formularul poate fi configurat pentru a colecta date specifice, precum și detalii despre eventuale restricții alimentare.',
  },
  {
    question: 'Cât timp rămâne activă invitația digitală?',
    answer: 'Invitația rămâne activă pe perioada specificată în pachetul ales.',
  },
  {
    question:
      'Este greu de utilizat editorul pentru cineva fără experiență în design?',
    answer:
      'Nu. Platforma a fost creată pentru a fi intuitivă. Modificarea textelor, culorilor și fotografiilor se face prin selecție directă, fără a necesita cunoștințe tehnice.',
  },
];

const WeddingInvitationsPage = () => {
  const router = useRouter();
  return (
    <div className="landing-wedding overflow-hidden">
      <div className=" hero-section relative inset-0 min-h-[100dvh] ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto mt-[50px] lg:mt-0">
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
              Sărbătoriți noul început cu o invitație digitală de botez
            </h1>
            <p className="text-lg lg:text-xl text-center mb-6 text-gray-500">
              Trimite invitația digitală de botez pe WhatsApp în 2 minute.
              Primești confirmările RSVP automat și scapi de tabele.
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
              src="/templates_images/bapthism/bapthism_t_2/template_2_thumbnail.png"
              alt="Sample Baptism Invitation"
              className="max-w-full max-h-[50vh] lg:max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </AnimatedContent>
        </div>
      </div>
      <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      <Features
        smallTitle="INVITAȚIE BOTEZ"
        mainTitle="Funcții dedicate pentru botezul copilului tău"
        featuresData={BOTEZ_FEATURES_DATA}
        gridItems={BOTEZ_GRID_ITEMS}
      />
      <CategorySection type="bapthism" limit={3} />
      <PricesSection
        smallHeader="OFERTE BOTEZ"
        primaryTitle="Prețuri și Pachete pentru Invitațiile de Botez"
        dataSource={BOTEZ_PRICE_DATA}
      />
      <FaqSection items={BOTEZ_FAQ} />
    </div>
  );
};
export default WeddingInvitationsPage;
