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

export interface UserAuthContext {
  user: User
  userLoading: boolean
  // loginWithGoogle: () => void
  // loginWithEmailAndPassword: (email: string, password: string) => void
  // logout: () => void
  // registerUser: (userData: UserDTO) => void
  // loggingIn: boolean
  // token: string | null
  // setToken: (token: string | null) => void
  // setLoggingIn: (loggingIn: boolean) => void
}
