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
  EnvironmentOutlined,
  UserSwitchOutlined,
  LineChartOutlined,
  CheckOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import FaqSection from '../(home)/components/faqSection/FaqSection';
import CategorySection from '../(home)/components/categorySection/CategorySection';

const WeddingInvitationsPage = () => {
  const NUNTA_FEATURES_DATA = [
    {
      title: 'Confirmări RSVP Online',
      content:
        'Gestionează lista de invitați la nuntă fără stres. Primești confirmările instant, inclusiv detaliile despre meniuri speciale sau cazare, totul organizat automat.',
      srcImage: '/landing_images/videos/feat_responses_v2.mp4',
    },
    {
      title: 'Analiza participării mirilor',
      content:
        'Vizualizează statisticile nuntii tale în timp real: numărul de invitați confirmați, tipurile de meniu alese și statusul invitațiilor trimise.',
      srcImage: '/landing_images/videos/feat_statistics_v3.mp4',
    },
    {
      title: 'Planificator așezare la mese',
      content:
        'Organizează salonul de nuntă digital. Distribuie invitații la mese și vizualizează planul sălii pentru a asigura o atmosferă perfectă la petrecere.',
      srcImage: '/landing_images/videos/feat_tables.mp4',
    },
    {
      title: 'Editor Invitație de Nuntă',
      content:
        'Libertate totală de creație prin tehnologia Drag & Drop. Poziționează elementele oriunde dorești, alege fonturi premium și ajustează culorile pentru a se potrivi cu tematica nunții tale. Transformă orice șablon într-o operă de artă unică.',
      srcImage: '/landing_images/videos/feat_editor.mp4',
    },
  ];

  const NUNTA_GRID_ITEMS = [
    {
      label: 'Export plan salon/OPIS nuntă',
      icon: <ExportOutlined />,
    },
    {
      label: 'Personalizare vizuală completă',
      icon: <EditOutlined />,
    },
    {
      label: 'Planificator buget nuntă gratuit',
      icon: <TableOutlined />,
    },
    {
      label: 'Întrebări personalizate (Meniu/Cazare)',
      icon: <QuestionCircleOutlined />,
    },
    {
      label: 'Localizare Google Maps restaurant',
      icon: <EnvironmentOutlined />,
    },
    {
      label: 'Gestionează grupuri de invitați',
      icon: <UserSwitchOutlined />,
    },
    {
      label: 'Statistici avansate eveniment',
      icon: <LineChartOutlined />,
    },
    {
      label: 'Confirmare RSVP pe WhatsApp',
      icon: <CheckOutlined />,
    },
    {
      label: 'Format optimizat pentru mobile',
      icon: <MobileOutlined />,
    },
  ];

  const checkmark = (
    <span style={{ color: '#a259ff', fontWeight: 'bold' }}>{'\u2713'}</span>
  );
  const redX = (
    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{'\u2717'}</span>
  );

  const NUNTA_PRICE_DATA = [
    {
      key: '1',
      functionalitati: 'Personalizare premium a invitației de nuntă',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '2',
      functionalitati: 'Configurarea planului de mese al salonului',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '3',
      functionalitati: 'Countdown până la ziua nunții',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '4',
      functionalitati: 'Gestionarea așezării invitaților la mese',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '5',
      functionalitati: 'Formular RSVP cu detalii meniu și cazare',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '6',
      functionalitati: 'Acces nelimitat (Fără abonament)',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '7',
      functionalitati: 'Dashboard statistici pentru miri',
      basic: redX,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '8',
      functionalitati: 'Distribuire pe WhatsApp și canale social media',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '9',
      functionalitati: 'Vizualizare confirmări în timp real',
      basic: redX,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '10',
      functionalitati: 'Export bază de date invitați (Excel)',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '11',
      functionalitati: 'Export planul sălii în format PDF',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '15',
      functionalitati: 'Export Opis invitați pentru intrare (PDF)',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '12',
      functionalitati: 'Checklist organizare nuntă (În curând)',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '13',
      functionalitati: 'Planificator avansat pentru marele eveniment',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '14',
      functionalitati: 'Suport tehnic prioritar pentru miri',
      basic: redX,
      premium: checkmark,
      ultimate: checkmark,
    },
  ];

  const NUNTA_FAQ = [
    {
      question: 'Cum pot trimite invitația digitală invitaților mei?',
      answer:
        'După finalizarea personalizării, veți primi un link unic. Acesta poate fi distribuit prin WhatsApp, Messenger, E-mail sau orice altă platformă de mesagerie socială.',
    },
    {
      question: 'Invitații pot confirma prezența direct din invitație?',
      answer:
        'Da. Fiecare invitație include un formular RSVP integrat. Răspunsurile sunt salvate automat în contul dumneavoastră, unde puteți vedea cine a confirmat, cine a refuzat și ce opțiuni de meniu au ales.',
    },
    {
      question:
        'Pot modifica detaliile evenimentului după ce am trimis invitația?',
      answer:
        'Absolut. Orice modificare efectuată în editorul nostru se actualizează în timp real. Invitații care accesează link-ul vor vedea întotdeauna cea mai recentă variantă a invitației.',
    },
    {
      question: 'Există o limită de invitați sau de trimiteri?',
      answer:
        'Pentru varianta Basic, puteți trimite invitații pentru până la 30 de invitați. Variantele Premium și Ultimate permit un număr nelimitat de invitați.',
    },
  ];

  const router = useRouter();
  return (
    <div className="landing-wedding overflow-hidden">
      <div className=" hero-section relative inset-0">
        <div className="w-full h-[100dvh] grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto mt-[50px] lg:mt-0">
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
              Invitatii Digitale de Nuntă - Moderne, Rapide și Eco-friendly
            </h1>
            <p className="text-lg lg:text-xl text-center mb-6 text-gray-500">
              Creează o invitație digitală de nuntă și trimite-o pe WhatsApp în
              doar 2 minute. Gestionează automat fiecare confirmare RSVP online
              într-un mod inteligent, eliminând definitiv tabelele Excel și
              stresul organizării.
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
              src="/templates_images/wedding/wedding_t_4/template_4_thumbnail.png"
              alt="Sample Wedding Invitation"
              className="max-w-full max-h-[50vh] lg:max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </AnimatedContent>
        </div>
        <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      </div>
      <Features
        mainTitle="Tot ce ai nevoie pentru o nuntă modernă și organizată"
        smallTitle="INVITAȚII NUNTĂ"
        featuresData={NUNTA_FEATURES_DATA}
        gridItems={NUNTA_GRID_ITEMS}
      />
      <CategorySection type="wedding" limit={3} />
      <PricesSection
        smallHeader="PACHETE NUNTĂ"
        primaryTitle="Pachete accesibile pentru nunta ta"
        dataSource={NUNTA_PRICE_DATA}
      />
      <FaqSection items={NUNTA_FAQ} />
    </div>
  );
};
export default WeddingInvitationsPage;
