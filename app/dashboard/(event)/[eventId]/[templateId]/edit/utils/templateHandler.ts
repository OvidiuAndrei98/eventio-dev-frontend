import { Template, TemplateSection, TemplateElement } from '@/core/types';

export const findItemInTemplateById = (
  template: Template | null,
  itemId: string | null
): TemplateElement | undefined => {
  if (!template || !itemId) return undefined;

  // Cauta intai in sectiuni
  const section = template.elements.find((sec) => sec.id === itemId);
  if (section) return section;

  // Daca nu e sectiune, cauta in elementele din toate sectiunile
  for (const sec of template.elements) {
    const element = sec.elements.find((el) => el.id === itemId);
    if (element) return element;
  }

  return undefined; // Nu s-a gasit nici sectiune, nici element cu acel ID
};
