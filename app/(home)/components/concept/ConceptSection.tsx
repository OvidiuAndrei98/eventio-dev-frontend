import GridMotion from '../../../../components/animatedWall/GridMotion'
import './ConceptSection.css'

const ConceptSection = () => {
  const items = [
    'https://plus.unsplash.com/premium_photo-1732736768092-43a010784507?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
    'https://image.api.playstation.com/vulcan/img/rnd/202011/0204/jvMomz0n9Be5mRKU8VP9Jl2A.png',
    'https://images.unsplash.com/photo-1735596365888-ad6d151533f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://plus.unsplash.com/premium_photo-1732736768092-43a010784507?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
    'https://image.api.playstation.com/vulcan/img/rnd/202011/0204/jvMomz0n9Be5mRKU8VP9Jl2A.png',
    'https://images.unsplash.com/photo-1735596365888-ad6d151533f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://plus.unsplash.com/premium_photo-1732736768092-43a010784507?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
    'https://image.api.playstation.com/vulcan/img/rnd/202011/0204/jvMomz0n9Be5mRKU8VP9Jl2A.png',
    'https://images.unsplash.com/photo-1735596365888-ad6d151533f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://plus.unsplash.com/premium_photo-1732736768092-43a010784507?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
    'https://image.api.playstation.com/vulcan/img/rnd/202011/0204/jvMomz0n9Be5mRKU8VP9Jl2A.png',
    'https://images.unsplash.com/photo-1735596365888-ad6d151533f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1683512611593-59aa784f5f16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1683512611593-59aa784f5f16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1683512611593-59aa784f5f16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1683512611593-59aa784f5f16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8',
  ]

  return (
    <div className="concept-section">
      <div className="description-section">
        <span className="section-title">
          Conceptul <span className="primary-color-text">Eventio</span> despre
          invitațiile digitale
        </span>
        <div className="your-experience section">
          <span className="title">Creează și gestionează cu ușurință</span>
          <span>
            Eventio îți oferă toate instrumentele necesare pentru a crea o
            invitație digitală unică, potrivită evenimentului tău. De la
            personalizare la distribuire, platforma noastră face întregul proces
            simplu, rapid și elegant.
          </span>
        </div>
        <div className="your-experience section">
          <span className="title">Distribuire rapidă și interactivitate</span>
          <span>
            Odată creată, invitația poate fi distribuită instantaneu prin
            WhatsApp, e-mail sau rețele sociale. Nu mai este nevoie de tipărire
            sau livrare manuală! În plus, poți adăuga elemente interactive,
            precum locația evenimentului pe hartă, mesaje personalizate și chiar
            un playlist pentru atmosferă.
          </span>
        </div>
        <div className="guest-experience section">
          <span className="title">
            O experiență modernă pentru invitații tăi
          </span>
          <span>
            Invitațiile tale vor fi mereu la îndemâna celor dragi, accesibile de
            pe orice dispozitiv. Cu funcția RSVP integrată, vei primi
            răspunsurile invitaților în timp real, astfel încât organizarea
            evenimentului să fie fără stres.
          </span>
        </div>
      </div>
      <div className="showcase-section">
        <GridMotion items={items} gradientColor={'white'} />
      </div>
    </div>
  )
}

export default ConceptSection
