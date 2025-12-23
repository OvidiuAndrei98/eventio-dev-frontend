'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Modal, Button, Radio, Input, message, Tabs, Segmented } from 'antd';
import {
  DownloadOutlined,
  InfoCircleOutlined,
  ExpandOutlined,
  UserOutlined,
  LayoutOutlined,
  SortAscendingOutlined,
  BlockOutlined,
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

const TablePlanExportModal = ({
  isOpen,
  onClose,
  guests = [],
  exportPdf,
  exportExcel,
}: TablePlanExportModalProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const [exportMode, setExportMode] = useState<'alfabetic' | 'mese'>(
    'alfabetic'
  );

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

  const exportRef = useRef<HTMLDivElement>(null);

  type TemplateConfig = {
    fontFamily: string;
    secondaryFont: string;
    // Gradient care simulează textura de hârtie (crem/ivory cu variații)
    bgGradient: string;
    bgImage: string;
    overlay: string;
    titleSize: string;
    subtitleSize: string;
    letterSpacing: string;
    borderStyle: string;
    textTransform: React.CSSProperties['textTransform'];
    fontWeight: string;
  };

  const templates: Record<'minimal' | 'floral' | 'modern', TemplateConfig> = {
    minimal: {
      fontFamily: "'Cinzel', serif",
      secondaryFont: "'Montserrat', sans-serif",
      // Gradient care simulează textura de hârtie (crem/ivory cu variații)
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

  const current = templates[opisConfig.template];

  // Logica de date
  const alphabetGroups = useMemo(() => {
    const sorted = [...guests].sort((a, b) =>
      (a.lastName || '').localeCompare(b.lastName || '', 'ro')
    );
    const groups: { letter: string; guests: Guest[] }[] = [];
    const initials = Array.from(
      new Set(sorted.map((g) => (g.lastName || ' ')[0].toUpperCase()))
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
      .filter((g) => g.tableNumber)
      .forEach((g) => {
        const t = g.tableNumber || 'Fără masă';
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
      pdf.save(`Panou_${exportMode}_${weddingNames.bride}.pdf`);
      message.success('Export realizat!');
    } catch (e) {
      message.error('Eroare export.');
    } finally {
      setActivePageItems([]);
      hide();
    }
  };

  return (
    <Modal
      title="Centru Comandă Eveniment"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1400}
      centered
      destroyOnClose
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700&family=Montserrat:wght@300;400;700&display=swap');
      `}</style>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: (
              <span>
                <BlockOutlined /> Plan Salon
              </span>
            ),
            children: (
              <div
                style={{
                  height: 600,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Button onClick={exportPdf}>Export Plan Salon</Button>
                </div>
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <SortAscendingOutlined /> Export Panou Opis
              </span>
            ),
            children: (
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* SIDEBAR REORGANIZAT */}
                <div
                  style={{
                    width: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      background: '#f0f5ff',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #adc6ff',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '11px',
                        color: '#1d39c4',
                        marginBottom: '10px',
                      }}
                    >
                      <InfoCircleOutlined /> CONFIGURARE EXPORT
                    </h4>
                    <span style={{ fontSize: '10px', color: '#666' }}>
                      MOD ORGANIZARE:
                    </span>
                    <Segmented
                      block
                      value={exportMode}
                      onChange={(v: string | number | boolean) =>
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
                      style={{ marginTop: 5, marginBottom: 15 }}
                    />
                    <ul
                      style={{
                        fontSize: '10px',
                        color: '#262626',
                        paddingLeft: '15px',
                        margin: 0,
                      }}
                    >
                      <li>
                        Format: <b>PDF A2 Landscape</b>
                      </li>
                      <li>
                        Rezoluție: <b>300 DPI (Print Ready)</b>
                      </li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: '#f8f8f8',
                      padding: '15px',
                      borderRadius: '10px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '11px',
                        color: '#888',
                        marginBottom: '10px',
                      }}
                    >
                      TEXT ȘI DESIGN
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                        marginBottom: '8px',
                      }}
                    >
                      <Input
                        size="small"
                        value={weddingNames.bride}
                        onChange={(e) =>
                          setWeddingNames({
                            ...weddingNames,
                            bride: e.target.value,
                          })
                        }
                      />
                      <Input
                        size="small"
                        value={weddingNames.groom}
                        onChange={(e) =>
                          setWeddingNames({
                            ...weddingNames,
                            groom: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Input.TextArea
                      size="small"
                      rows={2}
                      value={weddingNames.subtitle}
                      onChange={(e) =>
                        setWeddingNames({
                          ...weddingNames,
                          subtitle: e.target.value,
                        })
                      }
                      style={{ marginBottom: 10 }}
                    />

                    <Radio.Group
                      value={opisConfig.template}
                      onChange={(e) =>
                        setOpisConfig({
                          ...opisConfig,
                          template: e.target.value,
                        })
                      }
                      block
                      size="small"
                      style={{ marginBottom: 10 }}
                    >
                      <Radio.Button value="minimal">Minimal</Radio.Button>
                      <Radio.Button value="floral">Floral</Radio.Button>
                      <Radio.Button value="modern">Modern</Radio.Button>
                    </Radio.Group>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontSize: 11 }}>Culoare:</span>
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
                          flex: 1,
                          height: 25,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    onClick={handleExport}
                    icon={<DownloadOutlined />}
                    block
                    style={{ height: 60, fontWeight: 800, background: '#000' }}
                  >
                    DESCARCĂ PDF A2
                  </Button>
                </div>

                {/* PREVIEW */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: '#888',
                    }}
                  >
                    <span>
                      <ExpandOutlined /> Previzualizare{' '}
                      {exportMode === 'alfabetic' ? 'Opis' : 'Plan Mese'}
                    </span>
                    <span>
                      Pagini: {Math.ceil(activeDisplayData.length / 12)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '600px',
                      background: current.bgGradient || '#fff',
                      borderRadius: 12,
                      border: '2px solid #eee',
                      position: 'relative',
                      overflow: 'hidden',
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
                        alt="bg"
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: current.overlay,
                      }}
                    />
                    <div
                      style={{ position: 'relative', zIndex: 1, padding: 30 }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: 25 }}>
                        <h2
                          style={{
                            fontFamily: current.fontFamily,
                            color: opisConfig.color,
                            fontSize: 44,
                            margin: 0,
                            textTransform: current.textTransform,
                          }}
                        >
                          {weddingNames.bride} & {weddingNames.groom}
                        </h2>
                        <p
                          style={{
                            fontFamily: current.secondaryFont,
                            fontSize: 9,
                            textTransform: 'uppercase',
                            letterSpacing: 3,
                            marginTop: 4,
                            color: '#666',
                          }}
                        >
                          {weddingNames.subtitle}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gap: '15px 12px',
                        }}
                      >
                        {activeDisplayData.slice(0, 12).map((group, idx) => (
                          <div key={idx}>
                            <div
                              style={{
                                fontFamily: current.fontFamily,
                                color: opisConfig.color,
                                fontSize: '16px',
                                borderBottom: `${current.borderStyle} ${opisConfig.color}`,
                                marginBottom: '6px',
                                fontWeight: current.fontWeight,
                              }}
                            >
                              {group.letter}
                            </div>
                            {group.guests.map((g, i) => (
                              <div
                                key={i}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  fontSize: 7,
                                  fontFamily: current.secondaryFont,
                                  textTransform: current.textTransform,
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
                  height: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f5f5f5',
                  borderRadius: 12,
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => exportExcel()}
                >
                  Export Tabel A4 (Hostess)
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* MOTOR EXPORT ASCUNS */}
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
                  textTransform: current.textTransform,
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
