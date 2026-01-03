import React, { useCallback } from 'react';

import { LayoutDashboard } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ElementType } from '@/core/types';

// Definește structura unui obiect care reprezintă un tip de secțiune disponibil
// Aceasta este structura obiectelor din array-ul 'availableSectionTypes' pasat de părinte
interface AvailableSectionType {
  type: ElementType;
  name: string; // Nume afișat în listă (ex: 'Rich text', 'Image banner')
  icon?: React.ElementType; // Componenta React pentru iconiță (ex: TextIcon, ImageIcon)
}

// Prop-urile pe care componenta AddSectionModal le va primi de la părinte
interface AddSectionModalProps {
  availableSectionTypes: AvailableSectionType[];
  open: boolean;
  onSelectType: (elementType: ElementType, elementName: string) => void;
  onClose?: (state: boolean) => void;
  children?: React.ReactNode;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  availableSectionTypes,
  open,
  onSelectType,
  onClose, // onClose va fi apelat cand se inchide popover-ul (click afara, Escape etc.)
  children, // Elementul care declanseaza popover-ul
}) => {
  // Handler apelat la click pe un tip de secțiune din listă
  const handleTypeSelect = useCallback(
    (type: ElementType, name: string) => {
      onSelectType(type, name); // Apelăm handler-ul primit de la părinte cu tipul selectat
      // Presupunem ca parintele inchide popover-ul cand primeste onSelectType
      // Daca nu, poti adauga onClose() aici
      if (onClose) {
        onClose(false);
      }
    },
    [onSelectType, onClose]
  );

  return (
    <Popover onOpenChange={onClose} open={open}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()} // Prevenim propagarea click-ului pentru a nu închide popover-ul când facem click în interior
        className="w-80 p-0 overflow-hidden rounded-md shadow-lg bg-white ring-0 border-1 border-gray-200 focus-visible:ring-offset-0 focus-visible:ring-0 shadow-[0_3px_10px_rgb(0,0,0,0.2)] pointer-events-auto"
        sideOffset={10}
        align="start"
      >
        <div className="grid gap-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex-grow overflow-y-auto px-2 py-1">
            {availableSectionTypes.length > 0 ? (
              availableSectionTypes.map((item) => (
                <div
                  key={item.type as string}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTypeSelect(item.type, item.name);
                  }} // Prevenim propagarea evenimentului pentru a nu închide popover-ul înainte de a apela handler-ul
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {item.icon ? (
                      React.createElement(item.icon, {
                        size: 18,
                        className: 'text-gray-600',
                      })
                    ) : (
                      <LayoutDashboard size={18} className="text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nicio sectiune gasita.
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddSectionModal;
