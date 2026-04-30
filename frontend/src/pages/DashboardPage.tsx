import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLeads } from '../api/leads'
import { LeadStatusBadge } from '../components/LeadStatusBadge'
import { Layout } from '../components/Layout'
import type { LeadStatus } from '../types'

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'page_created', label: 'Page Created' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'opened', label: 'Opened' },
  { value: 'responded', label: 'Responded' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

export function DashboardPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, statusFilter],
    queryFn: () => getLeads(page, statusFilter || undefined),
  })

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {data ? `${data.meta.total} total` : ''}
            </p>
          </div>
          <div className="text-sm bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 px-3 py-1.5 rounded-lg">
            Use the Chrome extension to add leads
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
          </div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <p className="text-lg">No leads yet</p>
            <p className="text-sm mt-1">Install the Chrome extension and visit a website to add your first lead.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Domain</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Views</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Added</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.data.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={lead.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-brand-600 dark:text-gray-100 transition-colors"
                      >
                        {lead.domain}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {lead.title ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status as LeadStatus} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {lead.hasPitchPage ? (
                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                          {/* view count shown on detail */}—
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="text-brand-600 hover:underline font-medium"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.meta.pages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              {page} / {data.meta.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.meta.pages, p + 1))}
              disabled={page === data.meta.pages}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
