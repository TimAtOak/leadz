import type { LeadStatus } from '../types'

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'Neu', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  reviewed: { label: 'Geprüft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  page_created: { label: 'Seite erstellt', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  contacted: { label: 'Kontaktiert', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  opened: { label: 'Geöffnet', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  responded: { label: 'Geantwortet', className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  won: { label: 'Gewonnen', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  lost: { label: 'Verloren', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
