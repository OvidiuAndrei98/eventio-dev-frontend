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
  open?: boolean;
  onClose?: () => void;
}

const MobilePropertiesPannel: React.FC<MobilePropertiesPannelProps> = ({
  selectedElement,
  handlePropertyChanged,
  onClose,
  open,
}) => {
  return selectedElement ? (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className=" p-[0_16px_16px_16px] h-[60svh] overflow-hidden p-0">
        <div className="h-full overflow-auto scrollbar-thin p-2">
          <PropertyPanel
            activeBreakpoint="mobile"
            selectedElement={selectedElement}
            handlePropertyChanged={handlePropertyChanged}
          />
        </div>
      </DrawerContent>
    </Drawer>
  ) : null;
};

export default MobilePropertiesPannel;
