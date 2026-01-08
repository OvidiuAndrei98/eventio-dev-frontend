'use client';

import { Template } from '@/core/types';
import { defaultTemplates } from '@/lib/templates/templates';
import { Button, Tag, Divider } from 'antd';
import { CheckCircle2, Smartphone, ArrowRight, Eye } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TemplateDetailsPage() {
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const { templateName } = useParams<{ templateName: string }>();

  const productInfo = {
    price: '200',
    currency: 'RON',
    sku: `INV-${template?.name?.slice(0, 5).toUpperCase()}`,
  };

  useEffect(() => {
    const t = defaultTemplates.find(
      (t) => t.name === decodeURIComponent(templateName)
    );
    setTemplate(t);
  }, [templateName]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      {/* JSON-LD pentru Google Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: template?.name,
            image: template?.thumbnailUrl,
            description: template?.description,
            sku: productInfo.sku,
            offers: {
              '@type': 'Offer',
              price: productInfo.price,
              priceCurrency: productInfo.currency,
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[55%]">
            <div className="sticky top-28 space-y-6">
              <div className="group relative aspect-[4/5] lg:aspect-square bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

                <img
                  src={template?.thumbnailUrl}
                  alt={template?.name}
                  className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="lg:w-[45%] py-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  {template?.type || 'Digital Template'}
                </span>
                <span className="text-slate-300 text-xs font-mono">
                  SKU: {productInfo.sku}
                </span>
              </div>

              <h1 className="text-6xl font-bold tracking-tight text-slate-900 mb-6">
                {template?.name}
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed mb-8">
                {template?.description}
              </p>

              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-slate-400 text-sm block mb-1">
                      Preț Final
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-5xl font-black text-slate-900">
                        {productInfo.price}
                      </span>
                      <span className="text-xl font-bold text-slate-400">
                        {productInfo.currency}
                      </span>
                    </div>
                  </div>
                  <Tag
                    color="green"
                    className="border-none rounded-full px-4 py-1 font-bold"
                  >
                    Disponibil Instant
                  </Tag>
                </div>

                <Divider className="my-0" />

                <div className="space-y-4">
                  <Button
                    block
                    type="primary"
                    size="large"
                    className="h-16 rounded-2xl bg-slate-900 hover:bg-black border-none text-lg font-bold flex items-center justify-center gap-2 group"
                  >
                    Personalizează acum{' '}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                  <Button
                    block
                    size="large"
                    icon={<Eye size={18} />}
                    className="h-16 rounded-2xl border-slate-200 font-bold text-slate-600 hover:text-purple-600 hover:border-purple-600"
                  >
                    Vezi Previzualizare Live
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    'Editare nelimitată',
                    'Confirmare RSVP',
                    'Harta Google Maps',
                    'Galerie Foto',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-purple-500" />
                      <span className="text-sm font-semibold text-slate-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 space-y-8">
                <h3 className="text-xl font-bold">Experiență Premium</h3>
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg italic">
                      Perfect pe orice ecran
                    </h4>
                    <p className="text-slate-500">
                      Invitația ta se va adapta automat pe telefonul, tableta
                      sau laptopul invitaților tăi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
