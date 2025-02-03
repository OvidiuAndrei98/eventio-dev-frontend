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
    </div>
  )
}

export default LandingSection
