import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import GridMotion from '../../../../components/animatedWall/GridMotion';
import BlobV2 from '../../../../public/blobv2.svg';
import './ConceptSection.css';
import Image from 'next/image';
import LandingBuilder1 from '../../../../public/landing_images/landing_builder_1.png';
import LandingDemo1 from '../../../../public/landing_images/landing_demo_1.png';
import LandingDemo2 from '../../../../public/landing_images/landing_demo_2.png';
import LandingDemo3 from '../../../../public/landing_images/landing_demo_3.png';

const ConceptSection = () => {
  const items = [
    LandingDemo1,
    LandingDemo3,
    LandingBuilder1,
    LandingDemo2,
    LandingDemo3,
    LandingDemo1,
    LandingDemo3,
    LandingBuilder1,
    LandingDemo2,
    LandingDemo3,
    LandingDemo1,
    LandingDemo3,
    LandingBuilder1,
    LandingDemo2,
    LandingDemo3,
  ];

  return (
    <>
      <div className="h-[40px] w-full" id="concept-section"></div>
      <div className="concept-section flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8">
        <div className="description-section">
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
            <span className="section-title">
              Conceptul{' '}
              <span className="primary-color-text styled-title">Eventio</span>{' '}
              despre invitațiile digitale
            </span>
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
          >
            <div className="your-experience section text-center lg:text-left">
              <span className="title">Creează și gestionează cu ușurință</span>
              <span className="section-description">
                Eventio îți oferă toate instrumentele necesare pentru a crea o
                invitație digitală unică, potrivită evenimentului tău. De la
                personalizare la distribuire, platforma noastră face întregul
                proces simplu, rapid și elegant.
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
          >
            <div className="your-experience section text-center lg:text-left">
              <span className="title">
                Distribuire rapidă și interactivitate
              </span>
              <span className="section-description">
                Odată creată, invitația poate fi distribuită instantaneu prin
                WhatsApp, e-mail sau rețele sociale. Nu mai este nevoie de
                tipărire sau livrare manuală! În plus, poți adăuga elemente
                interactive, precum locația evenimentului pe hartă, mesaje
                personalizate și chiar un playlist pentru atmosferă.
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
          >
            <div className="guest-experience section text-center lg:text-left">
              <span className="title">
                O experiență modernă pentru invitații tăi
              </span>
              <span className="section-description">
                Invitațiile tale vor fi mereu la îndemâna celor dragi,
                accesibile de pe orice dispozitiv. Cu funcția RSVP integrată,
                vei primi răspunsurile invitaților în timp real, astfel încât
                organizarea evenimentului să fie fără stres.
              </span>
            </div>
          </AnimatedContent>

          <Image className="concept-blob" src={BlobV2} alt={'concept-blob'} />
        </div>
        <div className="showcase-section">
          <GridMotion items={items} gradientColor={'white'} />
        </div>
      </div>
    </>
  );
};

export default ConceptSection;
