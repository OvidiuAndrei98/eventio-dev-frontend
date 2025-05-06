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

export enum ElementType {
  Text = 'text',
  Image = 'image',
  Container = 'container',
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

export interface TemplateSection {
  id: string;
  elements: TemplateElement[];
  style: Record<string, unknown>;
  position: 'relative';
}

export interface BaseTemplateElement {
  id: string;
  type: ElementType;
  style: Record<string, unknown>;
  position: { x: number; y: number };
  size?: { width: number; height: number };
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
  | ImageTemplateElement;
