// editor/utils/templateUpdates.ts
import {
  Template,
  TemplateSection,
  TemplateElement,
  ResponsiveOverrides,
  ResponsiveProperties,
} from '@/core/types'; // Asigură-te că importi toate tipurile relevante
import { setNestedProperty } from './objectUtils'; // Vom crea imediat acest helper pentru setarea nested imutabil

// Helper function to find and update an element within a nested template structure immutably.
// Handles updating default properties OR properties within a specific responsive breakpoint.
// Returns the new, updated template object.
// Returns the original template object if the element is not found or update fails.
export const updateElementPropertyInTemplate = (
  template: Template, // The original template object (immutable)
  elementId: string, // The ID of the element to find
  propertyPath: string, // The dot-notation path to the property (ex: 'position.x', 'style.fontSize', 'responsive.mobile.style.color')
  newValue: any, // The new value for the property
  // Optional: The breakpoint name if updating a responsive override
  // If not provided or 'default', updates the default property.
  breakpoint?: string | 'desktop'
): Template => {
  let elementFound = false; // Flag pentru a ști dacă am găsit elementul
  let elementUpdated = false; // Flag pentru a ști dacă actualizarea a avut loc (important pentru imutabilitate)

  // Step 1: Map over the sections to create a new array of sections
  const updatedSections = template.elements.map((section) => {
    // Step 2: Find the index of the element within the current section
    const elementIndex = section.elements.findIndex(
      (element) => element.id === elementId
    );

    // Step 3: If the element is found in THIS section
    if (elementIndex > -1) {
      elementFound = true; // Marcam ca am gasit elementul

      const originalElement = section.elements[elementIndex];
      let updatedElement = originalElement; // Start with original element

      // Step 4: Determine where to update (default or responsive override)
      if (breakpoint && breakpoint !== 'desktop') {
        // >>> UPDATEAZA O PROPRIETATE RESPONSIVE <<<
        // Verifică dacă path-ul începe cu 'responsive' sau este direct o proprietate responsive ('position', 'size', 'style', 'display')
        // De obicei, path-ul va fi 'position.x', 'style.fontSize' etc. Aplicat DUPA navigarea la responsive[breakpoint]

        // Creează o copie a obiectului responsive existent (dacă există)
        const updatedResponsive = { ...(originalElement.responsive || {}) };
        // Creează o copie a obiectului de override pentru breakpoint-ul specific (dacă există)
        const updatedBreakpointProps = {
          ...((updatedResponsive[breakpoint] || {}) as ResponsiveProperties),
        }; // Asigură-te că tipul e corect

        // Setează proprietatea imbricată în obiectul override-ului folosind helper-ul imutabil
        // Ex: setNestedProperty(updatedBreakpointProps, 'style.fontSize', 20)
        const {
          updatedObject: finalBreakpointProps,
          success: setOverrideSuccess,
        } = setNestedProperty(updatedBreakpointProps, propertyPath, newValue);

        if (setOverrideSuccess) {
          // Actualizează obiectul responsive pentru breakpoint-ul respectiv
          updatedResponsive[breakpoint] = finalBreakpointProps;

          // Creează noul obiect element cu noul obiect responsive
          updatedElement = {
            ...originalElement,
            responsive: updatedResponsive,
          } as TemplateElement; // Cast la tipul corect
          elementUpdated = true; // Marcam ca actualizarea a avut loc
        } else {
          console.error(
            `Failed to set responsive property "${propertyPath}" for element "${elementId}" at breakpoint "${breakpoint}".`
          );
        }
      } else {
        // >>> UPDATEAZA O PROPRIETATE DEFAULT <<<
        // Setează proprietatea imbricată direct în obiectul elementului default
        // Ex: setNestedProperty(updatedElement, 'position.x', 10)
        const { updatedObject: finalElementProps, success: setDefaultSuccess } =
          setNestedProperty(originalElement, propertyPath, newValue);

        if (setDefaultSuccess) {
          updatedElement = finalElementProps as TemplateElement; // Cast la tipul corect
          elementUpdated = true; // Marcam ca actualizarea a avut loc
        } else {
          console.error(
            `Failed to set default property "${propertyPath}" for element "${elementId}".`
          );
        }
      }

      // Step 5: Dacă elementul a fost actualizat (suprascris), creează un nou array de elemente pentru această secțiune
      if (elementUpdated) {
        const newSectionElements = [
          ...section.elements.slice(0, elementIndex), // Elementele dinaintea celui actualizat
          updatedElement, // Elementul actualizat
          ...section.elements.slice(elementIndex + 1), // Elementele de după
        ];

        // Step 6: Creează un nou obiect secțiune cu noul array de elemente
        return {
          ...section, // Copiază proprietățile secțiunii originale
          elements: newSectionElements, // Folosește noul array de elemente
        };
      } else {
        // Dacă elementul a fost găsit, dar actualizarea lui a eșuat, returnează secțiunea originală
        console.warn(
          `Element "${elementId}" found in section "${section.id}", but property update failed or was not performed.`
        );
        return section;
      }
    }

    // Step 7: Dacă elementul NU a fost găsit în această secțiune, returnează obiectul secțiunii originale
    return section;
  });

  // Step 8: Creează și returnează un nou obiect template cu noul array de secțiuni
  // Indiferent dacă un element a fost actualizat sau nu, map returnează un array nou.
  // Daca elementUpdated este true, inseamna ca updatedSections contine macar o sectiune noua.
  // Daca elementUpdated este false, updatedSections contine doar referinte la sectiunile originale.
  const finalUpdatedTemplate = {
    ...template, // Copiază proprietățile template-ului original
    elements: updatedSections, // Folosește noul array de secțiuni
  };

  if (!elementFound) {
    console.warn(`Element with ID "${elementId}" not found in the template.`);
    // Poți returna template-ul original sau null, în funcție de cum vrei să gestionezi cazul
    return template; // Returneaza template-ul original daca elementul nu a fost gasit
  }

  // Returneaza template-ul actualizat (o copie noua)
  return finalUpdatedTemplate;
};

