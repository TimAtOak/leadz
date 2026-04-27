import { apiClient } from './client'
import type { User } from '../types'

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function register(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post('/auth/register', { email, password, name })
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get('/auth/me')
  return data
}
