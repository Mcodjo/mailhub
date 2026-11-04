import { api, setToken } from './client'
import type { User } from '../types'

interface AuthResponse { user: User; token: string }

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password })
  setToken(res.token)
  return res
}

export async function register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', { name, email, password, password_confirmation })
  setToken(res.token)
  return res
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function me(): Promise<User> {
  return api.get<User>('/auth/me')
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return api.post('/auth/forgot-password', { email })
}

export async function resetPassword(token: string, email: string, password: string, password_confirmation: string): Promise<{ message: string; token: string }> {
  const res = await api.post<{ message: string; token: string }>('/auth/reset-password', { token, email, password, password_confirmation })
  setToken(res.token)
  return res
}

export function googleAuthUrl(): string {
  return '/api/auth/google'
}
