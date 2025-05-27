/* eslint-disable */

import { BREAKPOINTS } from '@/lib/templates/constants';

/**
 * Immutably sets a nested property in an object using a dot-notation path.
 * Creates nested objects if they don't exist.
 * Returns a new object with the updated property.
 *
 * @param obj The original object (will not be mutated).
 * @param path The dot-notation path to the property (e.g., 'position.x', 'style.fontSize').
 * @param value The new value to set.
 * @returns An object containing:
 * - updatedObject: The new object with the updated property.
 * - success: Boolean indicating if the path was valid and the property was set.
 */
export const setNestedProperty = (
  obj: any,
  path: string,
  value: any
): { updatedObject: any; success: boolean } => {
  const keys = path.split('.');
  // Creează o copie profundă a obiectului pentru a menține imutabilitatea
  // ATENTIE: JSON.parse(JSON.stringify(obj)) functionează pentru obiecte simple (JSON-serializabile)
  // Daca stilurile sau alte date pot contine functii, Date objects, undefined etc.,
  // vei avea nevoie de o funcție de deep copy mai robustă (ex: din librariile ca lodash/cloneDeep sau o implementare custom)
  const updatedObject = JSON.parse(JSON.stringify(obj));

  let current = updatedObject;
  let pathValid = true;

  // Traversează calea, creând obiecte intermediare dacă nu există
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Verifică dacă nivelul curent este un obiect și nu null/undefined
    if (typeof current !== 'object' || current === null) {
      console.error(
        `setNestedProperty: Path "${path}" is not an object path at key "${key}". Cannot set property.`
      );
      pathValid = false;
      break; // Ieși din buclă dacă calea este invalidă
    }

    // Dacă cheia nu există la nivelul curent, creează un obiect gol
    if (
      !(key in current) ||
      current[key] === null ||
      typeof current[key] !== 'object'
    ) {
      current[key] = {}; // Presupunem că nivelurile intermediare sunt obiecte
    }

    current = current[key];
  }

  // Setează valoarea proprietății finale dacă calea a fost validă
  if (pathValid) {
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;
    return { updatedObject: updatedObject, success: true };
  } else {
    // Dacă calea nu a fost validă, returnează obiectul original și indică eșec
    return { updatedObject: obj, success: false };
  }
};

export const getNestedValue = (obj: any, path: string): any => {
  // Daca obiectul este null/undefined, sau calea este invalida, returneaza undefined
  if (!obj || typeof obj !== 'object' || !path) {
    return undefined;
  }

  const parts = path.split('.'); // Imparte calea in chei (ex: ['style', 'width'])
  let current = obj; // Porneste de la obiectul initial // Parcurge cheile pentru a naviga in structura

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]; // Daca la oricare pas intalnim null, undefined sau ceva ce nu e obiect, // inseamna ca restul caii nu exista. Oprim si returnam undefined.
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined;
    } // Mergem la urmatorul nivel
    current = current[part];
  } // Returneaza valoarea gasita la finalul parcurgerii caii

  return current;
};

export const findInheritedValue = (
  elementData: any, // Obiectul intreg al elementului (care contine style, position, responsive)
  propertyPath: string, // Calea proprietatii default (ex: 'style.fontSize', 'position.x')
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile' // Breakpoint-ul pentru care calculam valoarea mostenita
): any => {
  const breakpoints: ('desktop' | 'tablet' | 'mobile')[] = [
    'desktop',
    'tablet',
    'mobile',
  ];
  const currentBreakpointIndex = breakpoints.indexOf(currentBreakpoint);

  // Parcurgem breakpoint-urile de la cel superior curentului (ex: pentru mobile incepem cu tablet)
  for (let i = currentBreakpointIndex - 1; i >= 0; i--) {
    const parentBreakpoint = breakpoints[i];
    // Cautam valoarea override pentru aceasta proprietate la breakpoint-ul parintelui
    const parentOverrideValue = getNestedValue(
      elementData.responsive?.[parentBreakpoint],
      propertyPath
    );

    // Daca gasim o valoare override la breakpoint-ul parintelui (si nu e undefined/null/NaN), o returnam.
    // Verificarea explicită pentru NaN este importantă pentru numere.
    if (
      parentOverrideValue !== undefined &&
      parentOverrideValue !== null &&
      !(typeof parentOverrideValue === 'number' && isNaN(parentOverrideValue))
    ) {
      console.log(
        `findInheritedValue: Found override at parent breakpoint "${parentBreakpoint}" for path "${propertyPath}". Value:`,
        parentOverrideValue
      );
      return parentOverrideValue;
    }
  }

  // Daca nu gasim override la niciun breakpoint superior, returnam valoarea default.
  // Valoarea default este stocata direct pe obiectul elementului (ex: elementData.style.fontSize).
  const defaultValue = getNestedValue(elementData, propertyPath);
  console.log(
    `findInheritedValue: No override found in parent breakpoints. Returning default value for path "${propertyPath}". Value:`,
    defaultValue
  );

  // Daca valoarea default este undefined/null/NaN, o tratam ca undefined pentru consistenta.
  if (
    defaultValue === undefined ||
    defaultValue === null ||
    (typeof defaultValue === 'number' && isNaN(defaultValue as number))
  ) {
    return undefined;
  }

  return defaultValue; // Returneaza valoarea default (number, string etc.)
};

