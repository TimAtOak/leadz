import { apiClient } from './client'

export async function publishToWordPress(
  leadId: number,
  payload: { anredeHero: string; textHero: string }
): Promise<{ wpPostId: number | null; wpPostUrl: string | null }> {
  const { data } = await apiClient.post(`/leads/${leadId}/publish-wordpress`, payload)
  return data
}
