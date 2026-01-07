'use client';

import { Template } from '@/core/types';
import { defaultTemplates } from '@/lib/templates/templates';
import { Button } from 'antd';
import { CheckCircle2, MapPin } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TemplateDetailsPage() {
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const { templateName } = useParams<{
    templateName: string;
  }>();

  const getTemplateByName = (name: string) => {
    return defaultTemplates.find(
      (template) => template.name === decodeURIComponent(name)
    );
  };

  useEffect(() => {
    const t = getTemplateByName(templateName);

    setTemplate(t);
  }, [templateName]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:flex lg:gap-16 mt-[50px] lg:mt-[100px]">
        {/* COLOANA STÂNGA: Detalii (Scrollable) */}
        <div className="lg:w-1/2 space-y-12">
          <section>
            <span className="text-purple-600 font-semibold tracking-wide uppercase text-sm">
              {template?.type}
            </span>
            <h1 className="text-5xl font-extrabold text-slate-900 mt-2">
              {template?.name}
            </h1>
            <p className="text-xl text-slate-600 mt-6 leading-relaxed">
              {template?.description}
            </p>
            <div className="flex items-center gap-6 mt-8">
              <Button
                block
                type="primary"
                size="large"
                className="bg-purple-600 hover:bg-purple-700 px-8 rounded-full shadow-lg transition-all hover:scale-105"
              >
                Alege
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="bg-purple-600 hover:bg-purple-700 px-8 rounded-full shadow-lg transition-all hover:scale-105"
              >
                Personalizează Modelul
              </Button>
            </div>
          </section>

          <div className="block lg:hidden w-full mb-8">
            <img
              src={template?.thumbnailUrl}
              className="w-full h-auto rounded-xl shadow-lg"
              alt="Preview"
            />
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Design responsiv',
              'Confirmare online',
              'Harta locației',
              'Playlist muzical',
              'Galerie foto',
              'Countdown până la eveniment',
            ].map((feature: string) => (
              <div
                key={feature}
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Ce include acest model?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-purple-100 p-3 rounded-xl h-fit">
                  <MapPin className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold">Locație Interactivă</h4>
                  <p className="text-slate-500">
                    Invitații pot deschide Google Maps direct din invitație.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="hidden lg:flex lg:w-1/2 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] items-center justify-center">
          <div className="relative w-full max-w-[500px] transition-all duration-500 hover:scale-[1.02]">
            <img
              src={template?.thumbnailUrl}
              alt={template?.name || 'Preview model'}
              className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-2xl"
            />

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
