import { Button } from 'antd'
import './LandingSection.css'
import Image from 'next/image'
import LandingBlob from '../../../../public/landing-blob.svg'
import LandingImage from '../../../../public/landing-image.svg'
import GradientText from '../../../../components/GradientText'
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent'

const LandingSection = () => {
  return (
    <div className="landing-section">
      <div className="landing-image-container">
        <Image
          className="landing-blob"
          src={LandingBlob}
          alt={'landing-blob'}
        />
        <Image
          className="landing-image"
          src={LandingImage}
          alt={'landing-image'}
        />
      </div>
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
        <div className="landing-text-container">
          <h1 className="header-text">
            Evenimentul tau incepe cu
            <GradientText
              colors={['#b46acb', '#c283d4', '#cf9cdd', '#e8cdee', '#c283d4']}
              animationSpeed={5}
            >
              EVENTIO!
            </GradientText>
          </h1>
          <span className="info-text">
            Ușor, rapid, memorabil – invită-i pe cei dragi într-un mod unic!
          </span>
          <Button type="primary" size="large" className="try-button">
            Incearca gratuit
          </Button>
        </div>
      </AnimatedContent>
    </div>
  )
}

export default LandingSection
