import { useState } from 'react'
import type { PageBlock, BlockType } from '../types'
import { ImageUpload } from './ImageUpload'

interface Props {
  block: PageBlock
  onSave: (content: Record<string, unknown>) => void
  onClose: () => void
  isSaving: boolean
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500'
const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'

function NavLinksEditor({ value, onChange }: { value: Array<{ label: string; url: string }>; onChange: (v: Array<{ label: string; url: string }>) => void }) {
  return (
    <div className="space-y-2">
      {value.map((link, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input type="text" value={link.label} onChange={e => { const n = [...value]; n[i] = { ...n[i], label: e.target.value }; onChange(n) }} placeholder="Label" className={inputClass} />
          <input type="text" value={link.url} onChange={e => { const n = [...value]; n[i] = { ...n[i], url: e.target.value }; onChange(n) }} placeholder="URL" className={inputClass} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0">×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { label: '', url: '' }])} className="text-xs text-brand-600 hover:underline">+ Link hinzufügen</button>
    </div>
  )
}

function ItemsEditor({ value, fields, onChange }: {
  value: Record<string, string>[]
  fields: Array<{ key: string; label: string; multiline?: boolean; image?: boolean; aspectRatio?: 'square' | 'wide' | 'portrait' }>
  onChange: (v: Record<string, string>[]) => void
}) {
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Element {i + 1}</span>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs">Entfernen</button>
          </div>
          {fields.map(f => (
            <div key={f.key}>
              {f.image ? (
                <ImageUpload
                  label={f.label}
                  value={item[f.key] ?? ''}
                  onChange={url => { const n = [...value]; n[i] = { ...n[i], [f.key]: url }; onChange(n) }}
                  aspectRatio={f.aspectRatio ?? 'square'}
                />
              ) : (
                <>
                  <label className={labelClass}>{f.label}</label>
                  {f.multiline
                    ? <textarea value={item[f.key] ?? ''} onChange={e => { const n = [...value]; n[i] = { ...n[i], [f.key]: e.target.value }; onChange(n) }} rows={2} className={inputClass} />
                    : <input type="text" value={item[f.key] ?? ''} onChange={e => { const n = [...value]; n[i] = { ...n[i], [f.key]: e.target.value }; onChange(n) }} className={inputClass} />
                  }
                </>
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, Object.fromEntries(fields.map(f => [f.key, '']))])}
        className="text-xs text-brand-600 hover:underline"
      >
        + Element hinzufügen
      </button>
    </div>
  )
}

function HeaderForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const navLinks = (content.navLinks as Array<{ label: string; url: string }>) ?? []
  return (
    <div className="space-y-4">
      <ImageUpload
        label="Logo"
        value={(content.logoUrl as string) ?? ''}
        onChange={url => onChange({ ...content, logoUrl: url })}
        aspectRatio="wide"
      />
      <div>
        <label className={labelClass}>Navigationslinks</label>
        <NavLinksEditor value={navLinks} onChange={v => onChange({ ...content, navLinks: v })} />
      </div>
    </div>
  )
}

function HeroForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...content, [key]: e.target.value })
  return (
    <div className="space-y-4">
      <ImageUpload
        label="Hintergrundbild"
        value={(content.imageUrl as string) ?? ''}
        onChange={url => onChange({ ...content, imageUrl: url })}
        aspectRatio="wide"
      />
      <div><label className={labelClass}>Überschrift</label><input type="text" value={(content.heading as string) ?? ''} onChange={set('heading')} className={inputClass} /></div>
      <div><label className={labelClass}>Unterüberschrift</label><textarea value={(content.subheading as string) ?? ''} onChange={set('subheading')} rows={2} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächentext</label><input type="text" value={(content.ctaText as string) ?? ''} onChange={set('ctaText')} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächen-URL</label><input type="text" value={(content.ctaUrl as string) ?? ''} onChange={set('ctaUrl')} className={inputClass} /></div>
    </div>
  )
}

function ServicesForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Abschnittsüberschrift</label>
        <input type="text" value={(content.heading as string) ?? ''} onChange={e => onChange({ ...content, heading: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Leistungen</label>
        <ItemsEditor
          value={(content.items as Record<string, string>[]) ?? []}
          fields={[
            { key: 'icon', label: 'Symbol-Bild', image: true, aspectRatio: 'square' },
            { key: 'title', label: 'Titel' },
            { key: 'description', label: 'Beschreibung', multiline: true },
          ]}
          onChange={v => onChange({ ...content, items: v })}
        />
      </div>
    </div>
  )
}

function TeamForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Abschnittsüberschrift</label>
        <input type="text" value={(content.heading as string) ?? ''} onChange={e => onChange({ ...content, heading: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Teammitglieder</label>
        <ItemsEditor
          value={(content.members as Record<string, string>[]) ?? []}
          fields={[
            { key: 'imageUrl', label: 'Foto', image: true, aspectRatio: 'square' },
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Rolle' },
            { key: 'bio', label: 'Biografie', multiline: true },
          ]}
          onChange={v => onChange({ ...content, members: v })}
        />
      </div>
    </div>
  )
}

function TextForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange({ ...content, [key]: e.target.value })
  return (
    <div className="space-y-4">
      <div><label className={labelClass}>Ausrichtung</label>
        <select value={(content.align as string) ?? 'center'} onChange={set('align')} className={inputClass}>
          <option value="center">Zentriert</option>
          <option value="left">Links</option>
        </select>
      </div>
      <div><label className={labelClass}>Etikett (klein, oben)</label><input type="text" value={(content.label as string) ?? ''} onChange={set('label')} className={inputClass} /></div>
      <div><label className={labelClass}>Überschrift</label><input type="text" value={(content.heading as string) ?? ''} onChange={set('heading')} className={inputClass} /></div>
      <div><label className={labelClass}>Fließtext</label><textarea value={(content.body as string) ?? ''} onChange={set('body')} rows={4} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächentext</label><input type="text" value={(content.ctaText as string) ?? ''} onChange={set('ctaText')} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächen-URL</label><input type="text" value={(content.ctaUrl as string) ?? ''} onChange={set('ctaUrl')} className={inputClass} /></div>
    </div>
  )
}

function SplitForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange({ ...content, [key]: e.target.value })
  return (
    <div className="space-y-4">
      <ImageUpload
        label="Bild"
        value={(content.imageUrl as string) ?? ''}
        onChange={url => onChange({ ...content, imageUrl: url })}
        aspectRatio="wide"
      />
      <div><label className={labelClass}>Bildposition</label>
        <select value={(content.imagePosition as string) ?? 'left'} onChange={set('imagePosition')} className={inputClass}>
          <option value="left">Links</option>
          <option value="right">Rechts</option>
        </select>
      </div>
      <div><label className={labelClass}>Etikett (klein)</label><input type="text" value={(content.label as string) ?? ''} onChange={set('label')} className={inputClass} /></div>
      <div><label className={labelClass}>Überschrift</label><input type="text" value={(content.heading as string) ?? ''} onChange={set('heading')} className={inputClass} /></div>
      <div><label className={labelClass}>Fließtext</label><textarea value={(content.body as string) ?? ''} onChange={set('body')} rows={4} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächentext</label><input type="text" value={(content.ctaText as string) ?? ''} onChange={set('ctaText')} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächen-URL</label><input type="text" value={(content.ctaUrl as string) ?? ''} onChange={set('ctaUrl')} className={inputClass} /></div>
    </div>
  )
}

function FeaturesForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Abschnittsüberschrift</label>
        <input type="text" value={(content.heading as string) ?? ''} onChange={e => onChange({ ...content, heading: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Spalten</label>
        <select value={String((content.columns as number) ?? 2)} onChange={e => onChange({ ...content, columns: Number(e.target.value) })} className={inputClass}>
          <option value="2">2 Spalten</option>
          <option value="3">3 Spalten</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Merkmale</label>
        <ItemsEditor
          value={(content.items as Record<string, string>[]) ?? []}
          fields={[
            { key: 'icon', label: 'Symbol-Bild', image: true, aspectRatio: 'square' },
            { key: 'label', label: 'Bezeichnung' },
            { key: 'description', label: 'Beschreibung', multiline: true },
          ]}
          onChange={v => onChange({ ...content, items: v })}
        />
      </div>
    </div>
  )
}

function CtaForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...content, [key]: e.target.value })
  return (
    <div className="space-y-4">
      <ImageUpload
        label="Hintergrundbild"
        value={(content.imageUrl as string) ?? ''}
        onChange={url => onChange({ ...content, imageUrl: url })}
        aspectRatio="wide"
      />
      <div><label className={labelClass}>Überschrift</label><input type="text" value={(content.heading as string) ?? ''} onChange={set('heading')} className={inputClass} /></div>
      <div><label className={labelClass}>Unterüberschrift</label><textarea value={(content.subheading as string) ?? ''} onChange={set('subheading')} rows={2} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächentext</label><input type="text" value={(content.buttonText as string) ?? ''} onChange={set('buttonText')} className={inputClass} /></div>
      <div><label className={labelClass}>Schaltflächen-URL</label><input type="text" value={(content.buttonUrl as string) ?? ''} onChange={set('buttonUrl')} className={inputClass} /></div>
    </div>
  )
}

function FooterForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Urheberrechtstext</label>
        <input type="text" value={(content.copyright as string) ?? ''} onChange={e => onChange({ ...content, copyright: e.target.value })} placeholder="© 2025 Muster GmbH" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Links</label>
        <NavLinksEditor value={(content.links as Array<{ label: string; url: string }>) ?? []} onChange={v => onChange({ ...content, links: v })} />
      </div>
    </div>
  )
}

const BLOCK_NAMES_DE: Partial<Record<BlockType, string>> = {
  header: 'Kopfzeile',
  hero: 'Hero',
  text: 'Text',
  split: 'Bild & Text',
  features: 'Merkmale',
  services: 'Leistungen',
  team: 'Team',
  cta: 'Handlungsaufforderung',
  footer: 'Fußzeile',
}

const FORM_MAP: Record<BlockType, React.ComponentType<{ content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }>> = {
  header: HeaderForm,
  hero: HeroForm,
  text: TextForm,
  split: SplitForm,
  features: FeaturesForm,
  services: ServicesForm,
  team: TeamForm,
  cta: CtaForm,
  footer: FooterForm,
  pitch: () => null,
}

export function BlockEditor({ block, onSave, onClose, isSaving }: Props) {
  const [content, setContent] = useState<Record<string, unknown>>(block.content)
  const Form = FORM_MAP[block.type]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(content)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{BLOCK_NAMES_DE[block.type] ?? block.type}-Block bearbeiten</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Form content={content} onChange={setContent} />
          </div>
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Abbrechen</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors">
              {isSaving ? 'Wird gespeichert…' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
