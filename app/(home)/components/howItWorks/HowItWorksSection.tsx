import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent'
import SpotlightCard from '../../../../components/spotlightCard/SpotlightCard'
import './HowItWorksSection.css'

const HowItWorksSection = () => {
  return (
    <div className="how-it-works-section">
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
          <span className="small-header">CUM FUNCTIONEAZA</span>
          <span className="primary-title">
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
        <div className="cards-section">
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
                Adaugă detalii precum numele evenimentului, data, locația și
                mesajul dorit.
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
                Vezi cine a confirmat prezența și ține totul sub control
                dintr-un singur loc.
              </span>
            </div>
          </SpotlightCard>
        </div>
      </AnimatedContent>
    </div>
  )
}

export default HowItWorksSection
