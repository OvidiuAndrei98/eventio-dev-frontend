import { Divider, Table } from 'antd'
import './PricesSection.css'
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent'

const PricesSection = () => {
  const dataSource = [
    {
      key: '1',
      functionalitati: 'Personalizare "self-service" a invitației',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '2',
      functionalitati: 'Hărțile evenimentului',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '3',
      functionalitati: 'Countdown invitație',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '4',
      functionalitati: 'Restricționare invitație cu parolă',
      individuala: '-',
      premium: '\u2713',
    },
    {
      key: '5',
      functionalitati: 'Formular RSVP',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '6',
      functionalitati: 'Editare invitație după plată',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '7',
      functionalitati: 'Plată per invitat',
      individuala: '\u2713',
      premium: '-',
    },
    {
      key: '8',
      functionalitati: 'Plată unică',
      individuala: '-',
      premium: '\u2713',
    },
    {
      key: '9',
      functionalitati: 'Afișare nume invitat în invitație',
      individuala: '\u2713',
      premium: '-',
    },
    {
      key: '10',
      functionalitati: 'Link individual per invitat',
      individuala: '\u2713',
      premium: '-',
    },
    {
      key: '11',
      functionalitati: 'Link invitație personalizat cu denumirea evenimentului',
      individuala: '-',
      premium: '\u2713',
    },
    {
      key: '12',
      functionalitati: 'Statistici (confirmări și refuzuri) per invitat',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '13',
      functionalitati: 'Distribuire pe canale de socializare',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '14',
      functionalitati: 'Primire confirmări în platformă și pe email',
      individuala: '\u2713',
      premium: '\u2713',
    },
    {
      key: '15',
      functionalitati: 'Export confirmări în format Excel',
      individuala: '\u2713',
      premium: '\u2713',
    },
  ]

  const columns = [
    {
      title: 'Funcționalități',
      dataIndex: 'functionalitati',
      key: 'functionalitati',
    },
    {
      title: 'Individuală',
      dataIndex: 'individuala',
      key: 'individuala',
    },
    {
      title: 'Premium',
      dataIndex: 'premium',
      key: 'premium',
    },
  ]

  return (
    <div className="prices-section-container">
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
            <span className="primary-title">
              Cat costa o invitatie digitala
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
      <Table
        size="middle"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered={false}
      />
    </div>
  )
}

export default PricesSection
