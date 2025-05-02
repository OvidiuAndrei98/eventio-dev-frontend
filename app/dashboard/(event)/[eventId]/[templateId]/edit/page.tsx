'use client';

import { Template } from '@/core/types';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import DOMPurify from 'dompurify';
import React, { use, useEffect, useState } from 'react';

const EditPage = ({
  params,
}: {
  params: Promise<{ eventId: string; templateId: string }>;
}) => {
  const { eventId, templateId } = use(params);
  const [template, setTemplate] = useState<Template>({} as Template);
  const [loading, setLoading] = useState(true);

  const fetchTemplate = async () => {
    console.log(eventId);
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

  return loading || !template ? (
    <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
      <span className="loader"></span>
    </div>
  ) : (
    <div className="relative w-full h-screen overflow-hidden bg-[#F1F5F9] p-2">
      <div
        className="overflow-y-auto h-full w-full"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(template.htmlContent),
        }}
      ></div>
    </div>
  );
};

export default EditPage;
