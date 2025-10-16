import React, { useState, useCallback, useMemo } from 'react';

import { Input } from '@/components/ui/input';

import { Search as SearchIcon, LayoutDashboard } from 'lucide-react';
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
  placeholder: string;
  onSelectType: (elementType: ElementType, elementName: string) => void;
  onClose?: (state: boolean) => void;
  children?: React.ReactNode;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  availableSectionTypes,
  open,
  placeholder,
  onSelectType,
  onClose, // onClose va fi apelat cand se inchide popover-ul (click afara, Escape etc.)
  children, // Elementul care declanseaza popover-ul
}) => {
  // State local pentru textul din bara de căutare
  const [searchTerm, setSearchTerm] = useState('');
  // State local pentru tab-ul activ ('section', 'app', 'all' sau altele)
  // Implicit "all", dar daca exista doar o categorie, putem selecta direct aia.

  // Filtrăm lista de tipuri de secțiuni pe baza textului de căutare și a tab-ului activ
  const filteredTypes = useMemo(() => {
    let filtered = availableSectionTypes;

    // Filtrare după textul de căutare
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearchTerm) || // Caută în nume
          (item.type &&
            (item.type as string).toLowerCase().includes(lowerSearchTerm)) // Caută și în type-ul tehnic (daca exista)
      );
    }

    return filtered;
  }, [availableSectionTypes, searchTerm]);

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
          <div
            className="p-4 border-b border-gray-200 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center mt-2">
              <SearchIcon size={16} className="absolute left-3 text-gray-400" />
              <Input
                type="text"
                placeholder={placeholder}
                className="w-full pl-9 pr-3 py-2 rounded-md text-sm h-7 focus-visible:ring-0 focus:outline-none focus-visible:border-[#cb93d9]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-2 py-1">
            {filteredTypes.length > 0 ? (
              filteredTypes.map((item) => (
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
