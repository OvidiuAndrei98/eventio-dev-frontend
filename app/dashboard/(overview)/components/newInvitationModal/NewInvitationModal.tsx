'use client';

import './NewInvitationModal.css';
import { Menu, MenuProps, Modal } from 'antd';
import { useEffect, useState } from 'react';
import InvitationCard from '@/components/invitationsModal/components/invitationCard/InvitationCard';
import { defaultTemplates } from '@/lib/templates/templates';
import { Template } from '@/core/types';
import { useRouter } from 'next/navigation';
import { mapTemplateTypeToLabel } from '@/core/utils';

type MenuItem = Required<MenuProps>['items'][number];

const NewInvitationModal = ({
  open,
  onOk,
  onClose,
}: {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [innerWidth, setInnerWidth] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateType, setTemplateType] = useState('wedding');

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

  const items: MenuItem[] = [
    { key: 'wedding', label: 'Nunta' },
    { key: 'bapthism', label: 'Botez' },
    { key: 'anniversary', label: 'Aniversare' },
    { key: 'corporate', label: 'Corporate' },
  ];

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
      title={`Invitații pentru ${mapTemplateTypeToLabel(templateType)}`}
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
          flexDirection: innerWidth < 765 ? 'column' : 'row',
        }}
      >
        <Menu
          defaultSelectedKeys={[templateType]}
          mode={innerWidth < 765 ? 'horizontal' : 'inline'}
          items={items}
          style={{
            maxWidth: innerWidth < 765 ? 'auto' : '200px',
          }}
          onSelect={(e: Parameters<NonNullable<MenuProps['onSelect']>>[0]) => {
            setTemplateType(e.key);
          }}
        />
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

export default NewInvitationModal;
