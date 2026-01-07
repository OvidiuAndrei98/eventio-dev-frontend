'use client';

import { useRouter } from 'next/navigation';
import './style.css';
import { Button } from 'antd';
import HowItWorksSection from '../(home)/components/howItWorks/HowItWorksSection';
import { Features } from '../(home)/components/features/Features';
import PricesSection from '../(home)/components/prices/PricesSection';
import AnimatedContent from '@/components/animatedContainer/AnimatedContent';

const WeddingInvitationsPage = () => {
  const router = useRouter();
  return (
    <div className="landing-wedding overflow-hidden">
      <div className=" hero-section relative inset-0">
        <div className="w-full h-[100dvh] grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
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
              Trimite invitația pe WhatsApp în 2 minute. Gestionează
              confirmările (RSVP) automat, fără tabele în Excel.
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
              className="max-w-full max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </AnimatedContent>
        </div>
        <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      </div>
      <Features />
      <HowItWorksSection />
      <PricesSection />
    </div>
  );
};
export default WeddingInvitationsPage;
