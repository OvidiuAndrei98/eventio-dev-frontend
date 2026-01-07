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
  Card,
  Divider,
} from 'antd';
import {
  DownloadOutlined,
  InfoCircleOutlined,
  ExpandOutlined,
  UserOutlined,
  LayoutOutlined,
  SortAscendingOutlined,
  BlockOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import { domToCanvas } from 'modern-screenshot';
import { Guest } from '@/core/types';

interface TablePlanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportPdf: () => void;
  exportExcel: () => void;
  guests?: Guest[];
}

type DensityKey = 'relaxat' | 'standard' | 'compact';

const TablePlanExportModal = ({
  isOpen,
  onClose,
  guests = [],
  exportPdf,
  exportExcel,
}: TablePlanExportModalProps) => {
  const [activeTab, setActiveTab] = useState('2');
  const [exportMode, setExportMode] = useState<'alfabetic' | 'mese'>(
    'alfabetic'
  );
  const [density, setDensity] = useState<DensityKey>('standard');

  const [weddingNames, setWeddingNames] = useState({
    bride: 'Narcisa',
    groom: 'Andrei',
    subtitle: 'Bun venit la nunta noastră',
  });

  const [opisConfig, setOpisConfig] = useState<{
    template: 'minimal' | 'floral' | 'modern';
    color: string;
  }>({
    template: 'minimal',
    color: '#3d3d3d',
  });

  const [isExporting, setIsExporting] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

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

  interface TemplateStyle {
    fontFamily: string;
    secondaryFont: string;
    bgGradient?: string;
    bgImage?: string;
    overlay: string;
    borderStyle: string;
    textTransform: 'uppercase' | 'none';
  }

  const templates: Record<'minimal' | 'floral' | 'modern', TemplateStyle> = {
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

  const currentStyle = templates[opisConfig.template] || templates.minimal;

  const activeDisplayData = useMemo(() => {
    const baseData: Array<{ letter: string; guests: Guest[] }> = [];
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

  const [activePageItems, setActivePageItems] = useState<
    { letter: string; guests: Guest[] }[]
  >([]);

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
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutOutlined style={{ color: '#1890ff' }} />
          <span>Centru Comandă Export</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1300}
      centered
      destroyOnClose
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700&family=Montserrat:wght@300;400;700&display=swap');`}</style>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: '1',
            label: (
              <span>
                <BlockOutlined /> Planul Sălii
              </span>
            ),
            children: (
              <div
                style={{
                  height: 650,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa',
                  borderRadius: 12,
                  border: '1px dashed #d9d9d9',
                }}
              >
                <Card
                  style={{
                    width: 400,
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <LayoutOutlined
                    style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 20 }}
                  />
                  <h3>Previzualizare Plan Salon</h3>
                  <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
                    Aici poți genera layout-ul vizual al meselor așa cum sunt
                    așezate în sală.
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FilePdfOutlined />}
                    onClick={exportPdf}
                    block
                  >
                    Exportă Plan PDF
                  </Button>
                </Card>
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <SortAscendingOutlined /> Panou Intrare (Opis)
              </span>
            ),
            children: (
              <div style={{ display: 'flex', gap: '24px', height: '700px' }}>
                <div
                  style={{
                    width: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    overflowY: 'auto',
                    paddingRight: '8px',
                  }}
                >
                  <Card
                    size="small"
                    title={
                      <span style={{ fontSize: 12 }}>
                        <InfoCircleOutlined /> 1. CONFIGURARE EXPORT
                      </span>
                    }
                    headStyle={{ background: '#f0f5ff' }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#8c8c8c',
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        MOD ORGANIZARE DATE:
                      </span>
                      <Segmented
                        block
                        value={exportMode}
                        onChange={(v) =>
                          setExportMode(v as 'alfabetic' | 'mese')
                        }
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
                      />
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#8c8c8c',
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        DENSITATE TEXT (PAGINAȚIE):
                      </span>
                      <Radio.Group
                        block
                        value={density}
                        onChange={(e) => setDensity(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                      >
                        <Radio.Button value="relaxat">Relaxat</Radio.Button>
                        <Radio.Button value="standard">Standard</Radio.Button>
                        <Radio.Button value="compact">Compact</Radio.Button>
                      </Radio.Group>
                    </div>
                    <ul
                      style={{
                        background: '#e2f0f5ff',
                        fontSize: '10px',
                        color: '#262626',
                        margin: 0,
                        padding: '8px',
                        marginTop: '12px',
                        borderRadius: '4px',
                      }}
                    >
                      <li>
                        Format: <b>PDF A2 Landscape</b>
                      </li>
                      <li>
                        Rezoluție: <b>300 DPI (Print Ready)</b>
                      </li>
                    </ul>
                  </Card>

                  <Card
                    size="small"
                    title={
                      <span style={{ fontSize: 12 }}>
                        2. PERSONALIZARE DESIGN
                      </span>
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 10, color: '#8c8c8c' }}>
                          MIREASĂ
                        </span>
                        <Input
                          size="middle"
                          value={weddingNames.bride}
                          onChange={(e) =>
                            setWeddingNames({
                              ...weddingNames,
                              bride: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 10, color: '#8c8c8c' }}>
                          MIRE
                        </span>
                        <Input
                          size="middle"
                          value={weddingNames.groom}
                          onChange={(e) =>
                            setWeddingNames({
                              ...weddingNames,
                              groom: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 10, color: '#8c8c8c' }}>
                        MESAJ SUBTITLU
                      </span>
                      <Input.TextArea
                        rows={2}
                        value={weddingNames.subtitle}
                        onChange={(e) =>
                          setWeddingNames({
                            ...weddingNames,
                            subtitle: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ marginBottom: 12 }}>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#8c8c8c',
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        STIL VIZUAL:
                      </span>
                      <Radio.Group
                        value={opisConfig.template}
                        onChange={(e) =>
                          setOpisConfig({
                            ...opisConfig,
                            template: e.target.value,
                          })
                        }
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                        block
                      >
                        <Radio.Button value="minimal">Minimal</Radio.Button>
                        <Radio.Button value="floral">Floral</Radio.Button>
                        <Radio.Button value="modern">Modern</Radio.Button>
                      </Radio.Group>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: 11 }}>Culoare Text:</span>
                      <input
                        type="color"
                        value={opisConfig.color}
                        onChange={(e) =>
                          setOpisConfig({
                            ...opisConfig,
                            color: e.target.value,
                          })
                        }
                        style={{
                          width: 60,
                          height: 24,
                          border: '1px solid #d9d9d9',
                          padding: 2,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </Card>

                  <Button
                    type="primary"
                    size="large"
                    onClick={handleExport}
                    icon={<DownloadOutlined />}
                    block
                    style={{ height: 55, fontWeight: 700, background: '#000' }}
                  >
                    {isExporting ? 'Se exportă...' : 'Exportă Opis PDF'}
                  </Button>
                </div>

                {/* ZONA PREVIZUALIZARE DREAPTA */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#595959' }}>
                      <ExpandOutlined /> Previzualizare Format Real (1200px)
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        background: '#e6f7ff',
                        color: '#1890ff',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      Total: {Math.ceil(activeDisplayData.length / d.cpg)}{' '}
                      pagini
                    </span>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      borderRadius: 12,
                      border: '1px solid #ddd',
                      background: '#8c8c8c',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: '1200px',
                        minHeight: '100px',
                        background: currentStyle.bgGradient || '#fff',
                        position: 'relative',
                        padding: '60px',
                        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                      }}
                    >
                      {/* IMAGINE FUNDAL */}
                      {currentStyle.bgImage && (
                        <img
                          src={currentStyle.bgImage}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                          }}
                          alt="background"
                        />
                      )}

                      {/* OVERLAY CULOARE */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: currentStyle.overlay,
                          zIndex: 1,
                        }}
                      />

                      {/* CONȚINUT POSTER */}
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                          <div
                            style={{
                              fontFamily: currentStyle.fontFamily,
                              color: opisConfig.color,
                              fontSize: 64,
                              margin: 0,
                              textTransform:
                                currentStyle.textTransform as React.CSSProperties['textTransform'],
                            }}
                          >
                            {weddingNames.bride} & {weddingNames.groom}
                          </div>
                          <div
                            style={{
                              fontFamily: currentStyle.secondaryFont,
                              fontSize: 18,
                              opacity: 0.8,
                              textTransform: 'uppercase',
                              marginTop: 15,
                              letterSpacing: 6,
                            }}
                          >
                            {weddingNames.subtitle}
                          </div>
                        </div>

                        {/* GRID GUEST LIST */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${
                              density === 'compact' ? 8 : 6
                            }, 1fr)`,
                            gap: '40px 25px',
                          }}
                        >
                          {activeDisplayData
                            .slice(0, d.cpg)
                            .map((group, idx) => (
                              <div key={idx}>
                                <div
                                  style={{
                                    fontFamily: currentStyle.fontFamily,
                                    color: opisConfig.color,
                                    fontSize: 20,
                                    borderBottom: `${currentStyle.borderStyle} ${opisConfig.color}`,
                                    marginBottom: 10,
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {group.letter}
                                </div>
                                {group.guests.map((g: Guest, i: number) => (
                                  <div
                                    key={i}
                                    style={{
                                      fontSize: 13,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontFamily: currentStyle.secondaryFont,
                                      marginBottom: 6,
                                    }}
                                  >
                                    <span
                                      style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '85%',
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
                </div>
              </div>
            ),
          },
          {
            key: '3',
            label: (
              <span>
                <UserOutlined /> Listă Recepție
              </span>
            ),
            children: (
              <div
                style={{
                  height: 650,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f5f5f5',
                  borderRadius: 12,
                }}
              >
                <Card style={{ width: 400, textAlign: 'center' }}>
                  <UserOutlined
                    style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 20 }}
                  />
                  <h3>Listă Hostess / Recepție</h3>
                  <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
                    Descarcă lista completă în format tabelar pentru personalul
                    de la intrare.
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FileExcelOutlined />}
                    onClick={exportExcel}
                    block
                  >
                    Exportă Listă Excel
                  </Button>
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* MOTOR EXPORT A2 (HIDDEN) */}
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
            background: currentStyle.bgGradient || '#ffffff',
            position: 'relative',
            padding: '60px 100px',
          }}
        >
          {currentStyle.bgImage && (
            <img
              src={currentStyle.bgImage}
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
              backgroundColor: currentStyle.overlay,
            }}
          />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div
                style={{
                  fontFamily: currentStyle.fontFamily,
                  color: opisConfig.color,
                  fontSize: d.titleSize,
                  textTransform:
                    currentStyle.textTransform as React.CSSProperties['textTransform'],
                }}
              >
                {weddingNames.bride} & {weddingNames.groom}
              </div>
              <div
                style={{
                  fontFamily: currentStyle.secondaryFont,
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
                      fontFamily: currentStyle.fontFamily,
                      color: opisConfig.color,
                      borderBottom: `${currentStyle.borderStyle} ${opisConfig.color}`,
                      fontSize: 20,
                      marginBottom: 10,
                      fontWeight: 'bold',
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
                        fontSize: d.fontSize,
                        fontFamily: currentStyle.secondaryFont,
                        textTransform:
                          currentStyle.textTransform as React.CSSProperties['textTransform'],
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

export default TablePlanExportModal;
