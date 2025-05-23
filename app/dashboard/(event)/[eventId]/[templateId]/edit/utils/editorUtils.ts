import { ElementType } from '@/core/types';
import { ContainerOutlined } from '@ant-design/icons';
import {
  FormInputIcon,
  ImageIcon,
  SectionIcon,
  ShapesIcon,
  TextIcon,
} from 'lucide-react';

// !important -> add here all the elements to be available in the editor for the user to be selected

// Available section in editor
export const availableSectionTypes = [
  {
    type: ElementType.Section,
    name: 'Sectiune',
    icon: SectionIcon,
  },
  {
    type: ElementType.RSVP_SECTION,
    name: 'Sectiune RSVP',
    icon: FormInputIcon,
  },
];

// Available elements in editor
export const availableElementTypes = [
  {
    type: ElementType.Text,
    name: 'Text',
    icon: TextIcon,
    availableFor: [ElementType.Section],
  },
  {
    type: ElementType.Image,
    name: 'Imagine',
    icon: ImageIcon,
    availableFor: [ElementType.Section],
  },
  {
    type: ElementType.RSVP_ELEMENT,
    name: 'RSVP',
    icon: FormInputIcon,
    availableFor: [ElementType.RSVP_SECTION],
  },
  {
    type: ElementType.Blob,
    name: 'Blob',
    icon: ShapesIcon,
    availableFor: [ElementType.Section],
  },
  {
    type: ElementType.Container,
    name: 'Container',
    icon: ContainerOutlined,
    availableFor: [ElementType.Section],
  },
];
