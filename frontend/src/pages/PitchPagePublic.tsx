import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicPitchPage, trackPitchPageView } from '../api/pitchPages'

export function PitchPagePublic() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-pitch', slug],
    queryFn: () => getPublicPitchPage(slug!),
    enabled: !!slug,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (slug && data) {
      trackPitchPageView(slug).catch(() => {})
    }
  }, [slug, data])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Page not found</h1>
          <p className="text-gray-400">This pitch page doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-6">
            <p className="text-brand-100 text-sm font-medium mb-1">
              A message for {data.companyName ?? data.domain}
            </p>
            <h1 className="text-2xl font-bold text-white leading-snug">{data.subject}</h1>
          </div>
          <div className="px-8 py-8">
            <div className="prose prose-gray max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed">
                {data.body}
              </pre>
            </div>
          </div>
          <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              Sent via{' '}
              <a href="/" className="text-brand-500 hover:underline">
                Leadz
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
