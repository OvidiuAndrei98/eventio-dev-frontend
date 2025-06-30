'use client';

import { useEffect } from 'react';
import '../../styles/globals.css';
import ConceptSection from './components/concept/ConceptSection';
import { Features } from './components/features/Features';
import HowItWorksSection from './components/howItWorks/HowItWorksSection';
import LandingSection from './components/landing/LandingSection';
import Models from './components/models/Models';
import Footer from './components/navigation/Footer';
import PricesSection from './components/prices/PricesSection';
import { addWebVisitLog } from '@/service/logs/addWebVisitLog';
import Planner from './components/planner/Planner';

const Home = () => {
  useEffect(() => {
    addWebVisitLog(crypto.randomUUID(), {
      source: 'homepage',
      referrer: document.referrer,
    }).catch((error) => {
      console.error('Error logging visit:', error);
    });
  }, []);

  return (
    <>
      <LandingSection />
      <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      <Features />
      <Planner />
      <HowItWorksSection />
      <ConceptSection />
      <PricesSection />
      <Models />
      <Footer />
    </>
  );
};

export default Home;
