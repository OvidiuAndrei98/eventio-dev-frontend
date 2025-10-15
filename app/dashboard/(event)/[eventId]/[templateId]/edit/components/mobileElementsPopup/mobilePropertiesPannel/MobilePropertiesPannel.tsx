import { Drawer, DrawerContent } from '@/components/ui/drawer';
import React from 'react';
import PropertyPanel from '../../propertyPanel/PropertyPanel';
import { TemplateElement } from '@/core/types';

interface MobilePropertiesPannelProps {
  selectedElement: TemplateElement;
  activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
  handlePropertyChanged: (
    propertyPath: string,
    newValue: unknown,
    propIsResponsive: boolean
  ) => void;
  isDragging: boolean;
}

const MobilePropertiesPannel: React.FC<MobilePropertiesPannelProps> = ({
  selectedElement,
  handlePropertyChanged,
  isDragging,
}) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (selectedElement) if (!isDragging) setOpen(true);
  }, [selectedElement]);

  return (
    <Drawer open={open} onOpenChange={() => setOpen(!open)}>
      <DrawerContent className="z-100 p-[0_16px_16px_16px] h-[60svh] overflow-hidden p-0">
        <div className="h-full overflow-auto scrollbar-thin p-2">
          <PropertyPanel
            activeBreakpoint={'mobile'}
            selectedElement={selectedElement}
            handlePropertyChanged={handlePropertyChanged}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePropertiesPannel;
