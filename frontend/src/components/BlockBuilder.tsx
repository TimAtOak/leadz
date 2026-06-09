import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlocks, createBlock, updateBlock, deleteBlock, reorderBlocks } from '../api/pageBlocks'
import { BlockEditor } from './BlockEditor'
import { BlockRenderer } from './BlockRenderer'
import type { BlockType, PageBlock } from '../types'

const BLOCK_TYPES: BlockType[] = ['header', 'hero', 'text', 'split', 'features', 'services', 'team', 'cta', 'footer']

const BLOCK_LABELS: Record<BlockType, string> = {
  header: 'Kopfzeile',
  hero: 'Hero',
  text: 'Text',
  split: 'Bild & Text',
  features: 'Merkmale',
  services: 'Leistungen',
  team: 'Team',
  cta: 'Handlungsaufforderung',
  footer: 'Fußzeile',
  pitch: 'Pitch',
}

function blockPreview(block: PageBlock): string {
  const c = block.content as Record<string, unknown>
  switch (block.type) {
    case 'pitch': return 'Pitch-Inhalt'
    case 'header': return (c.navLinks as unknown[])?.length ? `${(c.navLinks as unknown[]).length} Navigationslinks` : 'Keine Links'
    case 'hero': return (c.heading as string) || 'Keine Überschrift'
    case 'text': return (c.heading as string) || 'Keine Überschrift'
    case 'split': return (c.heading as string) || 'Keine Überschrift'
    case 'features': return (c.items as unknown[])?.length ? `${(c.items as unknown[]).length} Merkmale` : 'Keine Merkmale'
    case 'services': return (c.heading as string) || 'Keine Überschrift'
    case 'team': return (c.heading as string) || 'Keine Überschrift'
    case 'cta': return (c.heading as string) || 'Keine Überschrift'
    case 'footer': return (c.copyright as string) || 'Kein Copyright'
    default: return ''
  }
}

interface Props {
  leadId: number
  primaryColor: string
  secondaryColor: string
  textColor: string
  headingColor: string
}

export function BlockBuilder({ leadId, primaryColor, secondaryColor, textColor, headingColor }: Props) {
  const queryClient = useQueryClient()
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [drawerWidth, setDrawerWidth] = useState(520)
  const isResizing = useRef(false)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    isResizing.current = true
    resizeStartX.current = e.clientX
    resizeStartWidth.current = drawerWidth
    e.preventDefault()

    const onMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return
      const delta = resizeStartX.current - ev.clientX
      const next = Math.min(Math.max(resizeStartWidth.current + delta, 320), window.innerWidth - 80)
      setDrawerWidth(next)
    }
    const onMouseUp = () => {
      isResizing.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [drawerWidth])

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ['blocks', leadId],
    queryFn: () => getBlocks(leadId),
  })

  const createMutation = useMutation({
    mutationFn: (type: BlockType) => createBlock(leadId, type),
    onSuccess: (newBlock) => {
      queryClient.invalidateQueries({ queryKey: ['blocks', leadId] })
      setShowTypeMenu(false)
      setEditingBlock(newBlock)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ blockId, content }: { blockId: number; content: Record<string, unknown> }) =>
      updateBlock(leadId, blockId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks', leadId] })
      setEditingBlock(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (blockId: number) => deleteBlock(leadId, blockId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks', leadId] }),
  })

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: number[]) => reorderBlocks(leadId, orderedIds),
    onSuccess: (updated) => queryClient.setQueryData(['blocks', leadId], updated),
  })

  function move(index: number, direction: -1 | 1) {
    const newBlocks = [...blocks]
    const target = index + direction
    if (target < 0 || target >= newBlocks.length) return
    ;[newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]]
    reorderMutation.mutate(newBlocks.map(b => b.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Seitenblöcke</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Vorschau
          </button>
          <div className="relative">
          <button
            onClick={() => setShowTypeMenu(v => !v)}
            className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            + Block hinzufügen
          </button>
          {showTypeMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 w-44 py-1">
              {BLOCK_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => createMutation.mutate(type)}
                  disabled={createMutation.isPending}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 capitalize"
                >
                  {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
        </div>
      )}

      {!isLoading && blocks.length === 0 && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <p className="text-sm">Noch keine Blöcke. Fügen Sie einen hinzu, um Ihre Seite aufzubauen.</p>
        </div>
      )}

      {blocks.length > 0 && (
        <div className="space-y-2">
          {blocks.map((block, i) => (
            <div
              key={block.id}
              className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || reorderMutation.isPending}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 leading-none text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === blocks.length - 1 || reorderMutation.isPending}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 leading-none text-xs"
                >
                  ▼
                </button>
              </div>

              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize min-w-[70px] text-center">
                {BLOCK_LABELS[block.type]}
              </span>

              <span className="flex-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                {blockPreview(block)}
              </span>

              {block.type !== 'pitch' && (
                <button
                  onClick={() => setEditingBlock(block)}
                  className="text-sm text-brand-600 hover:underline font-medium"
                >
                  Bearbeiten
                </button>
              )}
              {block.type !== 'pitch' && (
                <button
                  onClick={() => { if (confirm('Diesen Block löschen?')) deleteMutation.mutate(block.id) }}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  Löschen
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          isSaving={updateMutation.isPending}
          onSave={content => updateMutation.mutate({ blockId: editingBlock.id, content })}
          onClose={() => setEditingBlock(null)}
        />
      )}

      {showPreview && (
        <div
          className="fixed top-0 right-0 bottom-0 z-40 flex flex-col bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl"
          style={{ width: drawerWidth, boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}
        >
          {/* Resize handle */}
          <div
            onMouseDown={onResizeStart}
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-brand-400/40 transition-colors z-50"
          />
          {/* Sidebar header */}
          <div className="flex-none flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button
              onClick={() => setShowPreview(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Vorschau schließen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 flex-1 min-w-0 bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">Vorschau</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              {blocks.length} {blocks.length === 1 ? 'Block' : 'Blöcke'}
            </span>
          </div>

          {/* Rendered page */}
          <div className="flex-1 overflow-y-auto">
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                <div className="text-center px-6">
                  <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                  </svg>
                  <p className="text-sm">Noch keine Blöcke vorhanden.</p>
                </div>
              </div>
            ) : (
              <BlockRenderer blocks={blocks} primaryColor={primaryColor} secondaryColor={secondaryColor} textColor={textColor} headingColor={headingColor} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
