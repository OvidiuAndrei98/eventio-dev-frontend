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
      {/* <div className="w-full h-[60px] bg-white flex justify-center items-center border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
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
      </div> */}

      <div className={`h-[90%] mx-auto relative`}>
        <TemplateRenderer
          invitationData={selectedTemplate}
          editMode={false}
          previewMode={true}
        />
      </div>
      <div className="z-[9999] bg-black text-white p-4 absolute bottom-5 left-5 flex justify-between items-center rounded-md">
        {innerWidth > 767 && <span>Model selectat: {templateId}</span>}
      </div>
      <div
        className={`z-[9999] flex bg-black justify-between items-center md:items-end md:w-auto md:gap-4 absolute ${
          innerWidth < 767
            ? 'bottom-5 left-1/2 -translate-x-1/2 w-[90%]'
            : 'bottom-5 right-5'
        } p-2 rounded-md`}
      >
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
  );
};

export default InvitationPreviewPage;
