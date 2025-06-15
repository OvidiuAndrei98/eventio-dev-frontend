'use client';

import { defaultTemplates } from '@/lib/templates/templates';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import './style.css';

const InvitationPreviewPage = () => {
  const { eventType, templateId } = useParams<{
    eventType: string;
    templateId: string;
  }>();
  const [editViewMode, setEditViewMode] = useState<
    'mobile' | 'desktop' | 'tablet'
  >('mobile');
  const [innerWidth, setInnerWidth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window == 'undefined') {
      return;
    }

    // Set initial value of window witth
    setInnerWidth(window.innerWidth);

    const updateWindowWidth = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateWindowWidth);
  }, []);

  const onEditViewChange = (e: RadioChangeEvent) => {
    setEditViewMode(e.target.value);
  };

  const selectedTemplate = useMemo(() => {
    return defaultTemplates.find(
      (template) =>
        template.templateId === templateId && template.type === eventType
    );
  }, [eventType, templateId]);

  if (!selectedTemplate) {
    notFound();
  }

  return (
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
        className={`w-full h-[calc(100svh-80px)] overflow-y-[auto] ${selectedTemplate.settings.backgroundColor} w-full mx-auto mt-[60px]`}
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
            invitationData={selectedTemplate}
            editMode={false}
            activeBreakpointValue={editViewMode}
            previewMode={true}
          />
          <div className="bg-black text-white p-4 absolute bottom-0 left-0 right-0 flex justify-between items-center">
            {innerWidth > 767 && <span>Model selectat: {templateId}</span>}
            <div className="flex justify-between w-full items-center md:items-end md:w-auto md:gap-4">
              <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 flex items-center gap-2 cursor-pointer">
                Alege alt model
              </button>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  router.push(`/invitations/new/${eventType}/${templateId}`);
                }}
              >
                ALEGE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPreviewPage;
