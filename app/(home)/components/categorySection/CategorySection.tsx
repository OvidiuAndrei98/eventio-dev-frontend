'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { defaultTemplates } from '@/lib/templates/templates';
import { useRouter } from 'next/navigation';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';

interface CategorySectionProps {
  type: 'wedding' | 'bapthism' | 'anniversary';
  smallHeader?: string;
  primaryTitle?: string;
  limit?: number;
}

const CategorySection = ({
  type,
  smallHeader = 'MODELE DISPONIBILE',
  primaryTitle = 'Alege designul care ți se potrivește',
  limit = 3,
}: CategorySectionProps) => {
  const router = useRouter();

  const templates = defaultTemplates
    .filter((template) => template.type === type)
    .slice(0, limit);

  return (
    // Am adăugat overflow-hidden pe containerul mare ca să nu apară scroll orizontal pe mobil
    <div
      className="mx-auto max-w-7xl px-6 py-16 overflow-hidden md:overflow-visible"
      id="templates-section"
    >
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1}
        threshold={0.2}
      >
        <div className="text-center mb-16">
          <span className="small-header block mb-2">{smallHeader}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)]">
            {primaryTitle}
          </h2>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8 w-full justify-items-center">
        {templates.map((template) => (
          <AnimatedContent
            key={template.templateId}
            distance={150}
            direction="horizontal"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1}
            threshold={0.2}
          >
            <div className="bg-[var(--primary-color)]/5 rounded-xl shadow-lg overflow-visible hover:shadow-xl transition-shadow duration-300 w-full max-w-[380px] mt-4">
              <div className="flex h-80">
                {/* Partea Stângă */}
                <div className="w-1/2 py-6 px-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                      {template.name}
                    </h2>
                    <p className="text-gray-500 mb-4 line-clamp-6 text-sm italic">
                      {template.description}
                    </p>
                  </div>

                  <Button
                    type="primary"
                    block
                    onClick={() => router.push(`/modele/${template.name}`)}
                  >
                    Detalii
                  </Button>
                </div>

                {/* Partea Dreaptă - Reconstruită pentru siguranță pe mobil */}
                <div className="w-1/2 relative bg-[var(--primary-color)]/10 overflow-visible flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                    <Image
                      src={template.thumbnailUrl}
                      alt={template.name}
                      width={170}
                      height={140}
                      className="object-contain drop-shadow-2xl"
                      style={{
                        // Pe mobil (ecran mic) imaginea rămâne la locul ei,
                        // pe desktop (peste 768px) aplicăm translația spre exterior
                        transform:
                          typeof window !== 'undefined' &&
                          window.innerWidth > 768
                            ? 'translateX(20px)'
                            : 'none',
                        maxWidth: '120%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        ))}
      </div>

      <div className="text-center mt-20">
        <Button
          variant="outlined"
          size="large"
          onClick={() =>
            router.push(
              `/${
                type === 'wedding'
                  ? 'invitatii-digitale-nunta'
                  : type === 'bapthism'
                  ? 'invitatii-digitale-botez'
                  : 'invitatii-digitale-majorat'
              }/modele`
            )
          }
        >
          Vezi toate modelele
        </Button>
      </div>
    </div>
  );
};

export default CategorySection;
