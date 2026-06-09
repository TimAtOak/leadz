import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCompanyInfo, updateCompanyInfo } from '../api/companyInfo'
import { Layout } from '../components/Layout'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['company-info'], queryFn: getCompanyInfo })

  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState('#6366f1')
  const [textColor, setTextColor] = useState('#374151')
  const [headingColor, setHeadingColor] = useState('#111827')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) {
      setCompanyName(data.companyName ?? '')
      setPhone(data.phone ?? '')
      setEmail(data.email ?? '')
      setAddress(data.address ?? '')
      setPrimaryColor(data.primaryColor ?? '#3b82f6')
      setSecondaryColor(data.secondaryColor ?? '#6366f1')
      setTextColor(data.textColor ?? '#374151')
      setHeadingColor(data.headingColor ?? '#111827')
      setEmailSubject(data.emailSubject ?? '')
      setEmailBody(data.emailBody ?? '')
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: () => updateCompanyInfo({ companyName, phone, email, address, primaryColor, secondaryColor, textColor, headingColor, emailSubject, emailBody }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['company-info'], updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <Layout>
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Unternehmenseinstellungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Wird als Standard in Ihren Seitenblöcken verwendet.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unternehmensname</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} placeholder="Muster GmbH" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+49 30 123456" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="hallo@muster.de" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className={inputClass} placeholder="Musterstraße 1, 10115 Berlin" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pitch-Designfarben</p>
              {([
                { label: 'Primärfarbe', value: primaryColor, onChange: setPrimaryColor, placeholder: '#3b82f6', hint: 'Buttons, CTAs, Akzente' },
                { label: 'Sekundärfarbe', value: secondaryColor, onChange: setSecondaryColor, placeholder: '#6366f1', hint: 'Labels, Divider, Icons' },
                { label: 'Textfarbe', value: textColor, onChange: setTextColor, placeholder: '#374151', hint: 'Fließtext' },
                { label: 'Überschriftenfarbe', value: headingColor, onChange: setHeadingColor, placeholder: '#111827', hint: 'Überschriften' },
              ] as const).map(({ label, value, onChange, placeholder, hint }) => (
                <div key={label} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="h-9 w-12 rounded border border-gray-300 dark:border-gray-700 cursor-pointer p-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300 w-44 flex-shrink-0">{label}</span>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className={`${inputClass} w-28 font-mono`}
                        placeholder={placeholder}
                      />
                      <span className="text-xs text-gray-400 hidden sm:block">{hint}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">E-Mail Vorlage</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                  Platzhalter: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{company_name}}'}</code>{' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{domain}}'}</code>{' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{pitch_url}}'}</code>{' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{contact_name}}'}</code>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Betreff</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className={inputClass}
                  placeholder="Moderne Website für {{company_name}}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nachricht</label>
                <textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  rows={8}
                  className={`${inputClass} resize-y font-mono text-xs`}
                  placeholder={`Hallo {{contact_name}},\n\nwir haben eine individuelle Seite für {{company_name}} erstellt:\n{{pitch_url}}\n\nBei Interesse freuen wir uns auf Ihre Rückmeldung.\n\nBeste Grüsse`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors font-medium"
              >
                {mutation.isPending ? 'Wird gespeichert…' : 'Speichern'}
              </button>
              {saved && <span className="text-sm text-green-600 dark:text-green-400">Gespeichert!</span>}
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
}
