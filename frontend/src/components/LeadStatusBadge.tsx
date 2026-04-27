import type { LeadStatus } from '../types'

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  reviewed: { label: 'Reviewed', className: 'bg-gray-100 text-gray-700' },
  page_created: { label: 'Page Created', className: 'bg-purple-100 text-purple-700' },
  contacted: { label: 'Contacted', className: 'bg-yellow-100 text-yellow-700' },
  opened: { label: 'Opened', className: 'bg-orange-100 text-orange-700' },
  responded: { label: 'Responded', className: 'bg-cyan-100 text-cyan-700' },
  won: { label: 'Won', className: 'bg-green-100 text-green-700' },
  lost: { label: 'Lost', className: 'bg-red-100 text-red-700' },
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
