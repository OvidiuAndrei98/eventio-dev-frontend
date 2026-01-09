'use client';

import React from 'react';
import { Collapse, ConfigProvider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';

const { Panel } = Collapse;

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  smallHeader?: string;
  primaryTitle?: string;
  items: FaqItem[];
}

const FaqSection = ({
  smallHeader = 'FAQ',
  primaryTitle = 'Întrebări frecvente',
  items = [],
}: FaqSectionProps) => {
  return (
    <div className="faq-section-container py-16 px-4" id="faq-section">
      <div className="max-w-3xl mx-auto">
        {/* Titlul secțiunii */}
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
          <div className="text-center mb-12">
            <span className="small-header block mb-2">{smallHeader}</span>
            <h2 className="primary-title text-3xl md:text-4xl font-bold">
              {primaryTitle}
            </h2>
          </div>
        </AnimatedContent>

        {/* Accordion-ul */}
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
          <ConfigProvider
            theme={{
              components: {
                Collapse: {
                  headerBg: 'transparent',
                  contentBg: 'transparent',
                  headerPadding: '16px 0px',
                  contentPadding: '0px 0px 16px 0px',
                  fontSizeIcon: 14,
                },
              },
            }}
          >
            <Collapse
              ghost
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              className="faq-collapse"
            >
              {items.map((item, index) => (
                <Panel
                  header={
                    <span className="font-semibold text-lg">
                      {item.question}
                    </span>
                  }
                  key={index}
                  className="border-b border-gray-200"
                >
                  <p className="text-gray-600 leading-relaxed italic">
                    {item.answer}
                  </p>
                </Panel>
              ))}
            </Collapse>
          </ConfigProvider>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default FaqSection;
