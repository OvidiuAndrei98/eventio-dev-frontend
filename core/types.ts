export interface User {
  userId: string;
  email: string;
  accountStatus: 'basic' | 'premium' | 'ultra';
  photoURL: string | null | undefined;
  displayName: string | null | undefined;
  name?: string;
  surname?: string;
}

export interface UserDTO {
  email: string;
  password: string;
  repeatPassword: string;
  name: string;
  surname: string;
}

export interface EventInstance {
  eventId: string;
  userId: string;
  eventName: string;
  eventType: string;
  eventPlan: string;
  eventActive: boolean;
  eventTableOrganization: eventTableOrganization;
  templateId: string;
  eventDate: string;
  eventTemplateThumbnailUrl: string;
}

export interface Guest {
  guestId: string;
  guestInfo: {
    email: string;
    name: string;
  };
  eventId: string;
  tableId: string;
}

export interface CanvasElement {
  elementId: string;
  name: string;
  positions: { x: number; y: number };
  type: string;
  typeId: string;
}

export interface eventTableOrganization {
  elements: CanvasElement[];
}

export interface UseDraggableArguments {
  id: string | number;
  attributes?: {
    role?: string;
    roleDescription?: string;
    tabIndex?: number;
  };
  data?: Record<string, unknown>;
  disabled?: boolean;
}

export interface UseDroppableArguments {
  id: string | number;
  data?: Record<string, unknown>;
}

export interface DropdownOption {
  label: string;
  value: string;
}

// Define the types of UI widgets that the editor will use
export enum EditorWidgetType {
  TextInput = 'TextInput',
  NumberInput = 'NumberInput',
  UnitInput = 'UnitInput',
  ColorPicker = 'ColorPicker',
  Dropdown = 'Dropdown',
  Checkbox = 'Checkbox',
  Slider = 'Slider',
  TextArea = 'TextArea',
}

export enum PropertyDataType {
  String = 'string',
  Number = 'number',
  Color = 'color',
  Unit = 'unit',
  Enum = 'enum',
  Boolean = 'boolean',
  Object = 'object',
}

export interface PropertyEditorConfig {
  label: string;
  dataType: PropertyDataType;
  widgetType: EditorWidgetType;
  options?: { value: any; label: string }[];
  unitOptions?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface EditorConfigSet {
  [propertyKey: string]: PropertyEditorConfig;
}

export enum ElementType {
  Text = 'text',
  Image = 'image',
  Section = 'section',
}

export interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  thumbnailUrl: string;
  settings: {
    backgroundColor: string;
  };
  elements: TemplateSection[];
}

export interface BaseTemplateElement {
  id: string;
  type: ElementType;
  style: Record<string, unknown>;
  name: string;
  position: { x: number | 'auto'; y: number | 'auto' };
  responsive: ResponsiveOverrides;
}

export interface TemplateSection extends BaseTemplateElement {
  elements: TemplateElement[];
  id: string;
  type: ElementType.Section;
}

export interface ResponsiveProperties {
  position?: { x: number; y: number };
  style?: Record<string, unknown>;
  display?: string;
}

export interface ResponsiveOverrides {
  [mediaQuery: string]: ResponsiveProperties;
}

export interface TextTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.Text;
  content: string;
}
export interface ImageTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.Image;
  url: string;
}

export type TemplateElement =
  | BaseTemplateElement
  | TextTemplateElement
  | ImageTemplateElement
  | TemplateSection;
