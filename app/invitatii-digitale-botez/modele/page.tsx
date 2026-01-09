'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { defaultTemplates } from '@/lib/templates/templates';
import { useRouter } from 'next/navigation';

export default function ModelePage() {
  const templates = defaultTemplates.filter(
    (template) => template.type === 'bapthism'
  );
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 mt-[50px] lg:mt-[100px]">
      <h1 className="text-4xl font-bold text-center mb-8">
        Modele Invitații Digitale Nuntă
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6 w-full">
        {templates.map((template) => (
          <div
            key={template.templateId}
            className="bg-[var(--primary-color)]/5 rounded-xl shadow-lg overflow-visible hover:shadow-xl transition-shadow duration-300 min-w-[340px] mt-4"
          >
            <div className="flex h-80">
              <div className="w-1/2 py-4 px-2 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">{template.name}</h2>
                  <p className="text-gray-400 mb-4 line-clamp-6">
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

              <div className="w-1/2 relative bg-[var(--primary-color)]/10 overflow-visible flex items-center justify-center rounded-r-xl">
                <Image
                  src={template.thumbnailUrl}
                  alt={template.name}
                  width={170}
                  height={140}
                  className="object-cover object-left "
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
