import '../../styles/globals.css';
import ConceptSection from './components/concept/ConceptSection';
import { Features } from './components/features/Features';
import HowItWorksSection from './components/howItWorks/HowItWorksSection';
import LandingSection from './components/landing/LandingSection';
import Models from './components/models/Models';
import PricesSection from './components/prices/PricesSection';
import Planner from './components/planner/Planner';
import Analytics from './components/analytics/Analytics';
import {
  ExportOutlined,
  EditOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  EnvironmentOutlined,
  UserSwitchOutlined,
  LineChartOutlined,
  CheckOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import FaqSection from './components/faqSection/FaqSection';

const LANDING_FEATURES = [
  {
    title: 'Management RSVP Digital',
    content:
      'Centralizați confirmările de prezență într-o bază de date securizată. Sistemul colectează automat preferințele participanților și oferă o evidență clară a listei de invitați.',
    srcImage: '/landing_images/videos/feat_responses_v2.mp4',
  },
  {
    title: 'Monitorizare și Statistici',
    content:
      'Accesați rapoarte detaliate privind statusul evenimentului. Vizualizați în timp real rata de confirmare, distribuția pe categorii de invitați și opțiunile logistice selectate.',
    srcImage: '/landing_images/videos/feat_statistics_v3.mp4',
  },
  {
    title: 'Planificator Logistic Mese',
    content:
      'Configurați structura locației și gestionați așezarea invitaților la mese. Instrumentul permite optimizarea spațiului și exportul planului pentru echipa de organizare.',
    srcImage: '/landing_images/videos/feat_tables.mp4',
  },
  {
    title: 'Editor Vizual Dinamic',
    content:
      'Personalizați layout-ul invitației prin tehnologia Drag & Drop. Aveți control total asupra elementelor grafice, tipografiei și ierarhiei vizuale pentru un rezultat profesional.',
    srcImage: '/landing_images/videos/feat_editor.mp4',
  },
];

const LANDING_GRID_ITEMS = [
  {
    label: 'Export date logistice (PDF/Excel)',
    icon: <ExportOutlined />,
  },
  {
    label: 'Personalizare vizuală avansată',
    icon: <EditOutlined />,
  },
  {
    label: 'Instrumente planificare eveniment',
    icon: <TableOutlined />,
  },
  {
    label: 'Câmpuri RSVP personalizabile',
    icon: <QuestionCircleOutlined />,
  },
  {
    label: 'Integrare locație Google Maps',
    icon: <EnvironmentOutlined />,
  },
  {
    label: 'Management grupuri de invitați',
    icon: <UserSwitchOutlined />,
  },
  {
    label: 'Dashboard statistici în timp real',
    icon: <LineChartOutlined />,
  },
  {
    label: 'Confirmare automată RSVP',
    icon: <CheckOutlined />,
  },
  {
    label: 'Interfață optimizată multi-dispozitiv',
    icon: <MobileOutlined />,
  },
];

const checkmark = (
  <span style={{ color: '#a259ff', fontWeight: 'bold' }}>{'\u2713'}</span>
);
const redX = (
  <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{'\u2717'}</span>
);

const LANDING_PRICING_TABLE = [
  {
    key: '1',
    functionalitati: 'Configurare invitație digitală eveniment',
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
    functionalitati: 'Contorizare timp până la eveniment',
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

const LANDING_FAQ = [
  {
    question:
      'Invitația digitală are o perioadă de valabilitate sau expiră după eveniment?',
    answer:
      'Da. Fiecare plan include o perioadă de valabilitate care acoperă procesul de creare, distribuție și gestionare a invitațiilor. Dupa aceasta perioada, datele se vor sterge automat pentru a proteja confidențialitatea invitaților.',
  },
  {
    question:
      'Pot folosi platforma pentru orice tip de eveniment sau pentru mai multe evenimente?',
    answer:
      'Da. Deși avem categorii dedicate pentru Nuntă, Botez și Majorat, editorul permite adaptarea oricărui model pentru orice tip de aniversare. Puteți gestiona mai multe evenimente din același cont, fiecare având pachetul său individual.',
  },
  {
    question:
      'Este necesar ca invitații să instaleze vreo aplicație sau să își creeze cont?',
    answer:
      'Nu. Procesul este simplificat: invitația este un link web (URL) care se deschide instantaneu în orice browser. Invitații confirmă prezența direct, fără nicio înregistrare prealabilă sau aplicație instalată.',
  },
  {
    question: 'Cum primesc datele despre confirmările RSVP?',
    answer:
      'Toate datele sunt salvate securizat în contul dumneavoastră. În funcție de pachetul ales, puteți monitoriza confirmările în timp real prin dashboard sau puteți descărca listele finale în format Excel.',
  },
  {
    question:
      'Ce se întâmplă dacă am nevoie de ajutor cu editorul sau configurarea?',
    answer:
      'Punem la dispoziție o secțiune de tutoriale accesibilă tuturor utilizatorilor. În plus, oferim asistență tehnică dedicată prin email pentru pachetele Premium și Ultimate, asigurându-ne că beneficiați de suportul necesar pe tot parcursul procesului.',
  },
  {
    question: 'Invitația funcționează corect pe orice dispozitiv?',
    answer:
      'Da. Platforma este optimizată multi-dispozitiv, ceea ce înseamnă că invitația se va adapta automat și va arăta impecabil pe orice smartphone (iOS/Android), tabletă sau calculator.',
  },
];

const Home = () => {
  return (
    <>
      <Analytics />
      <LandingSection />
      <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      <Features
        featuresData={LANDING_FEATURES}
        gridItems={LANDING_GRID_ITEMS}
      />
      <Planner />
      <HowItWorksSection />
      <ConceptSection />
      <PricesSection dataSource={LANDING_PRICING_TABLE} />
      <Models />
      <FaqSection items={LANDING_FAQ} />
    </>
  );
};

export default Home;
