'use client';

import { Template } from '@/core/types';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PreviewPage = () => {
  const { templateId } = useParams<{
    templateId: string;
  }>();
  const [template, setTemplate] = useState<Template>({} as Template);
  const [loading, setLoading] = useState(true);

  const fetchTemplate = async () => {
    try {
      const response = await queryTemplateById(templateId);
      setTemplate(response);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  if (!loading && !template?.templateId) {
    notFound();
  }

  return loading || !template ? (
    <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
      <span className="loader"></span>
    </div>
  ) : (
    <div
      className={`w-full h-[calc(100svh-80px)] overflow-y-[auto] ${template.settings.backgroundColor} max-w-[1200px] mx-auto`}
    >
      <TemplateRenderer invitationData={template} editMode={false} />
      <div className="bg-black h-[80px] text-white p-4 absolute bottom-0 left-0 right-0 flex justify-center items-center z-2">
        Atentie! Aceasta este o previzualizare a invitatiei vizibila doar pentru
        tine.
      </div>
    </div>
  );
};

export default PreviewPage;
