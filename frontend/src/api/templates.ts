import { apiClient } from './client'
import type { Template } from '../types'

export async function getTemplates(): Promise<Template[]> {
  const { data } = await apiClient.get('/templates')
  return data
}

export async function createTemplate(payload: { name: string; subject: string; body: string }): Promise<Template> {
  const { data } = await apiClient.post('/templates', payload)
  return data
}

export async function updateTemplate(id: number, payload: Partial<Template>): Promise<Template> {
  const { data } = await apiClient.put(`/templates/${id}`, payload)
  return data
}

export async function deleteTemplate(id: number): Promise<void> {
  await apiClient.delete(`/templates/${id}`)
}
