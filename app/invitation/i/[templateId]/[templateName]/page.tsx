'use client';

import { Template } from '@/core/types';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import WorkInProgressSvg from '@/public/work-in-progress.svg';
import Image from 'next/image';

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
  if (loading || !template) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
        <span className="loader"></span>
      </div>
    );
  }

  if (!template.settings?.eventActive) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full h-screen bg-[#F1F5F9]">
        <Image
          src={WorkInProgressSvg}
          alt="Work in Progress"
          width={300}
          height={300}
        />
        <h1 className="text-gray-600 text-lg">
          Invitatia nu este activa momentan, Mirii inca lucreaza la ea.
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Te rugam sa incerci din nou mai tarziu.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-auto ${
        template.settings?.backgroundColor ?? ''
      } mx-auto`}
    >
      <TemplateRenderer invitationData={template} editMode={false} />
    </div>
  );
};

export default InvitationPage;
