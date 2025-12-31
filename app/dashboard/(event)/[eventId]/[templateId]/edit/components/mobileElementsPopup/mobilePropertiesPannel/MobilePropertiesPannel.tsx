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
            ? 'p-0 h-full w-[400px] overflow-hidden'
            : 'p-0 max-h-[70vh] overflow-hidden bottom-0 fixed rounded-t-[10px] border-t'
        }
        style={{ transform: orientation === 'bottom' ? 'none' : undefined }}
      >
        {orientation === 'bottom' && (
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
        )}

        <div
          className="flex flex-col h-full overflow-hidden"
          style={{
            flexDirection: 'column',
          }}
        >
          <div className="px-4 pt-2 pb-2 border-b bg-white">
            <h3 className="font-semibold text-xl truncate">
              {selectedElement.name}
            </h3>
          </div>

          <div
            className="flex-1 overflow-y-auto px-4 pb-10 scrollbar-thin"
            onFocusCapture={(e) => e.stopPropagation()}
          >
            <div className="w-full pt-2">
              <PropertyPanel
                activeBreakpoint="mobile"
                selectedElement={selectedElement}
                handlePropertyChanged={handlePropertyChanged}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  ) : null;
};

export default MobilePropertiesPannel;
