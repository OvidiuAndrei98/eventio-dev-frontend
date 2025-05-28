import {
  Template,
  TemplateSection,
  TemplateElement,
  ResponsiveProperties,
} from '@/core/types';
import { findInheritedValue, setNestedProperty } from './objectUtils';

// Helper function to find and update an element within a nested template structure immutably.
// Handles updating default properties OR properties within a specific responsive breakpoint.
// Returns the new, updated template object.
// Returns the original template object if the element is not found or update fails.
export const updateElementPropertyInTemplate = (
  template: Template, // State-ul template-ului curent (obiect imutabil)
  elementId: string, // ID-ul elementului de actualizat
  propertyPath: string, // Calea proprietatii la nivel DEFAULT (ex: 'style.fontSize', 'position.x')
  newValue: unknown, // Noua valoare primita din input (poate fi '', null, numar, string)
  propIsResponsive: boolean, // Flag: Aceasta proprietate POATE avea override-uri responsive (din editorConfig)
  breakpoint?: 'desktop' | 'tablet' | 'mobile' // Breakpoint-ul ACTIV in UI (ex: 'mobile', 'tablet', 'desktop')
): Template => {
  const updatedSections = template.elements.map((section) => {
    const elementIndex = section.elements.findIndex(
      (element) => element.id === elementId
    ); // Daca elementul a fost gasit in aceasta sectiune

    if (elementIndex > -1) {
      const originalElement = section.elements[elementIndex]; // Obiectul elementului original
      let updatedElement = originalElement; // Initial, plecam de la obiectul original
      let updateApplied = false; // Flag pentru a sti daca o actualizare a avut loc efectiv // --- Determina daca actualizarea se aplica unui override RESPONSIVE --- // Conditii: avem un breakpoint specificat, nu este 'desktop', SI proprietatea este marcata ca responsive.

      const isResponsiveUpdate =
        breakpoint && breakpoint !== 'desktop' && propIsResponsive;

      // --- Determina daca NOUA VALOARE semnaleaza un RESET (string vid sau null) ---
      const isValueReset =
        newValue === '' || newValue === null || newValue === undefined;

      if (isResponsiveUpdate) {
        // >>> Suntem in modul de actualizare a unui override RESPONSIVE <<<

        // Facem copii imutabile pe calea responsive: element -> responsive -> [breakpoint]
        // Incepem cu obiectul 'responsive' (creeaza {} daca nu exista)
        const updatedResponsive = { ...(originalElement.responsive || {}) }; // Mergem la obiectul breakpoint-ului activ (creeaza {} daca nu exista)
        const updatedBreakpointProps = {
          ...((updatedResponsive[breakpoint] || {}) as ResponsiveProperties), // Asigura-te ca ResponsiveProperties este tipul corect
        }; // Acesta este obiectul unde trebuie setată proprietatea (ex: style, position)

        if (isValueReset) {
          // --- Gasim valoarea mostenita ---
          // Apelam functia helper findInheritedValue pasandu-i elementul original si breakpoint-ul curent.
          // Aceasta va returna valoarea din breakpoint-ul superior cu override sau valoarea default.
          const inheritedValue = findInheritedValue(
            originalElement,
            propertyPath,
            breakpoint
          );

          // --- Setam proprietatea responsiva la valoarea mostenita ---
          // Folosim setNestedProperty pentru a actualiza updatedBreakpointProps cu valoarea mostenita.
          const {
            updatedObject: finalBreakpointProps,
            success: setOverrideSuccess,
          } = setNestedProperty(
            updatedBreakpointProps,
            propertyPath,
            inheritedValue
          ); // <-- Setam la valoarea mostenita

          if (setOverrideSuccess) {
            // Daca setarea a reusit
            // Actualizăm obiectul responsive cu obiectul de breakpoint modificat.
            updatedResponsive[breakpoint] = finalBreakpointProps; // Creează noul obiect element cu obiectul responsive actualizat

            updatedElement = {
              ...originalElement, // Copiaza proprietatile elementului original
              responsive: updatedResponsive, // Foloseste obiectul responsive cu override-ul setat (chiar daca e valoarea mostenita)
            } as TemplateElement; // Casteaza la tipul corect
            updateApplied = true; // Marcam ca o actualizare a avut loc
          } else {
            console.error(
              `updateElementPropertyInTemplate: Failed to set responsive property "${propertyPath}" to inherited value for element "${elementId}" at breakpoint "${breakpoint}". setNestedProperty reported failure.`
            );
            // updatedElement ramane originalElement, updateApplied ramane false.
          }
        } else {
          const {
            updatedObject: finalBreakpointProps,
            success: setOverrideSuccess,
          } = setNestedProperty(updatedBreakpointProps, propertyPath, newValue); // <-- Setam la newValue

          if (setOverrideSuccess) {
            // Daca setarea a reusit
            // Actualizează obiectul responsive cu obiectul de breakpoint modificat
            updatedResponsive[breakpoint] = finalBreakpointProps; // Creează noul obiect element cu obiectul responsive actualizat

            updatedElement = {
              ...originalElement,
              responsive: updatedResponsive,
            } as TemplateElement;
            updateApplied = true; // Marcam ca actualizarea a fost aplicata
          } else {
            console.error(
              `updateElementPropertyInTemplate: Failed to set responsive property "${propertyPath}" to value for element "${elementId}" at breakpoint "${breakpoint}". setNestedProperty reported failure.`
            );
            // updatedElement ramane originalElement, updateApplied ramane false.
          }
        }
      } else {
        const { updatedObject: finalElementProps, success: setDefaultSuccess } =
          setNestedProperty(originalElement, propertyPath, newValue); // setNestedProperty trebuie sa gestioneze imutabilitatea

        if (setDefaultSuccess) {
          updatedElement = finalElementProps as TemplateElement; // Noul obiect element actualizat
          updateApplied = true; // Marcam ca actualizarea a fost aplicata
        } else {
          console.error(
            `updateElementPropertyInTemplate: Failed to set default property "${propertyPath}" for element "${elementId}". setNestedProperty reported failure.`
          );
          // updatedElement ramane originalElement, updateApplied ramane false.
        }
      } // --- Creaza noul array de elemente pentru aceasta sectiune DOAR DACA elementul a fost actualizat/procesat ---

      if (updateApplied) {
        // Creeaza un NOU array de elemente, inlocuind elementul original cu cel actualizat.
        const newSectionElements = [
          ...section.elements.slice(0, elementIndex), // Elementele dinaintea celui actualizat
          updatedElement, // Noul obiect element (cu override sters sau setat, sau default setat)
          ...section.elements.slice(elementIndex + 1), // Elementele de dupa
        ]; // Returneaza un NOU obiect sectiune cu array-ul de elemente modificat.

        return {
          ...section, // Copiaza proprietatile sectiunii originale
          elements: newSectionElements, // Foloseste noul array de elemente
        };
      } else {
        // Daca elementul a fost gasit in sectiune, dar actualizarea nu s-a aplicat, returneaza sectiunea originala.
        console.warn(
          `updateElementPropertyInTemplate: Element "${elementId}" found in section "${section.id}", but property update was not applied.`
        );
        return section;
      }
    } // Daca elementul NU a fost gasit in aceasta sectiune, returneaza sectiunea originala.

    return section;
  }); // End map

  // Dupa map, updatedSections este noul array de sectiuni.
  // Returneaza un NOU obiect template cu array-ul de sectiuni actualizat.
  return {
    ...template, // Copiaza proprietatile template-ului original
    elements: updatedSections, // Utilizeaza noul array de sectiuni
  };
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
  newValue: unknown, // The new value for the property
  isPropResponsive: boolean,
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
      if (breakpoint && breakpoint !== 'desktop' && isPropResponsive) {
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
