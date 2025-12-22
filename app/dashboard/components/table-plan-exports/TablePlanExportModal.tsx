'use client';

import React, { useRef, useState } from 'react';
import { Modal, Tabs, Button, Radio, Input, message } from 'antd';
import {
  FilePdfOutlined,
  FileExcelOutlined,
  PictureOutlined,
  DownloadOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import { CanvasElement, Guest } from '@/core/types';
import html2canvas from 'html2canvas';

interface TablePlanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  tables: CanvasElement[];
}

const { TabPane } = Tabs;

const TablePlanExportModal = ({
  isOpen,
  onClose,
  guests,
  tables,
}: TablePlanExportModalProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [weddingNames, setWeddingNames] = useState({
    bride: 'Narcisa',
    groom: 'Andrei',
  });
  const [opisConfig, setOpisConfig] = useState({
    template: 'floral',
    color: '#b46acb',
  });

  // Mapare stiluri cu fonturi și BACKGROUND-URI specifice
  const templateStyles: any = {
    minimal: {
      font: 'times',
      css: '"Playfair Display", serif',
      label: 'Classic Serif',
      background: 'linear-gradient(to bottom, #fdfdfd, #f4f4f4)', // Efect de hârtie
    },
    floral: {
      font: 'times',
      css: '"Great Vibes", cursive',
      label: 'Handwriting Romantic',
      background:
        'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url("/opis_backgrounds/floral_bg.jpg")', // Textură fină + roz discret
      customStyles: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },
    },
    luxury: {
      font: 'times',
      css: '"Playfair Display", serif',
      label: 'Elegant Gold',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff9e6 100%)',
    },
    modern: {
      font: 'helvetica',
      css: '"Inter", sans-serif',
      label: 'Modern Clean',
      background: '#ffffff', // Alb pur
    },
  };

  const currentStyle = templateStyles[opisConfig.template];

  const getMonogram = () => {
    return `${weddingNames.bride
      .charAt(0)
      .toUpperCase()}  |  ${weddingNames.groom.charAt(0).toUpperCase()}`;
  };

  const handleExportOpis = async () => {
    if (!previewRef.current) return;
    const hide = message.loading(
      'Se generează PDF-ul fără erori de culoare...',
      0
    );

    try {
      await document.fonts.ready;

      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        // ACEASTA ESTE SOLUȚIA PENTRU OKLAB / OKLCH
        onclone: (clonedDoc) => {
          // 1. Forțăm body și html să aibă culori simple pe care html2canvas le înțelege
          const body = clonedDoc.body;
          const html = clonedDoc.documentElement;

          if (body) {
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#000000';
            // Eliminăm orice variabilă CSS care ar putea conține oklab/oklch
            body.setAttribute(
              'style',
              'background-color: white !important; color: black !important;'
            );
          }
          if (html) {
            html.setAttribute('style', 'background-color: white !important;');
          }

          // 2. Opțional: Căutăm elemente care ar putea avea stiluri oklab și le resetăm
          // Acest pas previne erarea dacă oklab e definit inline undeva în aplicație
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a2',
      });

      doc.addImage(imgData, 'JPEG', 0, 0, 420, 594);
      doc.save(`Opis_A2_${weddingNames.bride}_${weddingNames.groom}.pdf`);
      message.success('PDF generat cu succes!');
    } catch (e) {
      console.error('Eroare export:', e);
      message.error('Eroare la procesarea stilurilor vizuale.');
    } finally {
      hide();
    }
  };

  // Functiile handleExportExcel si handleExportCanvas raman neschimbate...
  const handleExportExcel = () => {
    /* ... la fel ca in codul tau ... */
  };
  const handleExportCanvas = async () => {
    /* ... la fel ca in codul tau ... */
  };

  return (
    <Modal
      title="Centru Export Eveniment"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
    >
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <FilePdfOutlined /> OPIS PANOU A2
            </span>
          }
          key="1"
        >
          <div className="flex flex-col lg:flex-row gap-8 py-4">
            {/* COLOANA SETĂRI */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
                  <HeartOutlined className="text-pink-500" /> Date Mirilor
                </h4>
                <Input
                  className="mb-2"
                  placeholder="Nume Mireasă"
                  value={weddingNames.bride}
                  onChange={(e) =>
                    setWeddingNames({ ...weddingNames, bride: e.target.value })
                  }
                />
                <Input
                  placeholder="Nume Mire"
                  value={weddingNames.groom}
                  onChange={(e) =>
                    setWeddingNames({ ...weddingNames, groom: e.target.value })
                  }
                />
              </div>

              <div>
                <h4 className="font-bold mb-3 text-sm text-gray-600">
                  Model Panou & Stil
                </h4>
                <Radio.Group
                  value={opisConfig.template}
                  onChange={(e) =>
                    setOpisConfig({ ...opisConfig, template: e.target.value })
                  }
                  className="grid grid-cols-2 gap-2 w-full"
                >
                  <Radio.Button
                    value="minimal"
                    className="flex items-center justify-center h-10"
                  >
                    Minimal
                  </Radio.Button>
                  <Radio.Button
                    value="floral"
                    className="flex items-center justify-center h-10"
                  >
                    Floral
                  </Radio.Button>
                  <Radio.Button
                    value="luxury"
                    className="flex items-center justify-center h-10"
                  >
                    Luxury
                  </Radio.Button>
                  <Radio.Button
                    value="modern"
                    className="flex items-center justify-center h-10"
                  >
                    Modern
                  </Radio.Button>
                </Radio.Group>
                <p className="mt-2 text-[10px] italic text-gray-400">
                  Font: {currentStyle.label}
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2 text-sm text-gray-600">
                  Culoare Accente
                </h4>
                <input
                  type="color"
                  className="w-full h-10 rounded cursor-pointer border-none shadow-sm"
                  value={opisConfig.color}
                  onChange={(e) =>
                    setOpisConfig({ ...opisConfig, color: e.target.value })
                  }
                />
              </div>

              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportOpis}
                block
                size="large"
                className="h-14 bg-black border-none text-lg shadow-lg"
              >
                Descarcă PDF A2
              </Button>
            </div>

            {/* PREVIEW DINAMIC CU BACKGROUND */}
            <div className="flex-1 bg-gray-200 p-4 rounded-3xl flex justify-center items-center overflow-hidden border border-gray-300 shadow-inner">
              <div
                ref={previewRef}
                id="export-this-element"
                className={`w-[360px] h-[510px] shadow-2xl p-10 transition-all duration-500 relative flex flex-col ${
                  opisConfig.template === 'luxury'
                    ? 'border-[5px] border-[#D4AF37]'
                    : 'border border-white/50'
                }`}
                style={{
                  fontFamily: currentStyle.css,
                  backgroundImage: currentStyle.background,
                  ...currentStyle.customStyles,
                }}
              >
                {/* Header */}
                <div className="text-center mb-8 bg-transparent z-10">
                  <div
                    className="text-5xl font-light mb-2 tracking-tighter"
                    style={{ fontFamily: currentStyle.css }}
                  >
                    {getMonogram()}
                  </div>
                  <div
                    className="text-[13px] font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: currentStyle.css }}
                  >
                    {weddingNames.bride} & {weddingNames.groom}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-x-3 gap-y-4 overflow-hidden z-10">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
                    <div key={l} className="text-center">
                      <div
                        style={{
                          color: opisConfig.color,
                          fontFamily: currentStyle.css,
                        }}
                        className="text-[18px] border-b border-black/5 mb-1 leading-tight"
                      >
                        {l}
                      </div>
                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Popescu Ionel ... 4
                      </div>

                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Ionescu Maria ... 4
                      </div>

                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Lazar Andreea ... 4
                      </div>

                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Marinescu Daniel ... 4
                      </div>

                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Georgescu Ana ... 4
                      </div>

                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Popa Alina ... 4
                      </div>

                      <div className="text-[6px] text-gray-400 uppercase tracking-tighter">
                        Radu Mihai ... 4
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 left-0 w-full text-center text-[7px] text-gray-300 tracking-[0.4em] uppercase">
                  Planyvite
                </div>
              </div>
            </div>
          </div>
        </TabPane>

        {/* Celelalte tab-uri raman identice... */}
        <TabPane
          tab={
            <span>
              <PictureOutlined /> PLAN SALON
            </span>
          }
          key="2"
        >
          {/* ... continutul tau original ... */}
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileExcelOutlined /> LISTĂ EXCEL
            </span>
          }
          key="3"
        >
          {/* ... continutul tau original ... */}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default TablePlanExportModal;
