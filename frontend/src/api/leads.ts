import { apiClient } from './client'
import type { Lead, PaginatedResponse } from '../types'

export async function getLeads(page = 1, status?: string): Promise<PaginatedResponse<Lead>> {
  const params: Record<string, string | number> = { page }
  if (status) params.status = status
  const { data } = await apiClient.get('/leads', { params })
  return data
}

export async function getLead(id: number): Promise<Lead> {
  const { data } = await apiClient.get(`/leads/${id}`)
  return data
}

export async function createLead(payload: { url: string; domain: string; title?: string; companyName?: string }): Promise<Lead> {
  const { data } = await apiClient.post('/leads', payload)
  return data
}

export async function updateLead(id: number, payload: Partial<Lead>): Promise<Lead> {
  const { data } = await apiClient.patch(`/leads/${id}`, payload)
  return data
}

export async function deleteLead(id: number): Promise<void> {
  await apiClient.delete(`/leads/${id}`)
}
