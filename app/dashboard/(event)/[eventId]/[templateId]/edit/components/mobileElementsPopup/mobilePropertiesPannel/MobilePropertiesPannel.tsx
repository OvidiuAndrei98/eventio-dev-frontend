import { Drawer, DrawerContent } from '@/components/ui/drawer';
import React from 'react';
import PropertyPanel from '../../propertyPanel/PropertyPanel';
import { TemplateElement } from '@/core/types';

interface MobilePropertiesPannelProps {
  selectedElement: TemplateElement | undefined;
  activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
  handlePropertyChanged: (
    propertyPath: string,
    newValue: unknown,
    propIsResponsive: boolean
  ) => void;
  orientation?: 'bottom' | 'right';
  open?: boolean;
  onClose?: () => void;
}

const MobilePropertiesPannel: React.FC<MobilePropertiesPannelProps> = ({
  selectedElement,
  handlePropertyChanged,
  onClose,
  open,
  orientation = 'bottom',
}) => {
  return selectedElement ? (
    <Drawer open={open} onOpenChange={onClose} direction={orientation}>
      <DrawerContent
        className={
          orientation === 'right'
            ? 'p-[0_16px_16px_16px] h-full w-[400px] overflow-hidden p-0'
            : 'p-[0_16px_16px_16px] h-[60svh] overflow-hidden p-0'
        }
      >
        <div
          className={`h-full overflow-auto scrollbar-thin p-2 flex ${
            orientation === 'right' ? 'flex-col' : 'flex-col'
          }`}
          style={{
            flexDirection: orientation === 'right' ? 'row' : 'column',
          }}
        >
          <div
            className={`flex justify-center items-center mb-2 ${
              orientation === 'right' ? 'flex-col' : 'flex-row'
            }`}
            style={{
              flexDirection: orientation === 'right' ? 'column' : 'row',
            }}
          >
            <div
              className={
                orientation === 'right'
                  ? 'w-1 h-8 rounded bg-gray-300 mr-2'
                  : 'w-8 h-1 rounded bg-gray-300 mb-2 fixed'
              }
            />
          </div>
          <h3 className="py-2 font-semibold text-xl">{selectedElement.name}</h3>
          <div className="w-full">
            <PropertyPanel
              activeBreakpoint="mobile"
              selectedElement={selectedElement}
              handlePropertyChanged={handlePropertyChanged}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  ) : null;
};

export default MobilePropertiesPannel;
