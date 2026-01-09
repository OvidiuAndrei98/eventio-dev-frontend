import './LandingSection.css';
import GradientText from '../../../../components/GradientText';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import Image from 'next/image';
import HeroImage from '../../../../public/hero-image.svg';
import HeroButton from './HeroButton';

const LandingSection = () => {
  return (
    <div className="landing-section min-h-screen relative w-full flex flex-col items-center justify-center">
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
          <h1 className="text-3xl mt-[100px] md:text-4xl lg:text-5xl md:mt-[200px] lg:mt-[200px] font-bold mb-4 text-[var(--secondary-color)]">
            Planifică Evenimente Fără Stres. Invită cu Stil. Cu
            <GradientText
              colors={['#b46acb', '#c283d4', '#cf9cdd', '#e8cdee', '#c283d4']}
              animationSpeed={5}
            >
              PLANYVITE!
            </GradientText>
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl mb-6 text-gray-500">
            Cea mai simplă metodă de a trimite invitații pe WhatsApp, de a
            gestiona confirmările RSVP și de a organiza așezarea la mese. Totul
            într-o singură platformă profesională.
          </h2>
          <div className="w-full flex justify-center">
            <HeroButton />
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
        <Image className="z-1 my-4" src={HeroImage} alt="hero" priority />
      </AnimatedContent>
    </div>
  );
};

export default LandingSection;