export const generateInterpolatedCssValue = (
  valueAtStartBp: number,
  valueAtEndBp: number,
  startBpWidth: number,
  endBpWidth: number,
  unit: string = '%'
): string => {
  const valStartWithUnit = `${valueAtStartBp}${unit}`;
  const diffVal = valueAtEndBp - valueAtStartBp;
  const diffBpWidth = endBpWidth - startBpWidth;

  if (diffBpWidth === 0) {
    return valStartWithUnit;
  }
  // Această funcție generează calc() pentru interpolarea liniară
  return `calc(${valStartWithUnit} + (${diffVal}${unit} * ((100vw - ${startBpWidth}px) / ${diffBpWidth})))`;
};

export const generateFluidFontSize = (
  mobilePx: number | undefined,
  tabletPx: number | undefined,
  desktopPx: number | undefined
): string | undefined => {
  // 1. Determină valorile MIN și MAX pentru clamp()
  // Folosim valorile efectiv definite, cu fallback-uri simple:
  // Minima va fi cea mai mică valoare definită sau un fallback sigur (ex: mobile, apoi tablet, apoi desktop)
  const minFontSize = mobilePx ?? tabletPx ?? desktopPx;
  // Maxima va fi cea mai mare valoare definită sau un fallback sigur (ex: desktop, apoi tablet, apoi mobile)
  const maxFontSize = desktopPx ?? tabletPx ?? mobilePx;

  if (minFontSize === undefined || maxFontSize === undefined) {
    // Dacă nu avem măcar o valoare definită pentru min/max, nu putem genera clamp().
    // Returnăm doar o valoare fixă dacă există, altfel undefined.
    return minFontSize ? `${minFontSize}px` : undefined;
  }

  // 2. Calculează "preferred value" (valoarea vw)
  // Vom scala fontul între lățimile breakpoint-urilor de mobile și desktop.
  const viewportMin = BREAKPOINTS.mobile;
  const viewportMax = BREAKPOINTS.desktop; // Sau o lățime maximă specifică (ex: BREAKPOINTS.maxDesktop)

  // Formula pentru a obține o valoare `vw` care interpolează liniar între `minFontSize` și `maxFontSize`
  // pe intervalul de viewport `viewportMin` la `viewportMax`.
  // Aceasta este ecuația unei linii drepte: y = mx + c
  // unde y = font-size, x = 100vw, m = slope, c = intercept
  const slope = (maxFontSize - minFontSize) / (viewportMax - viewportMin);
  const intercept = minFontSize - viewportMin * slope;

  // Prefered value: (slope * 100)vw + intercept px
  // Rotunjim pentru a evita numerele lungi în CSS
  const preferredValue = `${(slope * 100).toFixed(4)}vw + ${intercept.toFixed(
    4
  )}px`;

  // Verificăm dacă rezultatele sunt valide (nu NaN)
  if (isNaN(slope) || isNaN(intercept)) {
    console.warn(
      'Calculul fluid font-size a rezultat în NaN. Verifică valorile breakpoint-urilor sau font-size.'
    );
    return `${minFontSize}px`; // Fallback la valoarea minimă fixă
  }

  // 3. Returnează string-ul CSS clamp()
  return `clamp(${minFontSize}px, ${preferredValue}, ${maxFontSize}px)`;
};
