'use client';

import {
  ElementType,
  Template,
  TemplateElement,
  TemplateSection,
} from '@/core/types';
import TemplateRenderer from '@/lib/templates/templateRenderer/TemplateRenderer';
import { queryTemplateById } from '@/service/templates/queryTemplateById';
import { Button, Radio } from 'antd';
import React, { use, useEffect, useState } from 'react';
import '../styles.css';
import EditorSectionCard from '../../components/editorSectionCard/EditorSectionCard';
import PropertyPanel from './components/propertyPanel/PropertyPanel';

const EditPage = ({
  params,
}: {
  params: Promise<{ eventId: string; templateId: string }>;
}) => {
  const { eventId, templateId } = use(params);
  const [template, setTemplate] = useState<Template>({} as Template);
  const [loading, setLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<
    string | undefined
  >(undefined);
  const [selectedElement, setSelectedElement] = useState<TemplateElement>(
    {} as TemplateElement
  );

  const fetchTemplate = async () => {
    console.log(eventId);
    try {
      const response = await queryTemplateById(templateId);
      setTemplate(response);
      // de schimbat in id-ul section-ului
      setSelectedSectionId(response.elements[0].name);
      setSelectedElement(response.elements[0]);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const updateSelectedElement = (element: TemplateElement) => {
    // Update the selected element in the state
    setSelectedElement(element);
  };

  const updateTemplateSelectedElement = (element: TemplateElement) => {
    updateSelectedElement(element);
    // Update the selected element in the template
    const updatedTemplate = { ...template };
    const elementIndex = updatedTemplate.elements.findIndex(
      (el) => el.name === element.name
    );
    if (elementIndex !== -1) {
      if (element.type === ElementType.Section) {
        updatedTemplate.elements[elementIndex] = element as TemplateSection;
      } else {
      }

      setTemplate(updatedTemplate);
    }
  };

  const handleSectionSelect = (section: TemplateElement) => {
    // When a card reports that it has been selected:
    // Set the selected section ID to the new ID.
    // React will re-render the components, updating the `isSelected` prop for all.
    // The card with ID `sectionId` will receive isSelected={true}.
    // All other cards will receive isSelected={false}.
    // de schimbat in id-ul section-ului
    setSelectedSectionId(section.name);

    // Dacă vrei ca selectarea unui card să deschidă automat doar *acel* card,
    // în timp ce celelalte rămân cum erau sau se închid, logica `isOpen` ar trebui
    // să fie gestionată tot la nivelul părintelui sau să existe un mecanism prin
    // care copilul se închide când `isSelected` devine `false`.
    // Pentru a menține `isOpen` locală și simplu: deschiderea/închiderea se face
    // doar prin click pe săgeată, nu prin selectarea cardului.
  };

  return loading || !template ? (
    <div className="flex items-center justify-center w-full h-screen bg-[#F1F5F9]">
      <span className="loader"></span>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#F1F5F9]">
      <div className="editor-controls flex items-center justify-between w-full p-4  border-dashed border-b-1 border-gray-300 shadow">
        <div></div>
        <div className="flex gap-2">
          <Radio.Group
            size="middle"
            buttonStyle="solid"
            className="button-group-period-filter"
          >
            <Radio.Button value="basic">Desktop</Radio.Button>
            <Radio.Button value="none">Tableta</Radio.Button>
            <Radio.Button value="test">Telefon</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <Button type="primary" size="small" className="p-2">
            Salveaza
          </Button>
        </div>
      </div>
      <div className="relative w-full h-[calc(100dvh-142px)] overflow-hidden bg-[#F1F5F9] p-2 grid grid-cols-[250px_1fr_200px] gap-2">
        <div className="bg-white shadow rounded p-4 flex flex-col gap-1 items-center">
          {template.elements.map((section, index) => (
            <EditorSectionCard
              section={section}
              key={section.id + index}
              onSelect={handleSectionSelect}
              isSelected={section.name === selectedSectionId}
            />
          ))}
        </div>
        <div className="overflow-y-auto h-full w-full">
          <TemplateRenderer
            invitationData={template}
            selectedSectionId={selectedSectionId}
            editMode={true}
            onSelect={handleSectionSelect}
          />
        </div>
        <div>
          <div className="settings-panel p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-4">{selectedSectionId}</h2>
            <PropertyPanel
              activeBreakpoint={'desktop'}
              selectedElement={selectedElement}
            />
          </div>
        </div>
      </div>
      <div className="p-2"></div>
    </div>
  );
};

export default EditPage;
