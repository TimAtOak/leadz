import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicPitchPage, trackPitchPageView } from '../api/pitchPages'
import { PitchTemplate } from '../components/PitchTemplates'

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

  return <PitchTemplate data={data} />
}
