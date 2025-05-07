// editor/PropertyPanel.tsx (Exemplu Conceptual)
import React from 'react';
import { EditorWidgetType, TemplateElement } from '@/core/types'; // Importă configurația și tipurile de widget-uri
import NumberEditorWidget from '../editorComponents/NumberEditorWidget';
import { componentsConfig } from '../editComponentConfig';

// // Presupunem că ai o funcție pentru a actualiza datele invitației în starea editorului
// const updateInvitationData = (
//   sectionId,
//   propertyPath,
//   newValue,
//   breakpoint
// ) => {
//   console.log(
//     `Updating section ${sectionId}, property ${propertyPath} for breakpoint ${breakpoint} to:`,
//     newValue
//   );
//   // Logica reala ar modifica obiectul mare de date al invitatiei
//   // Ex: daca breakpoint e 'desktop': invitation.elements.find(s => s.id === sectionId)[propertyPath] = newValue;
//   // Ex: daca breakpoint e 'mobile': invitation.elements.find(s => s.id === sectionId).responsive['mobile'][propertyPath] = newValue;
// };

export interface PropertyPanelProps {
  selectedElement: TemplateElement; // Datele secțiunii selectate (ex: { id: 'section-header', name: 'header', ... })
  activeBreakpoint: string; // Breakpoint-ul activ (ex: 'desktop', 'tablet', 'mobile')
}

const PropertyPanel = ({
  selectedElement,
  activeBreakpoint,
}: PropertyPanelProps) => {
  // Obține configurația editorului pentru tipul selectat ('section')
  const configSet = componentsConfig[selectedElement.type];

  if (!configSet) {
    return (
      <div>
        Nicio configurare editor găsită pentru tipul {selectedElement.type}.
      </div>
    );
  }

  // Helper pentru a accesa valoarea proprietății din datele elementului/secțiunii selectate
  const getPropertyValue = (data: any, propertyPath: string): any => {
    const keys = propertyPath.split('.');
    let value = data;
    try {
      keys.forEach((key) => {
        // Verificăm dacă proprietatea este un override responsive
        // Aceasta logică trebuie să fie mai sofisticată pentru a aplica cascade
        // dar pentru simplitate, presupunem că editezi fie default, fie un breakpoint specific
        if (
          key === 'responsive' &&
          data.responsive &&
          activeBreakpoint !== 'default'
        ) {
          value = data.responsive[activeBreakpoint];
          // Acum caută restul path-ului (ex: 'position.x') în obiectul override-ului
          const remainingKeys = propertyPath.split('.').slice(1); // Ar trebui să reconstruiești path-ul corect aici
          let overrideValue = data.responsive[activeBreakpoint];
          let foundOverride = true;
          remainingKeys.forEach((rk) => {
            if (overrideValue && overrideValue[rk] !== undefined) {
              overrideValue = overrideValue[rk];
            } else {
              foundOverride = false;
            }
          });
          if (foundOverride) return overrideValue;
          // Daca nu s-a gasit override, continua sa cauti in default (value ramane data originala)
        } else {
          value = value ? value[key] : undefined;
        }
      });
      return value;
    } catch (error) {
      console.error(`Eroare la accesarea proprietatii ${propertyPath}`, error);
      return undefined; // Returneaza undefined daca calea nu e valida
    }
  };

  // Helper pentru a seta valoarea proprietății în datele elementului/secțiunii selectate
  const setPropertyValue = (
    data: any,
    propertyPath: string,
    newValue: any,
    breakpoint: string
  ) => {
    // Aceasta este o implementare SIMPLIFICATA. Logică reală trebuie să modifice starea invitației IMMUTABIL.
    // De asemenea, trebuie să gestioneze crearea obiectelor 'responsive' și 'responsive[breakpoint]' dacă nu există.

    const keys = propertyPath.split('.');
    let target = data;

    // Navighează către obiectul unde trebuie făcută actualizarea (default sau responsive[breakpoint])
    if (breakpoint !== 'desktop') {
      if (!target.responsive) target.responsive = {};
      if (!target.responsive[breakpoint]) target.responsive[breakpoint] = {};
      target = target.responsive[breakpoint]; // Targetul este acum obiectul override-ului
    }

    // Navighează către proprietatea finală (ex: position.x sau style.backgroundColor)
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // Sări peste 'responsive' dacă deja am navigat acolo
      if (key === 'responsive' && breakpoint !== 'desktop') continue;
      if (key === 'style' && !target.style) target.style = {}; // Creeaza obiectul style daca nu exista
      // Creeaza obiectul intermediar daca nu exista
      if (!target[key]) target[key] = {};
      target = target[key];
    }

    // Setează valoarea finală
    const finalKey = keys[keys.length - 1];
    if (finalKey === 'responsive') {
      console.error("Cannot set the 'responsive' object directly.");
      return;
    } // Previne setarea 'responsive' in sine
    target[finalKey] = newValue;

    console.log(
      'Date simulate actualizate:',
      JSON.parse(JSON.stringify(selectedElement))
    ); // Log pentru verificare
    // Aici ai apela functia reala de update a starii globale (ex: updateInvitationData)
  };

  return (
    <div className="overflow-y-auto">
      {/* Randează widget-uri pentru fiecare proprietate din config */}
      {Object.entries(configSet).map(([propertyPath, config]) => {
        // Omitem widget-urile pentru proprietati complexe de top level care nu sunt editabile direct asa (ex: 'elements')
        if (propertyPath === 'elements' || propertyPath === 'responsive')
          return null;

        // Obține valoarea curentă a proprietății
        const currentValue = getPropertyValue(selectedElement, propertyPath); // ATENTIE: getPropertyValue trebuie sa stie sa ia valoarea corecta de la breakpoint-ul activ

        // Decide ce widget să randezi pe baza widgetType din config
        switch (config.widgetType) {
          case EditorWidgetType.NumberInput:
            return (
              <NumberEditorWidget
                key={propertyPath} // Cheie unică
                config={config}
                value={currentValue as number | undefined | null} // Transmite valoarea curenta (asumeaza tipul corect)
                onChange={(newValue) =>
                  setPropertyValue(
                    selectedElement,
                    propertyPath,
                    newValue,
                    activeBreakpoint
                  )
                } // Transmite handler-ul de schimbare
              />
            );
          // Adaugă aici cazuri pentru celelalte tipuri de widget-uri
          // case EditorWidgetType.TextInput: return <TextInputWidget ... />
          // case EditorWidgetType.ColorPicker: return <ColorPickerWidget ... />
          // ... alte widget-uri ...
          default:
            // Afișează un mesaj sau un widget fallback pentru tipurile neimplementate încă
            return (
              <div key={propertyPath}>
                Widget pentru "{config.label}" ({config.widgetType}) nu este
                implementat.
              </div>
            );
        }
      })}
    </div>
  );
};

// Exemplu de utilizare (intr-o pagina sau componenta superioara)
// <PropertyPanel />

export default PropertyPanel;
