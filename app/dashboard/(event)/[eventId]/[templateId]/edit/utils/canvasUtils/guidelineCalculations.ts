// utilities/guidelineCalculations.ts

import { TemplateElement } from '@/core/types'; // Asigură-te că importul e corect

// Definirea tipurilor pentru linii
export interface Guideline {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number; // Pixeli de la top/left al containerului
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

/**
 * Calculează liniile de aliniere (snapping lines) pentru un element tras.
 * @param draggedRect Rect-ul curent al elementului tras (e.active.rect.current.translated).
 * @param containerRect Rect-ul containerului părinte al drag-ului (canvasElement.getBoundingClientRect()).
 * @param otherElements Elementele din container cu care se poate alinia.
 * @returns Un array de obiecte Guideline.
 */
export const calculateGuidelines = (
  draggedRect: Rect,
  containerRect: DOMRect,
  otherElements: TemplateElement[],
  activeElementId: string // ID-ul elementului tras pentru a-l exclude din 'otherElements'
): Guideline[] => {
  const guidelines: Guideline[] = [];

  // Ajustează coordonatele elementului tras relativ la container
  const draggedLeft = draggedRect.left - containerRect.left;
  const draggedTop = draggedRect.top - containerRect.top;
  const draggedRight = draggedLeft + draggedRect.width;
  const draggedBottom = draggedTop + draggedRect.height;
  const draggedCenterX = draggedLeft + draggedRect.width / 2;
  const draggedCenterY = draggedTop + draggedRect.height / 2;

  // Toleranța pentru aliniere (în pixeli)
  const snapTolerance = 5; // Dacă e la 5px de o margine/centru, se aliniază

  // ----------------------------------------------------
  // Aliniere cu marginile containerului
  // ----------------------------------------------------

  // Orizontal
  if (Math.abs(draggedTop) <= snapTolerance) {
    guidelines.push({ id: 'top-0', type: 'horizontal', position: 0 }); // Aliniere cu top
  }
  if (Math.abs(draggedBottom - containerRect.height) <= snapTolerance) {
    guidelines.push({
      id: 'bottom-0',
      type: 'horizontal',
      position: containerRect.height,
    }); // Aliniere cu bottom
  }
  if (Math.abs(draggedCenterY - containerRect.height / 2) <= snapTolerance) {
    guidelines.push({
      id: 'center-y-0',
      type: 'horizontal',
      position: containerRect.height / 2,
    }); // Aliniere cu centrul Y
  }

  // Vertical
  if (Math.abs(draggedLeft) <= snapTolerance) {
    guidelines.push({ id: 'left-0', type: 'vertical', position: 0 }); // Aliniere cu left
  }
  if (Math.abs(draggedRight - containerRect.width) <= snapTolerance) {
    guidelines.push({
      id: 'right-0',
      type: 'vertical',
      position: containerRect.width,
    }); // Aliniere cu right
  }
  if (Math.abs(draggedCenterX - containerRect.width / 2) <= snapTolerance) {
    guidelines.push({
      id: 'center-x-0',
      type: 'vertical',
      position: containerRect.width / 2,
    }); // Aliniere cu centrul X
  }

  // ----------------------------------------------------
  // Aliniere cu alte elemente din container
  // ----------------------------------------------------

  // Colectează rect-urile celorlalte elemente
  const otherElementsRects = otherElements
    .filter((el) => el.id !== activeElementId) // Exclude elementul tras
    .map((el) => {
      // Aici ai nevoie de Rect-ul fiecărui alt element din DOM
      // Aceasta este partea tricky, pentru că `dnd-kit` nu-ți dă Rect-ul tuturor elementelor.
      // Trebuie să-l preiei din DOM.
      const domElement = document.getElementById(el.id);
      if (domElement) {
        const rect = domElement.getBoundingClientRect();
        return {
          id: el.id,
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          right: rect.right - containerRect.left,
          bottom: rect.bottom - containerRect.top,
          width: rect.width,
          height: rect.height,
          centerX: rect.left - containerRect.left + rect.width / 2,
          centerY: rect.top - containerRect.top + rect.height / 2,
        };
      }
      return null;
    })
    .filter(Boolean) as (Rect & {
    id: string;
    centerX: number;
    centerY: number;
  })[];

  otherElementsRects.forEach((otherRect) => {
    // Aliniere verticală
    if (Math.abs(draggedLeft - otherRect.left) <= snapTolerance) {
      guidelines.push({
        id: `v-left-${otherRect.id}`,
        type: 'vertical',
        position: otherRect.left,
      });
    }
    if (Math.abs(draggedCenterX - otherRect.centerX) <= snapTolerance) {
      guidelines.push({
        id: `v-center-${otherRect.id}`,
        type: 'vertical',
        position: otherRect.centerX,
      });
    }
    if (Math.abs(draggedRight - otherRect.right) <= snapTolerance) {
      guidelines.push({
        id: `v-right-${otherRect.id}`,
        type: 'vertical',
        position: otherRect.right,
      });
    }

    // Aliniere orizontală
    if (Math.abs(draggedTop - otherRect.top) <= snapTolerance) {
      guidelines.push({
        id: `h-top-${otherRect.id}`,
        type: 'horizontal',
        position: otherRect.top,
      });
    }
    if (Math.abs(draggedCenterY - otherRect.centerY) <= snapTolerance) {
      guidelines.push({
        id: `h-center-${otherRect.id}`,
        type: 'horizontal',
        position: otherRect.centerY,
      });
    }
    if (Math.abs(draggedBottom - otherRect.bottom) <= snapTolerance) {
      guidelines.push({
        id: `h-bottom-${otherRect.id}`,
        type: 'horizontal',
        position: otherRect.bottom,
      });
    }
  });

  // Elimină duplicatele (poți avea mai multe linii la aceeași poziție)
  const uniqueGuidelines: Guideline[] = [];
  const positionsSet = new Set<string>(); // "type-position"

  guidelines.forEach((g) => {
    const key = `${g.type}-${g.position.toFixed(0)}`; // Rotunjim pentru a evita problemele de floating point
    if (!positionsSet.has(key)) {
      positionsSet.add(key);
      uniqueGuidelines.push(g);
    }
  });

  return uniqueGuidelines;
};
