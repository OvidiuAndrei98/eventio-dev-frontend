// pages/dashboard/(plan)/plan/upgrade.tsx (sau similar)
'use client';
import React from 'react';
import { Button, Card, Col, Row, Typography, Space } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useEventContext } from '@/core/context/EventContext';
import { planEventUpgradeCheckout } from '@/service/stripe/planEventUpgradeCheckout';

const { Title, Text } = Typography;

const UpgradePage = () => {
  const { eventInstance } = useEventContext();

  const handleUpgradeClick = async () => {
    if (!eventInstance?.eventId || !eventInstance?.userId) {
      console.error('Event ID or User ID is missing.');
      return;
    }
    try {
      await planEventUpgradeCheckout(
        eventInstance!.userId,
        'price_1SeYkZIYmtfnTY0fvptahiW7',
        eventInstance!.eventId,
        'ultimate'
      );
    } catch (error) {
      console.error('Eroare la redirecționarea către Stripe Checkout:', error);
    }
  };

  const features = [
    {
      name: 'Număr de Invitați',
      free: '30',
      ultimate: 'Nelimitat',
      isUpgrade: true,
    },
    {
      name: 'Număr de Mese (Plan Salon)',
      free: '3',
      ultimate: 'Nelimitat',
      isUpgrade: true,
    },
    {
      name: 'Export Plan Salon PDF',
      free: 'Demo',
      ultimate: <CheckCircleOutlined style={{ color: 'green' }} />,
      isUpgrade: true,
    },
    {
      name: 'Export Listă Invitați Excel',
      free: 'Demo',
      ultimate: <CheckCircleOutlined style={{ color: 'green' }} />,
      isUpgrade: true,
    },
    {
      name: 'Export Opis',
      free: 'Demo',
      ultimate: <CheckCircleOutlined style={{ color: 'green' }} />,
      isUpgrade: true,
    },
    {
      name: 'Suport Prioritar',
      free: <CloseCircleOutlined style={{ color: 'red' }} />,
      ultimate: <CheckCircleOutlined style={{ color: 'green' }} />,
      isUpgrade: true,
    },
  ];

  // TODO Add notFound if no eventInstance

  return (
    <div className="bg-gray-50 w-full h-full overflow-y-auto">
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Upgrade la Planul Ultimate
        </Title>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={12}>
            <Card
              title={<Title level={4}>Planul Basic</Title>}
              bordered={false}
              style={{ minHeight: 450, backgroundColor: '#f0f2f5' }}
            >
              <Title level={3} style={{ color: '#8c8c8c' }}>
                GRATUIT
              </Title>
              <Text type="secondary">
                Ideal pentru a testa funcționalitățile de bază.
              </Text>
              <div style={{ marginTop: '20px' }}>
                {features.map((feature) => (
                  <Space
                    direction="horizontal"
                    key={feature.name}
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      padding: '5px 0',
                    }}
                  >
                    <Text>{feature.name}</Text>
                    <Text strong>{feature.free}</Text>
                  </Space>
                ))}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Title level={4}>
                  <CrownOutlined /> Planul Ultimate
                </Title>
              }
              bordered={false}
              style={{
                minHeight: 450,
                borderColor: 'var(--primary-color)',
                borderWidth: '3px',
                borderStyle: 'solid',
              }}
            >
              <Title level={3} style={{ color: 'var(--primary-color)' }}>
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#8c8c8c',
                    marginRight: '8px',
                  }}
                >
                  150 RON
                </span>
                99 RON
              </Title>
              <Text type="success">
                Soluția completă pentru organizarea evenimentului tău.
              </Text>

              <div style={{ marginTop: '20px' }}>
                {features.map((feature) => (
                  <Space
                    direction="horizontal"
                    key={feature.name}
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      padding: '5px 0',
                    }}
                  >
                    <Text>{feature.name}</Text>
                    <Text
                      strong
                      style={{ color: feature.isUpgrade ? 'green' : 'inherit' }}
                    >
                      {feature.ultimate}
                    </Text>
                  </Space>
                ))}
              </div>

              <Button
                type="primary"
                size="large"
                onClick={handleUpgradeClick}
                style={{ marginTop: '30px', width: '100%' }}
                disabled={
                  eventInstance?.eventPlan === 'ultimate' ||
                  !eventInstance?.eventId
                }
              >
                Cumpară
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UpgradePage;
