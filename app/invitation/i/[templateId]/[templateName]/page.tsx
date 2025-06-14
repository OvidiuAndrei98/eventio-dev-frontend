'use client';

import { Template } from '@/core/types';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const InvitationPage = () => {
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
      toast.error('A aparut o eroare la incarcarea invitatie');
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
      className={`w-full h-auto ${template.settings.backgroundColor} mx-auto`}
    >
      <TemplateRenderer invitationData={template} editMode={false} />
    </div>
  );
};

export default InvitationPage;
