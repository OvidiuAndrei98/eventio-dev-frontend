'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Modal,
  Button,
  Radio,
  Input,
  message,
  Tabs,
  Segmented,
  Drawer,
  Space,
} from 'antd';
import {
  DownloadOutlined,
  SettingOutlined,
  UserOutlined,
  SortAscendingOutlined,
  LayoutOutlined,
  CloseOutlined,
  ExpandOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import { domToCanvas } from 'modern-screenshot';
import { Guest } from '@/core/types';

interface MobileTablePlanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests?: Guest[];
  exportExcel: () => void;
}

type TemplateKey = 'minimal' | 'floral' | 'modern';

const MobileTablePlanExportModal = ({
  isOpen,
  onClose,
  guests = [],
  exportExcel,
}: MobileTablePlanExportModalProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [exportMode, setExportMode] = useState<'alfabetic' | 'mese'>(
    'alfabetic'
  );
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const [weddingNames, setWeddingNames] = useState({
    bride: 'Narcisa',
    groom: 'Andrei',
    subtitle: 'Bun venit la nunta noastră',
  });

  const [opisConfig, setOpisConfig] = useState<{
    template: TemplateKey;
    color: string;
  }>({
    template: 'minimal',
    color: '#3d3d3d',
  });

  type TemplateDefinition = {
    fontFamily: string;
    secondaryFont: string;
    bgGradient: string;
    bgImage: string;
    overlay: string;
    titleSize: string;
    subtitleSize: string;
    letterSpacing: string;
    borderStyle: string;
    textTransform: string;
    fontWeight: string;
  };

  const templates: Record<TemplateKey, TemplateDefinition> = {
    minimal: {
      fontFamily: "'Cinzel', serif",
      secondaryFont: "'Montserrat', sans-serif",
      bgGradient: 'radial-gradient(circle, #fdfbf7 0%, #f5f0e6 100%)',
      bgImage: '',
      overlay: 'transparent',
      titleSize: '80px',
      subtitleSize: '24px',
      letterSpacing: '10px',
      borderStyle: '1px solid',
      textTransform: 'uppercase',
      fontWeight: '400',
    },
    floral: {
      fontFamily: "'Great Vibes', cursive",
      secondaryFont: "'Libre Baskerville', serif",
      bgGradient: '',
      bgImage: '/opis_backgrounds/floral_bg.jpg',
      overlay: 'rgba(255,255,255,0.3)',
      titleSize: '110px',
      subtitleSize: '28px',
      letterSpacing: '0px',
      borderStyle: '1px solid',
      textTransform: 'none',
      fontWeight: '400',
    },
    modern: {
      fontFamily: "'Montserrat', sans-serif",
      secondaryFont: "'Montserrat', sans-serif",
      bgGradient: '',
      bgImage: '',
      overlay: 'transparent',
      titleSize: '70px',
      subtitleSize: '20px',
      letterSpacing: '20px',
      borderStyle: '4px double',
      textTransform: 'uppercase',
      fontWeight: '700',
    },
  };

  const current = templates[opisConfig.template] || templates.minimal;

  const alphabetGroups = useMemo(() => {
    const sorted = [...guests].sort((a, b) =>
      (a.lastName || '').localeCompare(b.lastName || '', 'ro')
    );
    const groups: { letter: string; guests: Guest[] }[] = [];
    const initials = Array.from(
      new Set(sorted.map((g) => (g.lastName || ' ')[0]?.toUpperCase() || '#'))
    ).sort();
    initials.forEach((letter) => {
      const guestsForLetter = sorted.filter((g) =>
        (g.lastName || '').toUpperCase().startsWith(letter)
      );
      for (let i = 0; i < guestsForLetter.length; i += 12)
        groups.push({ letter, guests: guestsForLetter.slice(i, i + 12) });
    });
    return groups;
  }, [guests]);

  const tableGroups = useMemo(() => {
    const map: Record<string, Guest[]> = {};
    guests
      .filter((g) => g.tableNumber !== undefined && g.tableNumber !== null)
      .forEach((g) => {
        const t = g.tableNumber as string;
        if (!map[t]) map[t] = [];
        map[t].push(g);
      });
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([num, g]) => ({ letter: `Masa ${num}`, guests: g }));
  }, [guests]);

  const activeDisplayData =
    exportMode === 'alfabetic' ? alphabetGroups : tableGroups;
  const [activePageItems, setActivePageItems] = useState<
    { letter: string; guests: Guest[] }[]
  >([]);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    const hide = message.loading('Se generează fișierul A2...', 0);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a2',
      });
      setActivePageItems(activeDisplayData.slice(0, 12));
      await new Promise((r) => setTimeout(r, 1000));
      await document.fonts.ready;
      const canvas = await domToCanvas(exportRef.current, {
        scale: 1.5,
        backgroundColor: '#ffffff',
        width: 2245,
        height: 1587,
      });
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        0,
        594,
        420
      );
      setIsExporting(false);
      pdf.save(`Panou_${exportMode}_${weddingNames.bride}.pdf`);
      message.success('Export realizat!');
    } catch (e) {
      console.error(e);
      message.error('Eroare export.');
    } finally {
      setActivePageItems([]);
      hide();
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="100vw"
      className="PlanExportModal"
      centered
      style={{
        top: 0,
        width: '100vw',
        paddingBottom: 0,
        margin: 0,
        height: '98dvh',
      }}
      closeIcon={<CloseOutlined style={{ fontSize: 20, color: '#000' }} />}
      title="Centru Export"
      destroyOnClose
    >
      <style>{`
        /* Elimină scroll-ul body-ului când modalul e deschis */
        .ant-modal-root .ant-modal-wrap { overflow: hidden !important; }
        .ant-modal-content { height: 100vh; border-radius: 0 !important; }
        .ant-tabs, .ant-tabs-content, .ant-tabs-tabpane { height: 100% !important; display: flex; flex-direction: column; }
        .PlanExportModal .ant-modal-body { height: calc(100dvh - 68px); }
      `}</style>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        style={{ flex: 1 }}
        items={[
          {
            key: '1',
            label: <SortAscendingOutlined />,
            children: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Segmented
                  block
                  value={exportMode}
                  onChange={(v) => setExportMode(v as 'alfabetic' | 'mese')}
                  options={[
                    {
                      label: 'Alfabetic',
                      value: 'alfabetic',
                      icon: <SortAscendingOutlined />,
                    },
                    {
                      label: 'Pe Mese',
                      value: 'mese',
                      icon: <LayoutOutlined />,
                    },
                  ]}
                  style={{ marginBottom: 15 }}
                />

                <div
                  style={{
                    fontSize: '10px',
                    color: '#888',
                    textAlign: 'center',
                    marginBottom: 5,
                  }}
                >
                  <ExpandOutlined /> Glisează stânga-dreapta pentru a vedea
                  panoul
                </div>

                {/* CONTAINER SCROLLABIL (MODIFICAREA PRINCIPALĂ) */}
                <div
                  style={{
                    flex: 1,
                    overflow: 'auto', // Permite scroll pe ambele direcții
                    borderRadius: 12,
                    border: '1px solid #ddd',
                    marginBottom: '80px',
                    background: '#f0f0f0',
                  }}
                >
                  {/* CANVAS-UL DE PREVIEW LA DIMENSIUNE MARE */}
                  <div
                    style={{
                      width: '1200px', // Lățime simulată de desktop
                      minHeight: '100%',
                      background: current.bgGradient || '#fff',
                      position: 'relative',
                      padding: '40px',
                    }}
                  >
                    {current.bgImage && (
                      <img
                        src={current.bgImage}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          zIndex: 0,
                        }}
                        alt=""
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: current.overlay,
                        zIndex: 1,
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div
                          style={{
                            fontFamily: current.fontFamily,
                            color: opisConfig.color,
                            fontSize: 48,
                            margin: 0,
                            textTransform:
                              current.textTransform as React.CSSProperties['textTransform'],
                          }}
                        >
                          {weddingNames.bride} & {weddingNames.groom}
                        </div>
                        <div
                          style={{
                            fontFamily: current.secondaryFont,
                            fontSize: 14,
                            opacity: 0.8,
                            textTransform: 'uppercase',
                            marginTop: 10,
                            letterSpacing: 4,
                          }}
                        >
                          {weddingNames.subtitle}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gap: '30px 20px',
                        }}
                      >
                        {activeDisplayData.map((group, idx) => (
                          <div key={idx}>
                            <div
                              style={{
                                fontFamily: current.fontFamily,
                                color: opisConfig.color,
                                fontSize: 20,
                                borderBottom: `${current.borderStyle} ${opisConfig.color}`,
                                marginBottom: 10,
                              }}
                            >
                              {group.letter}
                            </div>
                            {group.guests.map((g, i) => (
                              <div
                                key={i}
                                style={{
                                  fontSize: 11,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  fontFamily: current.secondaryFont,
                                  marginBottom: 4,
                                }}
                              >
                                <span
                                  style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '80%',
                                  }}
                                >
                                  {g.lastName} {g.firstName}
                                </span>
                                {exportMode === 'alfabetic' && (
                                  <b>{g.tableNumber}</b>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    right: 12,
                    display: 'flex',
                    gap: 10,
                    background: '#fff',
                    paddingTop: 10,
                    zIndex: 10,
                  }}
                >
                  <Button
                    icon={<SettingOutlined />}
                    size="large"
                    onClick={() => setSettingsVisible(true)}
                  >
                    Design
                  </Button>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="large"
                    block
                    loading={isExporting}
                    onClick={handleExport}
                    style={{ background: '#000' }}
                  >
                    {isExporting ? 'Se Generează...' : 'Export Panou A2'}
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: '2',
            label: <UserOutlined />,
            children: (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}
              >
                <Button
                  block
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={exportExcel}
                >
                  Export Hostess Excel
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Drawer
        title="Design Panou"
        placement="bottom"
        height="65%"
        onClose={() => setSettingsVisible(false)}
        open={settingsVisible}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input
              value={weddingNames.bride}
              onChange={(e) =>
                setWeddingNames({ ...weddingNames, bride: e.target.value })
              }
            />
            <Input
              value={weddingNames.groom}
              onChange={(e) =>
                setWeddingNames({ ...weddingNames, groom: e.target.value })
              }
            />
          </div>
          <Input.TextArea
            value={weddingNames.subtitle}
            onChange={(e) =>
              setWeddingNames({ ...weddingNames, subtitle: e.target.value })
            }
          />
          <Radio.Group
            value={opisConfig.template}
            onChange={(e) =>
              setOpisConfig({
                ...opisConfig,
                template: e.target.value as TemplateKey,
              })
            }
            buttonStyle="solid"
            block
          >
            <Radio.Button value="minimal">Minimal</Radio.Button>
            <Radio.Button value="floral">Floral</Radio.Button>
            <Radio.Button value="modern">Modern</Radio.Button>
          </Radio.Group>
          <input
            type="color"
            value={opisConfig.color}
            onChange={(e) =>
              setOpisConfig({ ...opisConfig, color: e.target.value })
            }
            style={{ width: '100%', height: 40 }}
          />
          <Button
            type="primary"
            block
            size="large"
            onClick={() => setSettingsVisible(false)}
          >
            Modifică
          </Button>
        </Space>
      </Drawer>

      {/* MOTOR EXPORT ASCUNS - NESCHIMBAT (PENTRU CALITATE A2) */}
      <div
        style={{
          height: 0,
          width: 0,
          overflow: 'hidden',
          position: 'absolute',
        }}
      >
        <div
          ref={exportRef}
          style={{
            width: '2245px',
            height: '1587px',
            background: current.bgGradient || '#ffffff',
            position: 'relative',
            padding: '60px 100px',
          }}
        >
          {current.bgImage && (
            <img
              src={current.bgImage}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              alt=""
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: current.overlay,
            }}
          />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div
                style={{
                  fontFamily: current.fontFamily,
                  color: opisConfig.color,
                  fontSize: current.titleSize,
                  textTransform:
                    current.textTransform as React.CSSProperties['textTransform'],
                }}
              >
                {weddingNames.bride} & {weddingNames.groom}
              </div>
              <div
                style={{
                  fontFamily: current.secondaryFont,
                  fontSize: current.subtitleSize,
                  letterSpacing: '8px',
                  textTransform: 'uppercase',
                  marginTop: 15,
                }}
              >
                {weddingNames.subtitle}
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '50px 40px',
              }}
            >
              {activePageItems.map((item, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      fontFamily: current.fontFamily,
                      color: opisConfig.color,
                      borderBottom: `3px solid ${opisConfig.color}`,
                      fontSize: 50,
                      marginBottom: 20,
                    }}
                  >
                    {item.letter}
                  </div>
                  {item.guests.map((g: Guest, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 18,
                        fontFamily: current.secondaryFont,
                        textTransform:
                          current.textTransform as React.CSSProperties['textTransform'],
                        marginBottom: 6,
                      }}
                    >
                      <span>
                        {g.lastName} {g.firstName}
                      </span>
                      {exportMode === 'alfabetic' && <b>{g.tableNumber}</b>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MobileTablePlanExportModal;
