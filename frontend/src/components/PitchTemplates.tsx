import type { PitchBlockContent, DesignTemplate } from '../types'

type Props = { data: PitchBlockContent }

const company = (d: PitchBlockContent) => d.companyName ?? d.domain

const brandIcon = (d: PitchBlockContent) => d.logoUrl ?? d.faviconUrl

function BodyText({ body, className, paraClass }: { body: string; className?: string; paraClass?: string }) {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const normalized = paragraphs.length > 1 ? paragraphs : body.split('\n').map((l) => l.trim()).filter(Boolean)
  return (
    <div className={className}>
      {normalized.map((para, i) => (
        <p key={i} className={paraClass}>{para}</p>
      ))}
    </div>
  )
}

// ─── Modern ──────────────────────────────────────────────────────────────────

function ModernTemplate({ data }: Props) {
  const icon = brandIcon(data)
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <div className="h-px bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

      <nav className="px-8 py-5 flex items-center justify-between border-b border-slate-900">
        <span className="text-slate-500 text-xs tracking-widest uppercase font-medium">Leadz</span>
        <span className="text-slate-600 text-xs">
          {new Date(data.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </nav>

      <div className="px-6 py-20 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-5">
            {icon && (
              <img src={icon} alt={company(data)} className="w-7 h-7 rounded-md object-contain bg-slate-800 p-0.5" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            )}
            <p className="text-cyan-500 text-xs font-semibold tracking-widest uppercase">
              For {company(data)}
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-10">
            {data.subject}
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-cyan-500 to-violet-500 mb-10" />
          <BodyText body={data.body} className="space-y-5" paraClass="text-slate-400 text-[17px] leading-8" />
        </div>
      </div>

      <footer className="mt-auto px-8 py-6 border-t border-slate-900">
        <p className="text-slate-700 text-xs text-center">
          Sent via <a href="/" className="text-slate-500 hover:text-slate-400 transition-colors">Leadz</a>
        </p>
      </footer>
    </div>
  )
}

// ─── Cozy ────────────────────────────────────────────────────────────────────

function CozyTemplate({ data }: Props) {
  const icon = brandIcon(data)
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: '#faf8f4' }}>
      <nav className="px-8 py-5 flex items-center justify-between">
        <span className="text-stone-400 text-sm font-medium tracking-wide">Leadz</span>
        <span className="text-stone-400 text-xs">
          {new Date(data.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </nav>

      <div className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="max-w-xl w-full">
          <div className="flex items-center gap-3 mb-5">
            {icon && (
              <img src={icon} alt={company(data)} className="w-8 h-8 rounded-lg object-contain" style={{ background: '#f0ece6' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
            )}
            <p className="text-amber-700 text-xs font-semibold tracking-widest uppercase">
              A message for {company(data)}
            </p>
          </div>
          <h1 className="text-4xl sm:text-[2.6rem] font-semibold text-stone-900 leading-snug tracking-tight mb-6">
            {data.subject}
          </h1>
          <div className="w-10 h-1 rounded-full bg-amber-400 mb-10" />
          <BodyText body={data.body} className="space-y-5" paraClass="text-stone-600 text-[17px] leading-8" />
        </div>
      </div>

      <footer className="px-8 py-7 border-t border-stone-200 text-center">
        <p className="text-stone-300 text-xs">
          Sent via <a href="/" className="text-stone-400 hover:text-stone-600 transition-colors">Leadz</a>
        </p>
      </footer>
    </div>
  )
}

// ─── Corporate ───────────────────────────────────────────────────────────────

function CorporateTemplate({ data }: Props) {
  const icon = brandIcon(data)
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="border-b border-gray-100 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-gray-900 tracking-tight text-sm">Leadz</span>
          <span className="text-gray-400 text-xs">
            {new Date(data.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </header>

      <div className="bg-slate-900 px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            {icon && (
              <img src={icon} alt={company(data)} className="w-8 h-8 rounded-md object-contain bg-slate-800 p-0.5" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            )}
            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              For {company(data)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-snug max-w-2xl">
            {data.subject}
          </h1>
        </div>
      </div>

      {data.ogImageUrl && (
        <div className="w-full max-h-64 overflow-hidden">
          <img src={data.ogImageUrl} alt={company(data)} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.parentElement!.style.display = 'none' }} />
        </div>
      )}

      <main className="flex-1 px-8 py-14">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-[1fr_2fr] gap-12">
          <aside>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">From</p>
            <p className="text-sm text-gray-600 leading-6">Leadz</p>
            <div className="mt-6 h-px bg-gray-100" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3">For</p>
            <div className="flex items-center gap-2">
              {icon && (
                <img src={icon} alt={company(data)} className="w-5 h-5 rounded object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              )}
              <p className="text-sm text-gray-600 leading-6">{company(data)}</p>
            </div>
          </aside>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Message</p>
            <BodyText body={data.body} className="space-y-5" paraClass="text-gray-700 text-[16px] leading-8" />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-gray-300 text-xs">Powered by Leadz</span>
          <a href="/" className="text-gray-300 hover:text-gray-500 text-xs transition-colors">leadz.io</a>
        </div>
      </footer>
    </div>
  )
}

// ─── Minimal ─────────────────────────────────────────────────────────────────

function MinimalTemplate({ data }: Props) {
  const icon = brandIcon(data)
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <nav className="px-10 py-7">
        <span className="text-gray-200 text-xs tracking-widest uppercase">Leadz</span>
      </nav>

      <main className="flex-1 flex items-start justify-center px-8 py-14">
        <div className="max-w-lg w-full">
          <div className="flex items-center gap-2.5 mb-7">
            {icon && (
              <img src={icon} alt={company(data)} className="w-5 h-5 rounded object-contain opacity-60" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            )}
            <p className="text-gray-300 text-xs tracking-widest uppercase">{company(data)}</p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-gray-900 leading-tight tracking-tight mb-10">
            {data.subject}
          </h1>
          <div className="h-px w-full bg-gray-100 mb-10" />
          <BodyText body={data.body} className="space-y-6" paraClass="text-gray-500 text-[17px] leading-8" />
        </div>
      </main>

      <footer className="px-10 py-8 text-center">
        <p className="text-gray-200 text-xs">
          {new Date(data.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {' · '}
          <a href="/" className="hover:text-gray-400 transition-colors">Leadz</a>
        </p>
      </footer>
    </div>
  )
}

// ─── Router ──────────────────────────────────────────────────────────────────

export function PitchTemplate({ data }: Props) {
  switch (data.designTemplate) {
    case 'colorful':  return <CozyTemplate data={data} />
    case 'corporate': return <CorporateTemplate data={data} />
    case 'minimal':   return <MinimalTemplate data={data} />
    default:          return <ModernTemplate data={data} />
  }
}

export const DESIGN_TEMPLATES: {
  id: DesignTemplate
  name: string
  description: string
  accent: string
}[] = [
  { id: 'modern',    name: 'Modern',      description: 'Dunkel & elegant', accent: 'from-cyan-500 to-violet-500' },
  { id: 'colorful',  name: 'Gemütlich',  description: 'Warm & einladend', accent: 'from-amber-300 to-amber-100' },
  { id: 'corporate', name: 'Korporativ', description: 'Professionell',    accent: 'from-slate-700 to-slate-900' },
  { id: 'minimal',   name: 'Minimal',    description: 'Klar & schlicht',  accent: 'from-gray-100 to-gray-200' },
]
