import { Template, TemplateElement } from '@/core/types';

/**
 * Searches for a template element by its ID within a given template.
 *
 * The function first attempts to find a section (top-level element) with the specified ID.
 * If not found, it searches within the elements of each section for an element with the matching ID.
 *
 * @param template - The template object to search within, or `null` if not available.
 * @param itemId - The ID of the item to search for, or `null` if not specified.
 * @returns The found `TemplateElement` if a matching section or element is found; otherwise, `undefined`.
 */
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
