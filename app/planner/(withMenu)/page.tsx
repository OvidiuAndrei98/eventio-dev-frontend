'use client';

import React from 'react';
import {
  WhatsAppOutlined,
  DesktopOutlined,
  TableOutlined,
  CalendarOutlined,
  DollarOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import PlannerThumnbnail from '@/public/thumbnails/planner-thumbnail.png';
import Image from 'next/image';
import './styles.css';
import AnimatedContent from '@/components/animatedContainer/AnimatedContent';
import { Button } from 'antd';
import Link from 'next/link';
import { plannerCheckout } from '@/service/stripe/plannerCheckout';
import { PLANYVITE_DIGITAL_PLANNER } from '@/lib/planyviteEventPlanTiers';
import { trackTikTokEvent } from '@/lib/tik-tok/tiktok-events';

const features = [
  {
    icon: <CalendarOutlined className="text-2xl text-[#A80050]" />,
    title: 'Calendar de Planificare',
    description:
      'Vezi pașii esențiali și ordinea lor pentru organizarea nunții.',
  },
  {
    icon: <ReadOutlined className="text-2xl text-[#A80050]" />,
    title: 'Ghidul Mirilor',
    description: 'Sfaturi utile și indicații pentru o organizare eficientă.',
  },
  {
    icon: <DollarOutlined className="text-2xl text-[#A80050]" />,
    title: 'Cheltuieli',
    description: 'Află ce cheltuieli implică nunta și cum să le gestionezi.',
  },
  {
    icon: <WhatsAppOutlined className="text-2xl text-[#25D366]" />,
    title: 'Servicii și Furnizori',
    description:
      'Îți poți crea o listă de oferte pentru fiecare tip de furnizor, având astfel posibilitatea de a alege cea mai bună variantă.',
  },
  {
    icon: <DesktopOutlined className="text-2xl text-[#A80050]" />,
    title: 'Raportul de Cheltuieli',
    description:
      'Îți oferă o imagine clară a cheltuielilor. Poți vedea exact ce ai cheltuit și pe ce, atât pe categorii, cât și suma alocată din bugetul total.',
  },
  {
    icon: <TableOutlined className="text-2xl text-[#A80050]" />,
    title: 'Cea Mai Avantajoasă Ofertă',
    description:
      'Pe baza listei de oferte pe care ai creat-o, planificatorul îți va afișa automat cea mai ieftină/avantajoasă ofertă.',
  },
];

export default function PlannerPage() {
  return (
    <main className="min-h-screen bg-white mt-[64px]">
      {/* Header */}
      <section
        className="planner-hero-section max-w-full mx-auto text-center mb-13 relative min-h-[700px]"
        style={{
          background: 'linear-gradient(180deg, #B36BCB 0%, #fff 100%)',
        }}
      >
        {/* Overlay for darkening the image */}
        <div className="relative z-10 py-10 px-4 md:max-w-[600px] lg:max-w-[800px] mx-auto">
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            classNamme="center-text"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--secondary-color)] mb-4 drop-shadow">
              GATA CU STRESUL ȘI HAOSUL!
            </h1>
            <p className="text-md md:text-lg mb-6 drop-shadow text-white/90">
              Organizează ACUM! Preia controlul total al organizării și
              transformă-ți nunta în realitate!
            </p>
            <Link href="#price-section">
              <Button
                type="primary"
                size="large"
                className="!p-6 !text-lg !font-bold !rounded-lg !text-white mt-8 md:mt-4 !bg-[var(--secondary-color)] hover:!bg-[var(--secondary-color)]/90 transition"
              >
                Ofertă Specială
              </Button>
            </Link>
          </AnimatedContent>
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 w-full h-[220px] z-0 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path d="M0,220 Q720,0 1440,220 L1440,220 L0,220 Z" fill="#fff" />
          </svg>
        </div>
        <AnimatedContent
          distance={150}
          direction="vertical"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          classNamme="absolute inset-0 flex items-end justify-center z-20 pointer-events-none px-2 md:px-0 mb-3 md:mb-0"
        >
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-[#ede0f3] mb-8 scale-100 md:scale-105 transition-transform duration-300 max-w-lg">
            <Image
              src={PlannerThumnbnail.src}
              alt="hero-image"
              width={700}
              height={520}
              className="w-full h-auto"
              priority
            />
          </div>
        </AnimatedContent>
      </section>

      {/* Features */}
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
        classNamme="center-text"
      >
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
          <span className="small-header">FUNCȚIONALITĂȚI</span>
          <span className="primary-title text-center md:!text-4xl">
            Descoperă funcționalitățile planificatorului
          </span>
        </div>
      </AnimatedContent>
      <section className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 px-4">
        {features.map((feature, idx) => {
          // Example: make some cards wider or taller based on index
          let extraClasses = '';
          if (idx === 0) extraClasses = 'md:col-span-2'; // Calendar de Planificare - wider
          if (idx === 1) extraClasses = 'md:row-span-2';
          if (idx === 3) extraClasses = 'md:row-span-2'; // Asistent WhatsApp - taller
          if (idx === 6) extraClasses = 'md:col-span-2'; // Zeci de șabloane - wider
          return (
            <AnimatedContent
              distance={150}
              direction="horizontal"
              reverse={false}
              config={{ tension: 80, friction: 20 }}
              initialOpacity={0.2}
              animateOpacity
              scale={1.1}
              threshold={0.2}
              key={idx}
              classNamme={`planner-feat-card rounded-2xl p-6 flex flex-col items-start shadow-sm border border-[#ede0f3] bg-white ${extraClasses}`}
            >
              <div>
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-1 text-[var(--primary-color)]">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-[15px]">
                  {feature.description}
                </p>
              </div>
            </AnimatedContent>
          );
        })}
      </section>

      <section
        id="price-section"
        className="max-w-[1200px] mx-auto mb-12 flex flex-col items-center px-4"
      >
        <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          classNamme="center-text"
        >
          <div className="flex flex-col items-center justify-center mb-8 space-y-2">
            <span className="small-header">PREȚ</span>
            <span className="primary-title text-center md:!text-4xl">
              Cât costă planificatorul digital?
            </span>
          </div>
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
          classNamme="w-full"
        >
          <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-[1200px] w-full">
            <div
              className="flex-1 rounded-2xl p-8 flex flex-col items-center shadow-sm border border-[#ede0f3] bg-white justify-center"
              style={{
                background:
                  'linear-gradient(90deg, var(--secondary-color-light, #f2e3f7) 0%, #fff 100%)',
              }}
            >
              <span className="bg-[var(--primary-color)] text-white px-4 py-1 rounded-full text-xs font-semibold mb-3">
                OFERTĂ SPECIALĂ
              </span>
              <h2 className="text-2xl font-bold mb-2 text-[var(--primary-color)] text-center">
                Planificator Digital
              </h2>
              <div className="flex flex-row-reverse items-center mb-2 gap-2">
                <span className="text-xl font-semibold text-gray-400 line-through">
                  199 RON
                </span>
                <span className="text-4xl font-extrabold text-[var(--primary-color)]">
                  99 RON
                </span>
              </div>
              <ul className="mb-6 space-y-2 text-gray-700 text-center">
                <li>Acces complet la Planificatorul Digital</li>
              </ul>
              <button
                className="px-8 py-3 bg-[var(--primary-color)] text-white rounded-lg font-medium shadow hover:bg-[var(--primary-color-hover,#A80050)]/90 transition text-lg"
                onClick={async () => {
                  await plannerCheckout(PLANYVITE_DIGITAL_PLANNER.priceId);
                  trackTikTokEvent('InitiateCheckout', {
                    content_type: 'product',
                    content_id: 'planner-digital-2025',
                    quantity: 1,
                    price: 49.99,
                    value: 49.99,
                    currency: 'RON',
                  });
                }}
              >
                Cumpără
              </button>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </main>
  );
}
