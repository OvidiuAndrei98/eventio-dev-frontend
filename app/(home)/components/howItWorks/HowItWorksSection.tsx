import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import SpotlightCard from '../../../../components/spotlightCard/SpotlightCard';
import './HowItWorksSection.css';

const HowItWorksSection = () => {
  return (
    <div
      className="how-it-works-section !p-2 lg:!p-4"
      id="how-it-works-section-id"
    >
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
        <div className="title-section">
          <span className="small-header">CUM FUNCȚIONEAZĂ</span>
          <span className="primary-title text-center md:!text-4xl">
            Invitații digitale, create ușor, trimise rapid!
          </span>
        </div>
      </AnimatedContent>
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
        <div className="cards-section flex flex-col lg:flex-row gap-4 px-2 lg:px-4">
          <SpotlightCard
            spotlightColor="rgba(180, 106, 203, 0.3)"
            className="custom-card"
          >
            <div className="card-content">
              <span className="step-number">
                1<span>.</span>
              </span>
              <span className="card-title">Alege un design</span>
              <span className="card-description">
                Selectează un șablon din colecția noastră sau creează unul unic
                pentru evenimentul tău.
              </span>
            </div>
          </SpotlightCard>
          <SpotlightCard
            spotlightColor="rgba(180, 106, 203, 0.3)"
            className="custom-card"
          >
            <div className="card-content">
              <span className="step-number">
                2<span>.</span>
              </span>
              <span className="card-title">Personalizează invitația</span>
              <span className="card-description">
                Personalizare completă a invitației cu ajutorul builderului
                nostru intuitiv. Adaugă detalii, imagini și stiluri unice.
              </span>
            </div>
          </SpotlightCard>
          <SpotlightCard
            spotlightColor="rgba(180, 106, 203, 0.3)"
            className="custom-card"
          >
            <div className="card-content">
              <span className="step-number">
                3<span>.</span>
              </span>
              <span className="card-title"> Gestionează invitațiile</span>
              <span className="card-description">
                Vezi cine a confirmat prezența, aranjeaza Invitații la masa și
                ține totul sub control dintr-un singur loc.
              </span>
            </div>
          </SpotlightCard>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default HowItWorksSection;
