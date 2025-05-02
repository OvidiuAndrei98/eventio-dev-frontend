'use client';

import { defaultTemplates } from '@/lib/templates/templates';
import { notFound, useRouter } from 'next/navigation';
import React, { use, useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Button } from 'antd';

const InvitationPreviewPage = ({
  params,
}: {
  params: Promise<{ eventType: string; templateId: string }>;
}) => {
  const { eventType, templateId } = use(params);
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

  const selectedTemplate = useMemo(() => {
    return defaultTemplates.find(
      (template) => template.id === templateId && template.type === eventType
    );
  }, [eventType, templateId]);

  if (!selectedTemplate) {
    notFound();
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F1F5F9]">
      <div
        className="overflow-y-auto h-full w-full"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(selectedTemplate.htmlContent),
        }}
      ></div>
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
  );
};

export default InvitationPreviewPage;
