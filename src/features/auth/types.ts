export interface RegisterDTO {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}
