export interface User {
  userId: string;
  email: string;
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

export interface EventLocation {
  locationId: string;
  formatted_address: string;
  name: string;
  location: { lat: string; long: string };
  title?: string;
  locationImage?: {
    url: string;
    name: string;
  };
  locationStartTime?: string;
}

export interface EventQuestions {
  qName: string;
  qAnswers: { value: string }[];
}

export interface EventInstance {
  eventId: string;
  userId: string;
  eventName: string;
  eventType: string;
  eventPlan: EventPlan;
  eventActive: boolean;
  eventTableOrganization: eventTableOrganization;
  templateId: string;
  eventDate: string;
  eventTemplateThumbnailUrl: string;
  eventInvitationLink: string;
  eventLocation: EventLocation;
  eventGuestCount: number;
  adiotionalLocations: EventLocation[];
  eventAditionalQuestions: EventQuestions[];
}

export interface Guest {
  guestId: string;
  submissionId: string;
  name: string;
  dietaryRestrictions: string;
  isAttending: boolean;
  eventId: string;
  tableId: string | null;
  date: number;
  isPrimaryContact: boolean;
  primaryContactPhone?: string;
  totalGuests?: number;
  eventAditionalQuestions?: Record<string, string>[];
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

/**
 * Arguments for the `useDraggable` hook, which provides functionality
 * for making elements draggable.
 */
export interface UseDraggableArguments {
  /**
   * A unique identifier for the draggable element. Can be a string or number.
   */
  id: string | number;

  /**
   * Optional attributes to be applied to the draggable element.
   */
  attributes?: {
    /**
     * The ARIA role of the element, e.g., "button" or "listitem".
     */
    role?: string;

    /**
     * A description of the role for assistive technologies.
     */
    roleDescription?: string;

    /**
     * The tab index of the element, used to control focus order.
     */
    tabIndex?: number;
  };

  /**
   * Optional data associated with the draggable element.
   * This can be any key-value pair.
   */
  data?: Record<string, unknown>;

  /**
   * Whether the draggable functionality is disabled for this element.
   */
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
  PositionInput = 'PositionInput',
  ImageUpload = 'ImageUpload',
  BlobSelector = 'BlobSelector',
  BorderEditor = 'BorderEditor',
  TextAlignment = 'TextAlignment',
  FontWeight = 'FontWeight',
  FontFamily = 'FontFamily',
  StrokeEditor = 'StrokeEditor',
  GifSelector = 'GifSelector',
  ScrollableBackground = 'ScrollableBackground',
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
  responsive: boolean;
  options?: { value: unknown; label: string }[];
  unitOptions?: string[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export interface EditorConfigSet {
  [propertyKey: string]: PropertyEditorConfig;
}

export enum ElementType {
  Text = 'text',
  Image = 'image',
  Section = 'section',
  RSVP_SECTION = 'rsvp-section',
  RSVP_ELEMENT = 'rsvp',
  Blob = 'blob',
  Container = 'container',
  LocationsSection = 'locations-section',
  locationsElement = 'locations',
  GifElement = 'gif',
  Countdown = 'countdown',
}

export type ElementTypeTypes = 'Text' | 'Image' | 'Section';

export interface Template {
  eventId: string;
  templateId: string;
  userId: string;
  name: string;
  type: string;
  eventDate: string;
  description: string;
  thumbnailUrl: string;
  settings: {
    backgroundColor: string;
    eventActive: boolean;
    eventLocation: EventLocation;
    aditionalLocations: EventLocation[];
    eventAditionalQuestions: EventQuestions[];
  };
  elements: TemplateSection[];
}

export interface FlexiblePosition {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  elementAlignment: 'auto' | 'self-start' | 'center' | 'self-end';
}

export interface BaseTemplateElement {
  id: string;
  type: ElementType;
  style: Record<string, unknown>;
  name: string;
  position: FlexiblePosition;
  responsive: ResponsiveOverrides;
  disabled: boolean;
  backgroundImage?: {
    url: string;
    opacity: string;
    name: string;
  };
}

export interface TemplateSection extends BaseTemplateElement {
  elements: TemplateElement[];
  id: string;
  type:
    | ElementType.Section
    | ElementType.RSVP_SECTION
    | ElementType.LocationsSection;
}

export interface ResponsiveProperties {
  position?: FlexiblePosition;
  style?: Record<string, unknown>;
  display?: string;
  borderStyles?: {
    size: string;
    color: string;
    sides: string;
  };
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
  borderStyles: {
    size: string;
    color: string;
    sides: string;
  };
}

export interface RsvpTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.RSVP_ELEMENT;
  title: string;
  buttonStyle: Record<string, unknown>;
}

export interface BlobTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.Blob;
  blobName: string;
}

export interface ContainerTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.Container;
  borderStyles: {
    size: string;
    color: string;
    sides: string;
  };
}

export interface GifTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.GifElement;
  gifUrl: string;
}

export interface CountdownTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.Countdown;
}

export interface LocationsTemplateElement extends BaseTemplateElement {
  id: string;
  type: ElementType.locationsElement;
  borderStyles: {
    size: string;
    color: string;
    sides: string;
  };
  titleStyle: Record<string, unknown>;
  dateStyle: Record<string, unknown>;
  timeStyle: Record<string, unknown>;
  addressStyle: Record<string, unknown>;
  buttonStyle: Record<string, unknown>;
}

export type TemplateElement =
  | BaseTemplateElement
  | TextTemplateElement
  | ImageTemplateElement
  | BlobTemplateElement
  | ContainerTemplateElement
  | LocationsTemplateElement
  | GifTemplateElement
  | RsvpTemplateElement
  | TemplateSection;

export interface PricingTier {
  name: string;
  id: string;
  type: string;
  price: number | string;
  oldPrice?: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  popular?: boolean;
  order: number;
  priceId?: string;
}

export enum EventPlan {
  basic = 'basic',
  premium = 'premium',
  ultimate = 'ultimate',
}

export interface EventStats {
  id: string; // document id (e.g. daily_2024-06-01)
  responses: number;
  confirmations?: number;
  refusals?: number;
  date: string;
}

export interface PlanyviteInvoice {
  id: string;
  customerName: string;
  issueDate: string;
  invoiceLink: string;
  amount: number;
  invoiceNumber: string;
  colected: string;
  cancelled: string;
  storned: string;
}
