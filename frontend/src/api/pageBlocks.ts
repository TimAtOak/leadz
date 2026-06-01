import { apiClient } from './client'
import type { PageBlock, BlockType } from '../types'

export async function getBlocks(leadId: number): Promise<PageBlock[]> {
  const { data } = await apiClient.get(`/leads/${leadId}/blocks`)
  return data
}

export async function createBlock(leadId: number, type: BlockType): Promise<PageBlock> {
  const { data } = await apiClient.post(`/leads/${leadId}/blocks`, { type })
  return data
}

export async function updateBlock(leadId: number, blockId: number, content: Record<string, unknown>): Promise<PageBlock> {
  const { data } = await apiClient.put(`/leads/${leadId}/blocks/${blockId}`, { content })
  return data
}

export async function deleteBlock(leadId: number, blockId: number): Promise<void> {
  await apiClient.delete(`/leads/${leadId}/blocks/${blockId}`)
}

export async function reorderBlocks(leadId: number, orderedIds: number[]): Promise<PageBlock[]> {
  const { data } = await apiClient.post(`/leads/${leadId}/blocks/reorder`, orderedIds)
  return data
}
