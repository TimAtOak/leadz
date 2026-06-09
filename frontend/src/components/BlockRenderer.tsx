import type { PageBlock, PitchBlockContent } from '../types'

interface Props {
  blocks: PageBlock[]
  primaryColor: string
  secondaryColor: string
  textColor: string
  headingColor: string
}

interface Colors {
  primary: string
  secondary: string
  text: string
  heading: string
}

// ─── Fixed neutral surface styles (layout / bg) ───────────────────────────────

const BASE = {
  page: 'bg-white',
  sectionA: 'bg-white',
  sectionB: 'bg-gray-50',
  card: 'bg-white border border-gray-200',
  nav: 'bg-white border-b border-gray-200',
  footer: 'bg-slate-900',
  avatarBg: 'bg-gray-200',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function btnStyle(c: Colors): React.CSSProperties {
  return { backgroundColor: c.primary, color: '#fff' }
}
function btnInvertStyle(c: Colors): React.CSSProperties {
  return { backgroundColor: '#fff', color: c.primary }
}

// ─── Block components ─────────────────────────────────────────────────────────

function HeaderBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const logoUrl = content.logoUrl as string | undefined
  const navLinks = (content.navLinks as Array<{ label: string; url: string }>) ?? []
  return (
    <header className={`w-full ${BASE.nav}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {logoUrl
          ? <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
          : <div className="w-8 h-8 rounded" style={{ backgroundColor: c.primary }} />
        }
        {navLinks.length > 0 && (
          <nav className="flex gap-6">
            {navLinks.map((l, i) => (
              <a key={i} href={l.url || '#'} className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: c.text }}>{l.label}</a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function HeroBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const imageUrl = content.imageUrl as string | undefined
  return (
    <section
      className={`relative w-full min-h-[480px] flex items-center justify-center text-center ${!imageUrl ? BASE.sectionA : ''}`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {imageUrl && <div className="absolute inset-0 bg-black/55" />}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4" style={{ color: imageUrl ? '#fff' : c.heading }}>
          {(content.heading as string) || 'Welcome'}
        </h1>
        {content.subheading && (
          <p className="text-lg mb-8" style={{ color: imageUrl ? 'rgba(255,255,255,0.8)' : c.text }}>{content.subheading as string}</p>
        )}
        {content.ctaText && (
          <a href={(content.ctaUrl as string) || '#'} className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90" style={btnStyle(c)}>
            {content.ctaText as string}
          </a>
        )}
      </div>
    </section>
  )
}

function ServicesBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const items = (content.items as Array<{ title: string; description: string; icon?: string }>) ?? []
  return (
    <section className={`w-full ${BASE.sectionB} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: c.heading }}>{content.heading as string}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className={`flex flex-col items-start gap-4 p-6 rounded-xl ${BASE.card}`}>
              {item.icon
                ? <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain rounded-lg" />
                : <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.secondary + '22' }}>
                    <svg className="w-6 h-6" style={{ color: c.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
              }
              <div>
                <h3 className="font-semibold mb-1" style={{ color: c.heading }}>{item.title}</h3>
                {item.description && <p className="text-sm leading-relaxed" style={{ color: c.text }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const members = (content.members as Array<{ name: string; role: string; imageUrl?: string; bio?: string }>) ?? []
  return (
    <section className={`w-full ${BASE.sectionA} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: c.heading }}>{content.heading as string}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m, i) => (
            <div key={i} className={`flex flex-col items-center text-center gap-3 p-6 rounded-xl ${BASE.card}`}>
              {m.imageUrl
                ? <img src={m.imageUrl} alt={m.name} className="w-20 h-20 rounded-full object-cover" />
                : <div className={`w-20 h-20 rounded-full flex items-center justify-center ${BASE.avatarBg}`}>
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
              }
              <div>
                <p className="font-semibold" style={{ color: c.heading }}>{m.name}</p>
                {m.role && <p className="text-sm" style={{ color: c.secondary }}>{m.role}</p>}
                {m.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: c.text }}>{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TextBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const align = (content.align as string) === 'left' ? 'text-left' : 'text-center'
  const maxW = (content.align as string) === 'left' ? 'max-w-3xl' : 'max-w-2xl mx-auto'
  return (
    <section className={`w-full ${BASE.sectionB} py-20`}>
      <div className={`${maxW} px-6 mx-auto`}>
        {content.label && (
          <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${align}`} style={{ color: c.secondary }}>
            {content.label as string}
          </p>
        )}
        {content.heading && (
          <h2 className={`text-3xl sm:text-4xl font-bold leading-snug mb-5 ${align}`} style={{ color: c.heading }}>{content.heading as string}</h2>
        )}
        {content.body && (
          <p className={`text-lg leading-relaxed mb-8 ${align}`} style={{ color: c.text }}>{content.body as string}</p>
        )}
        {content.ctaText && (
          <div className={align === 'text-center' ? 'flex justify-center' : ''}>
            <a href={(content.ctaUrl as string) || '#'} className="inline-block px-7 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90" style={btnStyle(c)}>
              {content.ctaText as string}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function SplitBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const imageUrl = content.imageUrl as string | undefined
  const imageLeft = (content.imagePosition as string) !== 'right'
  const imageEl = imageUrl
    ? <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
    : <div className="w-full h-64 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.primary + '22' }}>
        <div className="w-16 h-16 rounded-full opacity-30" style={{ backgroundColor: c.primary }} />
      </div>
  return (
    <section className={`w-full ${BASE.sectionA} py-20`}>
      <div className={`max-w-6xl mx-auto px-6 flex flex-col ${imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
        <div className="flex-1 min-h-64">{imageEl}</div>
        <div className="flex-1">
          {content.label && (
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: c.secondary }}>
              {content.label as string}
            </p>
          )}
          {content.heading && (
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug mb-5" style={{ color: c.heading }}>{content.heading as string}</h2>
          )}
          {content.body && (
            <p className="text-lg leading-relaxed mb-8" style={{ color: c.text }}>{content.body as string}</p>
          )}
          {content.ctaText && (
            <a href={(content.ctaUrl as string) || '#'} className="inline-block px-7 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90" style={btnStyle(c)}>
              {content.ctaText as string}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function FeaturesBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const items = (content.items as Array<{ icon?: string; label: string; description: string }>) ?? []
  const cols = (content.columns as number) === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <section className={`w-full ${BASE.sectionB} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: c.heading }}>{content.heading as string}</h2>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-10`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {item.icon
                  ? <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain rounded-lg" />
                  : <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.secondary + '22' }}>
                      <svg className="w-5 h-5" style={{ color: c.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                }
                <h3 className="text-lg font-bold" style={{ color: c.heading }}>{item.label}</h3>
              </div>
              {item.description && (
                <p className="text-base leading-relaxed" style={{ color: c.text }}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const imageUrl = content.imageUrl as string | undefined
  return (
    <section
      className="relative w-full py-20 text-center"
      style={imageUrl
        ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: c.primary }
      }
    >
      {imageUrl && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-3">{(content.heading as string) || 'Ready to get started?'}</h2>
        {content.subheading && <p className="text-white/80 mb-8">{content.subheading as string}</p>}
        {content.buttonText && (
          <a href={(content.buttonUrl as string) || '#'} className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90" style={btnInvertStyle(c)}>
            {content.buttonText as string}
          </a>
        )}
      </div>
    </section>
  )
}

function FooterBlock({ content, c }: { content: Record<string, unknown>; c: Colors }) {
  const links = (content.links as Array<{ label: string; url: string }>) ?? []
  return (
    <footer className={`w-full ${BASE.footer} py-10`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{(content.copyright as string) || ''}</p>
        {links.length > 0 && (
          <nav className="flex gap-5">
            {links.map((l, i) => (
              <a key={i} href={l.url || '#'} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">{l.label}</a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}

function PitchBlock({ content, c }: { content: PitchBlockContent; c: Colors }) {
  const icon = content.logoUrl ?? content.faviconUrl
  const company = content.companyName ?? content.domain
  const lines = content.body
    ? (content.body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean).length > 1
        ? content.body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
        : content.body.split('\n').map(l => l.trim()).filter(Boolean))
    : []

  return (
    <section className={`w-full ${BASE.sectionA} py-20`}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          {icon
            ? <img src={icon} alt={company} className="w-8 h-8 rounded-lg object-contain" onError={e => { e.currentTarget.style.display = 'none' }} />
            : <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: c.primary }} />
          }
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: c.secondary }}>
            For {company}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold leading-snug mb-8" style={{ color: c.heading }}>
          {content.subject}
        </h2>

        <div className="w-12 h-1 rounded-full mb-10" style={{ backgroundColor: c.primary }} />

        <div className="space-y-5">
          {lines.map((line, i) => (
            <p key={i} className="text-[17px] leading-8" style={{ color: c.text }}>{line}</p>
          ))}
        </div>

        {content.publishedAt && (
          <p className="mt-10 text-xs opacity-50" style={{ color: c.text }}>
            {new Date(content.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </section>
  )
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export function BlockRenderer({ blocks, primaryColor, secondaryColor, textColor, headingColor }: Props) {
  if (!blocks || blocks.length === 0) return null

  const c: Colors = {
    primary: primaryColor,
    secondary: secondaryColor,
    text: textColor,
    heading: headingColor,
  }

  return (
    <div className={`w-full ${BASE.page}`}>
      {blocks.map(block => {
        const content = block.content as Record<string, unknown>
        switch (block.type) {
          case 'pitch':    return <PitchBlock    key={block.id} content={content as unknown as PitchBlockContent} c={c} />
          case 'header':   return <HeaderBlock   key={block.id} content={content} c={c} />
          case 'hero':     return <HeroBlock     key={block.id} content={content} c={c} />
          case 'text':     return <TextBlock     key={block.id} content={content} c={c} />
          case 'split':    return <SplitBlock    key={block.id} content={content} c={c} />
          case 'features': return <FeaturesBlock key={block.id} content={content} c={c} />
          case 'services': return <ServicesBlock key={block.id} content={content} c={c} />
          case 'team':     return <TeamBlock     key={block.id} content={content} c={c} />
          case 'cta':      return <CtaBlock      key={block.id} content={content} c={c} />
          case 'footer':   return <FooterBlock   key={block.id} content={content} c={c} />
          default:         return null
        }
      })}
    </div>
  )
}
