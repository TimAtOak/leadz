import { apiClient } from './client'
import type { PitchPage, PublicPitchPage } from '../types'

export async function getPitchPage(leadId: number): Promise<PitchPage> {
  const { data } = await apiClient.get(`/leads/${leadId}/pitch-page`)
  return data
}

export async function savePitchPage(
  leadId: number,
  payload: { subject: string; body: string; templateId?: number; designTemplate?: string }
): Promise<PitchPage> {
  const { data } = await apiClient.post(`/leads/${leadId}/pitch-page`, payload)
  return data
}

export async function getPublicPitchPage(slug: string): Promise<PublicPitchPage> {
  const { data } = await apiClient.get(`/public/pitch/${slug}`)
  return data
}

export async function trackPitchPageView(slug: string): Promise<void> {
  await apiClient.post(`/public/pitch/${slug}/view`)
}
