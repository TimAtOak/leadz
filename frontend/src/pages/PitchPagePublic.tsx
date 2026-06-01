import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicPitchPage, trackPitchPageView } from '../api/pitchPages'
import { BlockRenderer } from '../components/BlockRenderer'

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
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Seite nicht gefunden</h1>
          <p className="text-gray-400">Diese Pitch-Seite existiert nicht oder wurde entfernt.</p>
        </div>
      </div>
    )
  }

  return <BlockRenderer blocks={data.blocks} primaryColor={data.primaryColor} designTemplate={data.designTemplate} />
}
