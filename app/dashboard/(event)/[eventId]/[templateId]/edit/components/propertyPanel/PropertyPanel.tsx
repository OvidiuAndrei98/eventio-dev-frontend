// editor/PropertyPanel.tsx (Exemplu Conceptual)
import React from 'react';
import { EditorWidgetType, TemplateElement } from '@/core/types'; // Importă configurația și tipurile de widget-uri
import NumberEditorWidget from '../editorComponents/NumberEditorWidget';
import { componentsConfig } from '../editComponentConfig';
import InputEditorWidget from '../editorComponents/InputEditorWidget';
import ColorEditorWidget from '../editorComponents/ColorEditorWidget';
import PositionEditorWidget from '../editorComponents/PositionEditorWidget';

export interface PropertyPanelProps {
  selectedElement: TemplateElement;
  activeBreakpoint: string;
  handlePropertyChanged: (propertyPath: string, newValue: any) => void;
}

const PropertyPanel = ({
  selectedElement,
  activeBreakpoint,
  handlePropertyChanged,
}: PropertyPanelProps) => {
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
                onChange={
                  (newValue) => handlePropertyChanged(propertyPath, newValue) // Apelează funcția de schimbare a proprietății
                }
              />
            );
          case EditorWidgetType.TextInput:
            return (
              <InputEditorWidget
                key={propertyPath} // Cheie unică
                config={config}
                value={currentValue as string | undefined | null} // Transmite valoarea curenta (asumeaza tipul corect)
                onChange={
                  (newValue) => handlePropertyChanged(propertyPath, newValue) // Apelează funcția de schimbare a proprietății
                }
              />
            );
          case EditorWidgetType.ColorPicker:
            return (
              <ColorEditorWidget
                key={propertyPath} // Cheie unică
                config={config}
                value={currentValue as string | undefined | null} // Transmite valoarea curenta (asumeaza tipul corect)
                onChange={
                  (newValue) => handlePropertyChanged(propertyPath, newValue) // Apelează funcția de schimbare a proprietății
                }
              />
            );
          case EditorWidgetType.PositionInput:
            return (
              <PositionEditorWidget
                key={propertyPath} // Cheie unică
                config={config}
                value={
                  currentValue as
                    | {
                        top?: number;
                        right?: number;
                        bottom?: number;
                        left?: number;
                      }
                    | undefined
                    | null
                } // Transmite valoarea curenta (asumeaza tipul corect)
                onChange={
                  (newValue) => handlePropertyChanged(propertyPath, newValue) // Apelează funcția de schimbare a proprietății
                }
              />
            );
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
