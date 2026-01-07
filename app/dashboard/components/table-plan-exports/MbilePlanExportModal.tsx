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
type DensityKey = 'relaxat' | 'standard' | 'compact';

interface Template {
  fontFamily: string;
  secondaryFont: string;
  bgGradient?: string;
  bgImage?: string;
  overlay: string;
  borderStyle: string;
  textTransform: string;
}

interface DisplayGroup {
  letter: string;
  guests: Guest[];
}

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
  const [density, setDensity] = useState<DensityKey>('standard');
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

  // CONFIGURAȚII DENSITATE (Fonturi și Grupări)
  const densities: Record<
    DensityKey,
    {
      ppg: number; // persoane per grup (coloană)
      cpg: number; // coloane per pagină
      fontSize: number;
      titleSize: number;
      subtitleSize: number;
      headerSize: number;
    }
  > = {
    relaxat: {
      ppg: 10,
      cpg: 12,
      fontSize: 18,
      titleSize: 80,
      subtitleSize: 24,
      headerSize: 40,
    },
    standard: {
      ppg: 11,
      cpg: 18,
      fontSize: 14,
      titleSize: 70,
      subtitleSize: 20,
      headerSize: 32,
    },
    compact: {
      ppg: 14,
      cpg: 24,
      fontSize: 11,
      titleSize: 60,
      subtitleSize: 16,
      headerSize: 26,
    },
  };

  const d = densities[density];

  const templates: Record<TemplateKey, Template> = {
    minimal: {
      fontFamily: "'Cinzel', serif",
      secondaryFont: "'Montserrat', sans-serif",
      bgGradient: 'radial-gradient(circle, #fdfbf7 0%, #f5f0e6 100%)',
      bgImage: '',
      overlay: 'transparent',
      borderStyle: '1px solid',
      textTransform: 'uppercase',
    },
    floral: {
      fontFamily: "'Great Vibes', cursive",
      secondaryFont: "'Libre Baskerville', serif",
      bgImage: '/opis_backgrounds/floral_bg.jpg',
      overlay: 'rgba(255,255,255,0.3)',
      borderStyle: '1px solid',
      textTransform: 'none',
    },
    modern: {
      fontFamily: "'Montserrat', sans-serif",
      secondaryFont: "'Montserrat', sans-serif",
      bgGradient: '',
      bgImage: '',
      overlay: 'transparent',
      borderStyle: '4px double',
      textTransform: 'uppercase',
    },
  };

  const current = templates[opisConfig.template] || templates.minimal;

  const activeDisplayData = useMemo(() => {
    const baseData: DisplayGroup[] = [];
    if (exportMode === 'alfabetic') {
      const sorted = [...guests].sort((a, b) =>
        (a.lastName || '').localeCompare(b.lastName || '', 'ro')
      );
      const initials = Array.from(
        new Set(sorted.map((g) => (g.lastName || ' ')[0]?.toUpperCase() || '#'))
      ).sort();
      initials.forEach((letter) => {
        const guestsForLetter = sorted.filter((g) =>
          (g.lastName || '').toUpperCase().startsWith(letter)
        );
        for (let i = 0; i < guestsForLetter.length; i += d.ppg)
          baseData.push({
            letter,
            guests: guestsForLetter.slice(i, i + d.ppg),
          });
      });
    } else {
      const map: Record<string, Guest[]> = {};
      guests
        .filter((g) => g.tableNumber)
        .forEach((g) => {
          const t = g.tableNumber as string;
          if (!map[t]) map[t] = [];
          map[t].push(g);
        });
      Object.entries(map)
        .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
        .forEach(([num, g]) => {
          for (let i = 0; i < g.length; i += d.ppg)
            baseData.push({
              letter: `Masa ${num}`,
              guests: g.slice(i, i + d.ppg),
            });
        });
    }
    return baseData;
  }, [guests, exportMode, d.ppg]);

  const [activePageItems, setActivePageItems] = useState<DisplayGroup[]>([]);

  const totalPages = useMemo(() => {
    return Math.ceil(activeDisplayData.length / d.cpg) || 1;
  }, [activeDisplayData, d.cpg]);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    const hide = message.loading('Se generează fișierul...', 0);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a2',
      });
      const totalPages = Math.ceil(activeDisplayData.length / d.cpg);

      for (let i = 0; i < totalPages; i++) {
        setActivePageItems(activeDisplayData.slice(i * d.cpg, (i + 1) * d.cpg));
        await new Promise((r) => setTimeout(r, 1000));
        await document.fonts.ready;
        const canvas = await domToCanvas(exportRef.current, {
          scale: 1.5,
          backgroundColor: '#ffffff',
          width: 2245,
          height: 1587,
        });
        if (i > 0) pdf.addPage('a2', 'landscape');
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          0,
          594,
          420
        );
      }
      pdf.save(`Panou_${exportMode}_${weddingNames.bride}.pdf`);
      message.success('Export realizat!');
    } catch (e) {
      console.error(e);
      message.error('Eroare export.');
    } finally {
      setActivePageItems([]);
      setIsExporting(false);
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
        height: '100dvh',
      }}
      closeIcon={<CloseOutlined style={{ fontSize: 20, color: '#000' }} />}
      title="Centru Export"
      destroyOnClose
    >
      <style>{`
        .ant-modal-root .ant-modal-wrap { overflow: hidden !important; }
        .ant-modal-content { height: 100vh; border-radius: 0 !important; padding: 0 !important; }
        .ant-modal-header { padding: 16px !important; margin-bottom: 0 !important; }
        .ant-tabs, .ant-tabs-content, .ant-tabs-tabpane { height: 100% !important; display: flex; flex-direction: column; }
        .PlanExportModal .ant-modal-body { height: calc(100dvh - 55px); padding: 0 !important; }
      `}</style>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
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
                  padding: '15px',
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
                    fontSize: '11px',
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div>
                    <ExpandOutlined /> Glisează stânga-dreapta pentru
                    previzualizare
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#1677ff' }}>
                    Documentul va avea: {totalPages}{' '}
                    {totalPages === 1 ? 'pagină' : 'pagini'} A2
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    overflow: 'auto',
                    borderRadius: 12,
                    border: '1px solid #ddd',
                    marginBottom: '80px',
                    background: '#f0f0f0',
                  }}
                >
                  <div
                    style={{
                      width: '1200px',
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

                      {/* GRID ACTUALIZAT PENTRU PREVIEW PAGINA 1 */}
                      <div
                        style={{
                          display: 'grid',
                          // Afișăm coloane în funcție de densitate (Relaxat are mai puține pe rând)
                          gridTemplateColumns: `repeat(${
                            density === 'compact'
                              ? 8
                              : density === 'relaxat'
                              ? 6
                              : 6
                          }, 1fr)`,
                          gap: '30px 20px',
                        }}
                      >
                        {/* MODIFICARE CHEIE: .slice(0, d.cpg) 
                          Asta asigură că preview-ul arată EXACT ce intră pe prima pagină din export
                        */}
                        {activeDisplayData.slice(0, d.cpg).map((group, idx) => (
                          <div key={idx}>
                            <div
                              style={{
                                fontFamily: current.fontFamily,
                                color: opisConfig.color,
                                fontSize: 20,
                                borderBottom: `${current.borderStyle} ${opisConfig.color}`,
                                marginBottom: 10,
                                fontWeight: 'bold',
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
                                <b>{g.tableNumber}</b>
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
                    Export Panou A2
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
        height="75%"
        onClose={() => setSettingsVisible(false)}
        open={settingsVisible}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
              DENSITATE TEXT (CÂT DE MULT ÎNCAPE):
            </div>
            <Segmented
              block
              value={density}
              onChange={(v) => setDensity(v as DensityKey)}
              options={[
                { label: 'Relaxat', value: 'relaxat' },
                { label: 'Standard', value: 'standard' },
                { label: 'Compact', value: 'compact' },
              ]}
            />
          </div>

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
              setOpisConfig({ ...opisConfig, template: e.target.value })
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
            Aplica Modificari
          </Button>
        </Space>
      </Drawer>

      {/* MOTOR EXPORT ASCUNS (Rămâne neschimbat la logică) */}
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
                  fontSize: d.titleSize,
                  textTransform:
                    current.textTransform as React.CSSProperties['textTransform'],
                }}
              >
                {weddingNames.bride} & {weddingNames.groom}
              </div>
              <div
                style={{
                  fontFamily: current.secondaryFont,
                  fontSize: d.subtitleSize,
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
                gridTemplateColumns: `repeat(${
                  density === 'compact' ? 8 : 6
                }, 1fr)`,
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
                      fontSize: d.headerSize,
                      marginBottom: 10,
                    }}
                  >
                    {item.letter}
                  </div>
                  {item.guests.map((g, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: d.fontSize,
                        fontFamily: current.secondaryFont,
                        textTransform:
                          current.textTransform as React.CSSProperties['textTransform'],
                        marginBottom: 6,
                      }}
                    >
                      <span>
                        {g.lastName} {g.firstName}
                      </span>
                      <b>{g.tableNumber}</b>
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
