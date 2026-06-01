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
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) {
      setCompanyName(data.companyName ?? '')
      setPhone(data.phone ?? '')
      setEmail(data.email ?? '')
      setAddress(data.address ?? '')
      setPrimaryColor(data.primaryColor ?? '#3b82f6')
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: () => updateCompanyInfo({ companyName, phone, email, address, primaryColor }),
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Markenfarbe</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="h-10 w-16 rounded border border-gray-300 dark:border-gray-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className={`${inputClass} w-32 font-mono`}
                  placeholder="#3b82f6"
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
