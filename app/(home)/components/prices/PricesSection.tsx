'use client';

import { Table } from 'antd';
import './PricesSection.css';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import { PLANYVITE_EVENT_PLANS } from '@/lib/planyviteEventPlanTiers';
import { PricingCard } from '@/components/pricingCard/PricingCard';

// Definim interfața pentru flexibilitate SEO
interface PricesSectionProps {
  smallHeader?: string;
  primaryTitle?: string;
  dataSource?: any[]; // Va primi array-ul de date personalizat
}

const PricesSection = ({
  smallHeader = 'PREȚURI',
  primaryTitle = 'Cât costă o invitație digitală',
  dataSource = [],
}: PricesSectionProps) => {
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
            <span className="small-header">{smallHeader}</span>
            <span className="primary-title text-center mb-4 md:!text-4xl">
              {primaryTitle}
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
