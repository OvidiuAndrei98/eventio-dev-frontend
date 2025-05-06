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
    <div className="relative w-full h-screen overflow-hidden bg-[#F1F5F9] p-2 grid grid-cols-[1fr_150px] gap-2">
      <div
        className="overflow-y-auto h-full w-full"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(template.htmlContent),
        }}
      ></div>
      <div>
        <h1>Setari element</h1>
        <div className="settings-panel p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Setări</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="elementName"
                className="block text-sm font-medium text-gray-700"
              >
                Nume element
              </label>
              <input
                type="text"
                id="elementName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Introdu numele elementului"
              />
            </div>
            <div>
              <label
                htmlFor="elementColor"
                className="block text-sm font-medium text-gray-700"
              >
                Culoare
              </label>
              <input
                type="color"
                id="elementColor"
                className="mt-1 block w-full h-10 p-0 border-none"
              />
            </div>
            <div>
              <label
                htmlFor="elementSize"
                className="block text-sm font-medium text-gray-700"
              >
                Dimensiune
              </label>
              <input
                type="range"
                id="elementSize"
                min="10"
                max="200"
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
