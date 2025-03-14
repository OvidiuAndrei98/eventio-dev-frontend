import '../../styles/globals.css'
import ConceptSection from './components/concept/ConceptSection'
import HowItWorksSection from './components/howItWorks/HowItWorksSection'
import LandingSection from './components/landing/LandingSection'
import Models from './components/models/Models'
import Footer from './components/navigation/Footer'
import PricesSection from './components/prices/PricesSection'

const Home = () => {
  return (
    <>
      <LandingSection />
      <HowItWorksSection />
      <ConceptSection />
      <PricesSection />
      <Models />
      <Footer />
    </>
  )
}

export default Home
