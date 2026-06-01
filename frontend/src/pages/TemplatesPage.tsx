import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../api/templates'
import { Layout } from '../components/Layout'
import type { Template } from '../types'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500'

function TemplateForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Partial<Template>
  onSave: (data: { name: string; subject: string; body: string }) => void
  onCancel: () => void
  isSaving: boolean
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [body, setBody] = useState(initial?.body ?? '')

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Vorlagenname</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="z.B. Website-Redesign Pitch"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Betreff</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
          placeholder="E-Mail-Betreffzeile"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Text{' '}
          <span className="text-gray-400 dark:text-gray-600 font-normal">
            (use {'{{company_name}}'}, {'{{url}}'}, {'{{domain}}'}, {'{{sender_name}}'})
          </span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className={`${inputClass} resize-y font-mono`}
          placeholder="Hi {{company_name}},&#10;&#10;I noticed your website..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          Abbrechen
        </button>
        <button
          onClick={() => onSave({ name, subject, body })}
          disabled={isSaving || !name || !subject || !body}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isSaving ? 'Wird gespeichert…' : 'Vorlage speichern'}
        </button>
      </div>
    </div>
  )
}

export function TemplatesPage() {
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates,
  })

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setShowCreate(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number; name: string; subject: string; body: string }) =>
      updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  })

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vorlagen</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Neue Vorlage
          </button>
        </div>

        {showCreate && (
          <div className="bg-white rounded-xl border border-brand-200 dark:bg-gray-900 dark:border-brand-800/50 p-5">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Neue Vorlage</h2>
            <TemplateForm
              onSave={(data) => createMutation.mutate(data)}
              onCancel={() => setShowCreate(false)}
              isSaving={createMutation.isPending}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
          </div>
        )}

        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-5">
            {editingId === template.id ? (
              <>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Vorlage bearbeiten</h2>
                <TemplateForm
                  initial={template}
                  onSave={(data) => updateMutation.mutate({ id: template.id, ...data })}
                  onCancel={() => setEditingId(null)}
                  isSaving={updateMutation.isPending}
                />
              </>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
                      {template.isGlobal && (
                        <span className="text-xs bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          Standard
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{template.subject}</p>
                  </div>
                  {!template.isGlobal && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingId(template.id)}
                        className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Diese Vorlage löschen?')) deleteMutation.mutate(template.id)
                        }}
                        className="text-sm text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        Löschen
                      </button>
                    </div>
                  )}
                </div>
                <pre className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap font-sans line-clamp-4 bg-gray-50 dark:bg-gray-800 rounded p-3">
                  {template.body}
                </pre>
              </>
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}
