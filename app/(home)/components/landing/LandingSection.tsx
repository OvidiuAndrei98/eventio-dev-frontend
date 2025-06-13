import { Button } from 'antd';
import './LandingSection.css';
import GradientText from '../../../../components/GradientText';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import Image from 'next/image';
import HeroImage from '../../../../public/hero-image.svg';

const LandingSection = () => {
  return (
    <div className="landing-section min-h-[100svh] relative w-full flex flex-col items-center justify-center">
      <div className="absolute inset-0 hero-section" />
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <div className="w-full h-[100%] flex flex-col items-start justify-center text-center text-white lg:max-w-3xl px-4">
          <h1 className="text-2xl md:text-5xl lg:text-5xl lg:mt-[200px] font-bold mb-4 text-[var(--secondary-color)]">
            Planifică Evenimente Fără Stres. Invită cu Stil. Cu
            <GradientText
              colors={['#b46acb', '#c283d4', '#cf9cdd', '#e8cdee', '#c283d4']}
              animationSpeed={5}
            >
              PLANYVITE!
            </GradientText>
          </h1>
          <span className="text-lg md:text-xl lg:text-2xl mb-6 text-gray-500">
            Economisește timp, reduce risipa și impresionează-ți invitații cu
            invitații digitale personalizate. Urmărește RSVP-urile în timp real
            și concentrează-te pe ceea ce contează cu adevărat: evenimentul tău.
          </span>
          <div className="w-full flex justify-center">
            <Button
              type="primary"
              size="large"
              className="try-button my-4 !p-6 !text-lg !font-bold !rounded-full !text-white"
            >
              Incearca gratuit
            </Button>
          </div>
        </div>
      </AnimatedContent>
      <AnimatedContent
        distance={170}
        direction="vertical"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <Image className="z-1 my-4" src={HeroImage} alt="hero" />
      </AnimatedContent>
    </div>
  );
};

export default LandingSection;
