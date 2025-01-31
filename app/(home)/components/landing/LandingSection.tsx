import { Button } from 'antd'
import './LandingSection.css'
import Image from 'next/image'
import LandingBlob from '../../../../public/landing-blob.svg'
import LandingImage from '../../../../public/landing-image.svg'
import GradientText from '../../../../components/GradientText'

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
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="landing-text-container">
        <h1 className="header-text">
          Evenimentul tau incepe cu
          <GradientText
            colors={['#f3e438', '#e1c700', '#F8FF1F', '#F4E4AE']}
            animationSpeed={4}
            showBorder={false}
            className="text-key-word"
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
    </div>
  )
}

export default LandingSection
