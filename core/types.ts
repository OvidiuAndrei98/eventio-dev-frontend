export interface User {
  userId: string
  email: string
  accountStatus: 'basic' | 'premium' | 'ultra'
  photoURL: string | null | undefined
  displayName: string | null | undefined
  name?: string
  surname?: string
}

export interface UserDTO {
  email: string
  password: string
  repeatPassword: string
  name: string
  surname: string
}

export interface EventInstance {
  eventId: string
  userId: string
  eventName: string
  eventType: string
  eventPlan: string
  eventActive: boolean
  eventTableOrganization: eventTableOrganization
}

export interface Guest {
  guestId: string
  guestInfo: {
    email: string
    name: string
  }
  eventId: string
  tableId: string
}

export interface CanvasElement {
  elementId: string
  name: string
  positions: { x: number; y: number }
  type: string
  typeId: string
}

export interface eventTableOrganization {
  elements: CanvasElement[]
}

export interface UseDraggableArguments {
  id: string | number
  attributes?: {
    role?: string
    roleDescription?: string
    tabIndex?: number
  }
  data?: Record<string, any>
  disabled?: boolean
}

export interface UseDroppableArguments {
  id: string | number
  data?: Record<string, unknown>
}

export interface DropdownOption {
  label: string
  value: string
}
