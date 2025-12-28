'use client';

import { Template } from '@/core/types';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import { Radio, RadioChangeEvent } from 'antd';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './style.css';

const PreviewPage = () => {
  const { templateId } = useParams<{
    templateId: string;
  }>();
  const [template, setTemplate] = useState<Template>({} as Template);
  const [loading, setLoading] = useState(true);
  const [editViewMode, setEditViewMode] = useState<
    'mobile' | 'desktop' | 'tablet'
  >('mobile');

  const fetchTemplate = async () => {
    try {
      const response = await queryTemplateById(templateId);
      console.log('Fetched template:', response);
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

  const onEditViewChange = (e: RadioChangeEvent) => {
    setEditViewMode(e.target.value);
  };

  return loading || !template ? (
    <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
      <span className="loader"></span>
    </div>
  ) : (
    <div>
      <div className="w-full h-[60px] bg-white flex justify-center items-center border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <Radio.Group
          size="middle"
          buttonStyle="solid"
          className="button-group-period-filter"
          value={editViewMode}
          onChange={onEditViewChange}
        >
          <Radio.Button value="mobile">Telefon</Radio.Button>
          <Radio.Button value="tablet">Tableta</Radio.Button>
          <Radio.Button value="desktop">Desktop</Radio.Button>
        </Radio.Group>
      </div>
      <div
        className={`w-full h-[calc(100svh-80px)] overflow-y-[auto] ${template.settings.backgroundColor} w-full mx-auto mt-[60px]`}
      >
        <div
          className={`overflow-y-auto h-full ${
            editViewMode === 'mobile'
              ? 'w-[367px] mx-auto'
              : editViewMode === 'tablet'
              ? 'w-[700px] mx-auto'
              : 'w-full'
          }`}
        >
          <TemplateRenderer
            invitationData={template}
            editMode={false}
            previewMode={true}
          />
          <div className="bg-black h-[80px] text-white p-4 absolute bottom-0 left-0 right-0 flex justify-center items-center z-2">
            Atentie! Aceasta este o previzualizare a invitatiei vizibila doar
            pentru tine.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
