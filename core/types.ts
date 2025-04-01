export interface User {
  userId: string
  email: string
  name: string
  surname: string
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
