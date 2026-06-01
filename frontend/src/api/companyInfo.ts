import { apiClient } from './client'
import type { CompanyInfo } from '../types'

export async function getCompanyInfo(): Promise<CompanyInfo> {
  const { data } = await apiClient.get('/company-info')
  return data
}

export async function updateCompanyInfo(payload: Partial<CompanyInfo>): Promise<CompanyInfo> {
  const { data } = await apiClient.put('/company-info', payload)
  return data
}
