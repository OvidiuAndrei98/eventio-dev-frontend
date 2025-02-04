import { Divider } from 'antd'
import './PricesSection.css'
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent'

const PricesSection = () => {
  return (
    <div className="prices-section">
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
        <div className="prices-section-description">
          <span className="small-header">PRETURI</span>
          <span className="primary-title">Cat costa o invitatie digitala</span>
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
        classNamme="cars-container-animated-container"
      >
        <div className="cards-container">
          <div className="price-card">
            <span className="price">4.99 RON</span>
            <span className="primary-title">INVITATIE INDIVIDUALA</span>
            <span className=".secondary-text-color-light">
              Pret per invitat
            </span>
            <div className="features-section">
              <span className=".secondary-text-color-light">
                Un link per invitat
              </span>
              <Divider style={{ width: '100%' }} />
              <span className=".secondary-text-color-light">
                Invitație cu numele invitatului
              </span>
              <Divider />
              <span className=".secondary-text-color-light">
                Fără număr minim de invitați
              </span>
            </div>
          </div>
          <div className="price-card">
            <span className="price">399 RON</span>
            <span className="primary-title">INVITATIE PREMIUM</span>
            <span className=".secondary-text-color-light">
              preț unic, invitați nelimitați
            </span>
            <div className="features-section">
              <span className=".secondary-text-color-light">
                Număr nelimitat de invitați
              </span>
              <Divider style={{ width: '100%' }} />
              <span className=".secondary-text-color-light">
                Un singur link al invitației
              </span>
              <Divider />
              <span className=".secondary-text-color-light">
                Acces la toate functionalitatile
              </span>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </div>
  )
}

export default PricesSection
