'use client';

import './InvitationsModal.css';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import InvitationCard from './components/invitationCard/InvitationCard';
import { defaultTemplates } from '@/lib/templates/templates';
import { Template } from '@/core/types';
import { useRouter } from 'next/navigation';

const InvitationModal = ({
  open,
  templateType,
  onOk,
  onClose,
}: {
  open: boolean;
  templateType: string;
  onOk: () => void;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [innerWidth, setInnerWidth] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);

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

  useEffect(() => {
    const templates = defaultTemplates.filter(
      (template) => template.type === templateType
    );
    setTemplates(templates);
  }, [templateType]);

  const handleTemplateSelect = (templateId: string, type: string) => {
    const selectedTemplate = templates.find(
      (template) => template.templateId === templateId && template.type === type
    );
    if (selectedTemplate) {
      router.push(`/invitations/new/${type}/${templateId}`);
    } else {
      console.error('Template not found');
    }
    onOk();
  };

  return (
    <Modal
      className="invitations-modal"
      title={`Invitații pentru ${templateType}`}
      centered
      open={open}
      onOk={onOk}
      onCancel={onClose}
      maskClosable
      width={{
        xs: '90%',
        sm: '80%',
        md: '80%',
        lg: '80%',
        xl: '80%',
        xxl: '90%',
      }}
      footer={false}
    >
      <div
        className="invitations-modal-content"
        style={{
          display: 'flex',
          flexDirection: innerWidth < 600 ? 'column' : 'row',
        }}
      >
        {templates.length === 0 ? (
          <div className="no-template-message text-center text-xl text-gray-500 w-full h-full flex items-center justify-center">
            Nu sunt disponibile invitatii pentru acest tip de eveniment.
          </div>
        ) : (
          <div className="invitations-container">
            {templates.map((template) => (
              <InvitationCard
                onTemplateSelect={handleTemplateSelect}
                key={template.templateId}
                image={template.thumbnailUrl}
                text={template.name}
                templateId={template.templateId}
                type={template.type}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InvitationModal;
