import '../../styles/globals.css';
import ConceptSection from './components/concept/ConceptSection';
import { Features } from './components/features/Features';
import HowItWorksSection from './components/howItWorks/HowItWorksSection';
import LandingSection from './components/landing/LandingSection';
import Models from './components/models/Models';
import PricesSection from './components/prices/PricesSection';
import Planner from './components/planner/Planner';
import Analytics from './components/analytics/Analytics';

const Home = () => {
  return (
    <>
      <Analytics />
      <LandingSection />
      <div className="relative bottom-0 left-auto right-auto w-screen h-[100px] bg-gradient-to-t from-[white] to-[#f5f3f5]"></div>
      <Features />
      <Planner />
      <HowItWorksSection />
      <ConceptSection />
      <PricesSection />
      <Models />
    </>
  );
};

export default Home;
