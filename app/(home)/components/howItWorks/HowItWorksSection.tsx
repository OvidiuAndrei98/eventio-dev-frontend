import SpotlightCard from '../../../../components/spotlightCard/SpotlightCard'
import './HowItWorksSection.css'

const HowItWorksSection = () => {
  return (
    <div className="how-it-works-section">
      <div className="title-section">
        <span className="small-header">CUM FUNCTIONEAZA</span>
        <span className="primary-title">
          Invitații digitale, create ușor, trimise rapid!
        </span>
      </div>
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
              Vezi cine a confirmat prezența și ține totul sub control dintr-un
              singur loc.
            </span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  )
}

export default HowItWorksSection