/**
 * Helper function to find and update a property on a section within a template structure immutably.
 * Handles updating default properties OR properties within a specific responsive breakpoint.
 * Returns the new, updated template object.
 * Returns the original template object if the section is not found or update fails.
 */
export const updateSectionPropertyInTemplate = (
  template: Template, // The original template object (immutable)
  sectionId: string, // The ID of the section to find
  propertyPath: string, // The dot-notation path to the property (ex: 'name', 'position.x', 'style.backgroundColor', 'display')
  newValue: any, // The new value for the property
  // Optional: The breakpoint name if updating a responsive override
  // If not provided or 'default', updates the default property.
  breakpoint?: string | 'desktop'
): Template => {
  let sectionFound = false; // Flag pentru a ști dacă am găsit secțiunea

  // Step 1: Map over the sections to create a new array of sections
  const updatedSections = template.elements.map((section) => {
    // Step 2: Check if the current section is the target section

    if (section.id === sectionId) {
      sectionFound = true; // Marcam ca am gasit sectiunea

      const originalSection = section; // Obiectul secțiune original (immutable)
      let updatedSection = originalSection; // Pornim cu secțiunea originală

      // Step 3: Determine where to update (default or responsive override)
      if (breakpoint && breakpoint !== 'desktop') {
        // >>> UPDATEAZA O PROPRIETATE RESPONSIVE PE SECTIUNE <<<

        // Creează o copie a obiectului responsive existent (dacă există)
        const updatedResponsive = { ...(originalSection.responsive || {}) };
        // Creează o copie a obiectului de override pentru breakpoint-ul specific (dacă există)
        const updatedBreakpointProps = {
          ...((updatedResponsive[breakpoint] || {}) as ResponsiveProperties),
        }; // Asigură-te că tipul e corect

        // Step 4: Setează proprietatea imbricată în obiectul override-ului folosind helper-ul imutabil
        // path-ul proprietatii (ex: 'position.x', 'style.backgroundColor') este relativ la obiectul override-ului
        const {
          updatedObject: finalBreakpointProps,
          success: setOverrideSuccess,
        } = setNestedProperty(updatedBreakpointProps, propertyPath, newValue);

        if (setOverrideSuccess) {
          // Actualizează obiectul responsive pentru breakpoint-ul respectiv
          updatedResponsive[breakpoint] = finalBreakpointProps;

          // Creează noul obiect secțiune cu noul obiect responsive
          updatedSection = {
            ...originalSection,
            responsive: updatedResponsive,
          } as TemplateSection; // Castează la tipul corect
        } else {
          console.error(
            `Failed to set responsive property "${propertyPath}" for section "${sectionId}" at breakpoint "${breakpoint}".`
          );
          // Dacă actualizarea eșuează, updatedSection rămâne originalSection, deci nu se produce nicio modificare
        }
      } else {
        // >>> UPDATEAZA O PROPRIETATE DEFAULT PE SECTIUNE <<<

        // Step 4: Setează proprietatea imbricată direct în obiectul secțiunii
        // path-ul proprietatii (ex: 'name', 'position.x', 'style.backgroundColor') este relativ la obiectul secțiunii
        const { updatedObject: finalSectionProps, success: setDefaultSuccess } =
          setNestedProperty(originalSection, propertyPath, newValue);

        if (setDefaultSuccess) {
          updatedSection = finalSectionProps as TemplateSection; // Castează la tipul corect
        } else {
          console.error(
            `Failed to set default property "${propertyPath}" for section "${sectionId}".`
          );
          // Dacă actualizarea eșuează, updatedSection rămâne originalSection.
        }
      }

      // Step 5: Returnează obiectul secțiune (fie cel original, fie cel actualizat imutabil)
      return updatedSection;
    }

    // Step 3: Dacă secțiunea NU este secțiunea țintă, returnează obiectul secțiunii originale
    return section;
  });

  // Step 6: Creează și returnează un nou obiect template cu noul array de secțiuni
  // Operația map returnează întotdeauna un array nou.
  // Dacă sectionFound este false, nicio secțiune nu a fost actualizată, iar updatedSections conține referințe la secțiunile originale.
  // Dacă sectionFound este true, updatedSections conține cel puțin un obiect secțiune nou (cel actualizat).
  const finalUpdatedTemplate = {
    ...template, // Copiază proprietățile template-ului original
    elements: updatedSections, // Folosește noul array de secțiuni (chiar dacă nu s-a făcut nicio actualizare, array-ul este nou)
  };

  if (!sectionFound) {
    console.warn(`Section with ID "${sectionId}" not found in the template.`);
    return template; // Returnează template-ul original dacă secțiunea nu a fost găsită
  }

  // Returnează template-ul actualizat (o copie nouă)
  return finalUpdatedTemplate;
};
