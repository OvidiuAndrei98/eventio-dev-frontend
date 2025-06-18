'use client';

import { Table } from 'antd';
import './PricesSection.css';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import { PLANYVITE_EVENT_PLANS } from '@/lib/planyviteEventPlanTiers';
import { PricingCard } from '@/components/pricingCard/PricingCard';

const PricesSection = () => {
  const checkmark = (
    <span style={{ color: '#a259ff', fontWeight: 'bold' }}>{'\u2713'}</span>
  );

  const redX = (
    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{'\u2717'}</span>
  );

  const dataSource = [
    {
      key: '1',
      functionalitati: 'Personalizare "self-service" a invitației',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '2',
      functionalitati: 'Planul locației',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '3',
      functionalitati: 'Countdown invitație',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '4',
      functionalitati: 'Asezarea invitaților la masă',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '5',
      functionalitati: 'Formular RSVP',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '6',
      functionalitati: 'Plată unică',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '7',
      functionalitati: 'Statistici (confirmări și refuzuri)',
      basic: redX,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '8',
      functionalitati: 'Distribuire pe canale de socializare',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '9',
      functionalitati: 'Vizualizare raspunsuri în timp real',
      basic: redX,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '10',
      functionalitati: 'Export confirmări în format Excel',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '11',
      functionalitati: 'Export plan sala în format PDF',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '12',
      functionalitati: 'Checklist (in curand)',
      basic: checkmark,
      premium: checkmark,
      ultimate: checkmark,
    },
    {
      key: '13',
      functionalitati: 'Planificator eveniment avansat',
      basic: redX,
      premium: redX,
      ultimate: checkmark,
    },
    {
      key: '14',
      functionalitati: 'Suport tehnic prioritar',
      basic: redX,
      premium: checkmark,
      ultimate: checkmark,
    },
  ];

  const columns = [
    {
      title: 'Funcționalități',
      dataIndex: 'functionalitati',
      key: 'functionalitati',
    },
    {
      title: 'Basic',
      dataIndex: 'basic',
      key: 'basic',
    },
    {
      title: 'Premium',
      dataIndex: 'premium',
      key: 'premium',
    },
    {
      title: 'Ultimate',
      dataIndex: 'ultimate',
      key: 'ultimate',
    },
  ];

  return (
    <div className="prices-section-container p-4" id="prices-section">
      <div className="prices-section !px-4 lg:px-4 py-8">
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
            <span className="small-header">PREȚURI</span>
            <span className="primary-title text-center mb-4 md:!text-4xl">
              Cât costă o invitație digitală
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
          <div className="flex flex-col lg:flex-row md:flex-wrap md:justify-center lg:flex-row gap-4">
            {PLANYVITE_EVENT_PLANS.filter(
              (p) => p.id !== 'ultimate_upgrade'
            ).map((plan) => {
              return <PricingCard key={plan.name} tier={plan} />;
            })}
          </div>
        </AnimatedContent>
      </div>
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <Table
          size="middle"
          dataSource={dataSource}
          pagination={false}
          bordered={false}
          className="prices-section-table"
          rowClassName={() => 'text-center'}
          columns={columns.map((col) =>
            col.dataIndex === 'functionalitati'
              ? { ...col, className: 'text-left' }
              : {
                  ...col,
                  className: 'text-center',
                  onHeaderCell: () => ({
                    style: { textAlign: 'center' },
                  }),
                }
          )}
        />
      </AnimatedContent>
    </div>
  );
};

export default PricesSection;
