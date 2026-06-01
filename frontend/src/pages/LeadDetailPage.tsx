import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLead, updateLead, deleteLead } from '../api/leads'
import { getTemplates } from '../api/templates'
import { savePitchPage } from '../api/pitchPages'
import { getCompanyInfo } from '../api/companyInfo'
import { LeadStatusBadge } from '../components/LeadStatusBadge'
import { BlockBuilder } from '../components/BlockBuilder'
import { Layout } from '../components/Layout'
import type { LeadStatus, Template } from '../types'

const LEAD_STATUSES: LeadStatus[] = [
  'new', 'reviewed', 'page_created', 'contacted', 'opened', 'responded', 'won', 'lost',
]

const STATUS_LABELS_DE: Record<LeadStatus, string> = {
  new: 'Neu',
  reviewed: 'Geprüft',
  page_created: 'Seite erstellt',
  contacted: 'Kontaktiert',
  opened: 'Geöffnet',
  responded: 'Geantwortet',
  won: 'Gewonnen',
  lost: 'Verloren',
}

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500'

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const leadId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => getLead(leadId),
  })

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates,
  })

  const { data: companyInfo } = useQuery({
    queryKey: ['company-info'],
    queryFn: getCompanyInfo,
  })

  const [status, setStatus] = useState<LeadStatus>('new')
  const [companyName, setCompanyName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [pitchSubject, setPitchSubject] = useState('')
  const [pitchBody, setPitchBody] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  const [pitchSaved, setPitchSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (lead) {
      setStatus(lead.status)
      setCompanyName(lead.companyName ?? '')
      setContactEmail(lead.contactEmail ?? '')
      setContactPhone(lead.contactPhone ?? '')
      setNotes(lead.notes ?? '')
      if (lead.pitchPage) {
        setPitchSubject(lead.pitchPage.subject)
        setPitchBody(lead.pitchPage.body)
        setSelectedTemplateId(lead.pitchPage.templateId)
      }
    }
  }, [lead])

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateLead>[1]) => updateLead(leadId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lead', leadId] }),
  })

  const pitchMutation = useMutation({
    mutationFn: (payload: { subject: string; body: string; templateId?: number }) =>
      savePitchPage(leadId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setPitchSaved(true)
      setTimeout(() => setPitchSaved(false), 3000)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteLead(leadId),
    onSuccess: () => navigate('/dashboard'),
  })

  const applyTemplate = (template: Template) => {
    setSelectedTemplateId(template.id)
    setPitchSubject(template.subject)
    const domain = lead?.domain ?? ''
    const company = lead?.companyName ?? domain
    const url = lead?.url ?? ''
    setPitchBody(
      template.body
        .replace(/\{\{company_name\}\}/g, company)
        .replace(/\{\{domain\}\}/g, domain)
        .replace(/\{\{url\}\}/g, url)
    )
  }

  const handleSaveLead = () => {
    updateMutation.mutate({ status, companyName, contactEmail, contactPhone, notes })
  }

  const handlePublishPitch = () => {
    pitchMutation.mutate({
      subject: pitchSubject,
      body: pitchBody,
      ...(selectedTemplateId ? { templateId: selectedTemplateId } : {}),
    })
  }

  const shareUrl = lead?.pitchPage
    ? `${window.location.origin}/p/${lead.pitchPage.publicSlug}`
    : null

  const copyShareUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
        </div>
      </Layout>
    )
  }

  if (!lead) {
    return <Layout><p className="text-center py-12 text-gray-500 dark:text-gray-400">Lead nicht gefunden.</p></Layout>
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lead.domain}</h1>
              <LeadStatusBadge status={lead.status} />
            </div>
            <a
              href={lead.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 hover:underline"
            >
              {lead.url}
            </a>
          </div>
          <button
            onClick={() => {
              if (confirm('Diesen Lead löschen?')) deleteMutation.mutate()
            }}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Löschen
          </button>
        </div>

        {lead.websiteScan && (
          <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-5">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Scan-Daten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {lead.websiteScan.title && (
                <div>
                  <span className="text-gray-500 dark:text-gray-500">Titel: </span>
                  <span className="text-gray-800 dark:text-gray-200">{lead.websiteScan.title}</span>
                </div>
              )}
              {lead.websiteScan.metaDescription && (
                <div className="sm:col-span-2">
                  <span className="text-gray-500 dark:text-gray-500">Meta: </span>
                  <span className="text-gray-800 dark:text-gray-200">{lead.websiteScan.metaDescription}</span>
                </div>
              )}
              {lead.websiteScan.h1Texts.length > 0 && (
                <div>
                  <span className="text-gray-500 dark:text-gray-500">H1s: </span>
                  <span className="text-gray-800 dark:text-gray-200">{lead.websiteScan.h1Texts.join(' · ')}</span>
                </div>
              )}
              {lead.websiteScan.detectedEmails.length > 0 && (
                <div>
                  <span className="text-gray-500 dark:text-gray-500">E-Mails: </span>
                  <span className="text-gray-800 dark:text-gray-200">{lead.websiteScan.detectedEmails.join(', ')}</span>
                </div>
              )}
              {lead.websiteScan.detectedPhones.length > 0 && (
                <div>
                  <span className="text-gray-500 dark:text-gray-500">Telefon: </span>
                  <span className="text-gray-800 dark:text-gray-200">{lead.websiteScan.detectedPhones.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-5">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Lead-Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className={inputClass}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS_DE[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Unternehmensname</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kontakt-E-Mail</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputClass}
                placeholder={lead.websiteScan?.detectedEmails[0] ?? ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kontakttelefon</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputClass}
                placeholder={lead.websiteScan?.detectedPhones[0] ?? ''}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notizen</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveLead}
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? 'Wird gespeichert…' : 'Speichern'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-5">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Pitch-Seite</h2>

          {shareUrl && (
            <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-lg px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">Live-Seite</p>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-800 dark:text-green-300 hover:underline truncate block"
                >
                  {shareUrl}
                </a>
              </div>
              <button
                onClick={copyShareUrl}
                className="shrink-0 px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {copied ? 'Kopiert!' : 'Link kopieren'}
              </button>
              <span className="shrink-0 text-xs text-green-600 dark:text-green-400">
                {lead.pitchPage?.viewCount ?? 0} Aufrufe
              </span>
            </div>
          )}

          {templates.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Vorlage verwenden</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      selectedTemplateId === t.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/20 dark:text-brand-400'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Betreff</label>
              <input
                type="text"
                value={pitchSubject}
                onChange={(e) => setPitchSubject(e.target.value)}
                className={inputClass}
                placeholder="Ihr Pitch-Betreff"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Text</label>
              <textarea
                value={pitchBody}
                onChange={(e) => setPitchBody(e.target.value)}
                rows={10}
                className={`${inputClass} resize-y font-mono`}
                placeholder="Schreiben Sie Ihre persönliche Pitch-Nachricht…"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {pitchSaved && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Gespeichert und veröffentlicht!</span>
            )}
            <div className="ml-auto">
              <button
                onClick={handlePublishPitch}
                disabled={pitchMutation.isPending || !pitchSubject || !pitchBody}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {pitchMutation.isPending ? 'Wird veröffentlicht…' : lead.hasPitchPage ? 'Seite aktualisieren' : 'Seite veröffentlichen'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-6">
          <BlockBuilder
            leadId={leadId}
            designTemplate={lead.designTemplate ?? 'modern'}
            primaryColor={companyInfo?.primaryColor ?? '#6366f1'}
          />
        </div>
      </div>
    </Layout>
  )
}
