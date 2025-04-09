export interface User {
  userId: string
  email: string
  accountStatus: 'basic' | 'premium' | 'ultra'
  photoURL: string | null | undefined
  displayName: string | null | undefined
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
}
