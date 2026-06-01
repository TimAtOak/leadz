import type { PageBlock, PitchBlockContent, DesignTemplate } from '../types'

interface Props {
  blocks: PageBlock[]
  primaryColor: string
  designTemplate: DesignTemplate
}

// ─── Theme definitions ────────────────────────────────────────────────────────

interface Theme {
  page: string
  sectionA: string        // primary section bg
  sectionB: string        // alternating section bg
  heading: string
  subheading: string
  body: string
  label: string           // small label / eyebrow text (uses primaryColor override for corp/minimal)
  card: string
  cardBorder: string
  nav: string
  navBorder: string
  footer: string
  footerText: string
  linkText: string
  divider: string
  avatarBg: string
  iconBg: string          // service icon bg (uses primaryColor for corp/minimal)
  useAccentColor: boolean // if true, use primaryColor for labels/accents; else theme has own accent
}

const THEMES: Record<DesignTemplate, Theme> = {
  modern: {
    page: 'bg-slate-950',
    sectionA: 'bg-slate-950',
    sectionB: 'bg-slate-900',
    heading: 'text-white',
    subheading: 'text-slate-300',
    body: 'text-slate-400',
    label: 'text-cyan-500',
    card: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    nav: 'bg-slate-950',
    navBorder: 'border-slate-800',
    footer: 'bg-slate-900',
    footerText: 'text-slate-500',
    linkText: 'text-slate-400 hover:text-slate-200',
    divider: 'bg-gradient-to-r from-cyan-500 to-violet-500',
    avatarBg: 'bg-slate-700',
    iconBg: 'bg-slate-700',
    useAccentColor: false,
  },
  colorful: {
    page: 'bg-[#faf8f4]',
    sectionA: 'bg-[#faf8f4]',
    sectionB: 'bg-white',
    heading: 'text-stone-900',
    subheading: 'text-stone-700',
    body: 'text-stone-600',
    label: 'text-amber-700',
    card: 'bg-white',
    cardBorder: 'border-stone-200',
    nav: 'bg-white',
    navBorder: 'border-stone-100',
    footer: 'bg-stone-800',
    footerText: 'text-stone-400',
    linkText: 'text-stone-400 hover:text-stone-200',
    divider: 'bg-amber-400',
    avatarBg: 'bg-stone-200',
    iconBg: 'bg-amber-100',
    useAccentColor: false,
  },
  corporate: {
    page: 'bg-white',
    sectionA: 'bg-white',
    sectionB: 'bg-gray-50',
    heading: 'text-gray-900',
    subheading: 'text-gray-700',
    body: 'text-gray-600',
    label: 'text-gray-500',
    card: 'bg-white',
    cardBorder: 'border-gray-200',
    nav: 'bg-white',
    navBorder: 'border-gray-200',
    footer: 'bg-slate-900',
    footerText: 'text-slate-400',
    linkText: 'text-slate-400 hover:text-slate-200',
    divider: 'bg-gray-300',
    avatarBg: 'bg-gray-100',
    iconBg: 'bg-gray-100',
    useAccentColor: true,
  },
  minimal: {
    page: 'bg-white',
    sectionA: 'bg-white',
    sectionB: 'bg-white',
    heading: 'text-gray-900',
    subheading: 'text-gray-500',
    body: 'text-gray-500',
    label: 'text-gray-400',
    card: 'bg-gray-50',
    cardBorder: 'border-transparent',
    nav: 'bg-white',
    navBorder: 'border-gray-100',
    footer: 'bg-gray-900',
    footerText: 'text-gray-500',
    linkText: 'text-gray-500 hover:text-gray-300',
    divider: 'bg-gray-200',
    avatarBg: 'bg-gray-200',
    iconBg: 'bg-gray-100',
    useAccentColor: true,
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function accentStyle(t: Theme, primary: string) {
  return t.useAccentColor ? { color: primary } : {}
}
function accentBgStyle(t: Theme, primary: string) {
  return t.useAccentColor ? { backgroundColor: primary } : {}
}
function btnStyle(primary: string) {
  return { backgroundColor: primary } as React.CSSProperties
}
function btnInvertStyle(primary: string) {
  return { backgroundColor: '#fff', color: primary } as React.CSSProperties
}

// ─── Block components ─────────────────────────────────────────────────────────

function HeaderBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const logoUrl = content.logoUrl as string | undefined
  const navLinks = (content.navLinks as Array<{ label: string; url: string }>) ?? []
  return (
    <header className={`w-full ${t.nav} border-b ${t.navBorder}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {logoUrl
          ? <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
          : <div className="w-8 h-8 rounded" style={accentBgStyle(t, primary)} />
        }
        {navLinks.length > 0 && (
          <nav className="flex gap-6">
            {navLinks.map((l, i) => (
              <a key={i} href={l.url || '#'} className={`text-sm font-medium transition-colors ${t.body}`}>{l.label}</a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function HeroBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const imageUrl = content.imageUrl as string | undefined
  return (
    <section
      className={`relative w-full min-h-[480px] flex items-center justify-center text-center ${!imageUrl ? t.sectionA : ''}`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {imageUrl && <div className="absolute inset-0 bg-black/55" />}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <h1 className={`text-4xl sm:text-5xl font-bold leading-tight mb-4 ${imageUrl ? 'text-white' : t.heading}`}>
          {(content.heading as string) || 'Welcome'}
        </h1>
        {content.subheading && (
          <p className={`text-lg mb-8 ${imageUrl ? 'text-white/80' : t.subheading}`}>{content.subheading as string}</p>
        )}
        {content.ctaText && (
          <a href={(content.ctaUrl as string) || '#'} className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90" style={btnStyle(primary)}>
            {content.ctaText as string}
          </a>
        )}
      </div>
    </section>
  )
}

function ServicesBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const items = (content.items as Array<{ title: string; description: string; icon?: string }>) ?? []
  return (
    <section className={`w-full ${t.sectionB} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className={`text-3xl font-bold text-center mb-12 ${t.heading}`}>{content.heading as string}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className={`flex flex-col items-start gap-4 p-6 rounded-xl border ${t.card} ${t.cardBorder}`}>
              {item.icon
                ? <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain rounded-lg" />
                : <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${t.useAccentColor ? '' : t.iconBg}`} style={t.useAccentColor ? accentBgStyle(t, primary) : {}}>
                    <svg className={`w-6 h-6 ${t.useAccentColor ? 'text-white' : t.label}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
              }
              <div>
                <h3 className={`font-semibold mb-1 ${t.heading}`}>{item.title}</h3>
                {item.description && <p className={`text-sm leading-relaxed ${t.body}`}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamBlock({ content, t }: { content: Record<string, unknown>; t: Theme }) {
  const members = (content.members as Array<{ name: string; role: string; imageUrl?: string; bio?: string }>) ?? []
  return (
    <section className={`w-full ${t.sectionA} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className={`text-3xl font-bold text-center mb-12 ${t.heading}`}>{content.heading as string}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m, i) => (
            <div key={i} className={`flex flex-col items-center text-center gap-3 p-6 rounded-xl border ${t.card} ${t.cardBorder}`}>
              {m.imageUrl
                ? <img src={m.imageUrl} alt={m.name} className="w-20 h-20 rounded-full object-cover" />
                : <div className={`w-20 h-20 rounded-full flex items-center justify-center ${t.avatarBg}`}>
                    <svg className={`w-10 h-10 ${t.body}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
              }
              <div>
                <p className={`font-semibold ${t.heading}`}>{m.name}</p>
                {m.role && <p className={`text-sm ${t.label}`} style={accentStyle(t, '')}>{m.role}</p>}
                {m.bio && <p className={`text-sm mt-2 leading-relaxed ${t.body}`}>{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TextBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const align = (content.align as string) === 'left' ? 'text-left' : 'text-center'
  const maxW = (content.align as string) === 'left' ? 'max-w-3xl' : 'max-w-2xl mx-auto'
  return (
    <section className={`w-full ${t.sectionB} py-20`}>
      <div className={`${maxW} px-6 mx-auto`}>
        {content.label && (
          <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${align} ${t.useAccentColor ? '' : t.label}`} style={t.useAccentColor ? { color: primary } : {}}>
            {content.label as string}
          </p>
        )}
        {content.heading && (
          <h2 className={`text-3xl sm:text-4xl font-bold leading-snug mb-5 ${align} ${t.heading}`}>{content.heading as string}</h2>
        )}
        {content.body && (
          <p className={`text-lg leading-relaxed mb-8 ${align} ${t.body}`}>{content.body as string}</p>
        )}
        {content.ctaText && (
          <div className={align === 'text-center' ? 'flex justify-center' : ''}>
            <a href={(content.ctaUrl as string) || '#'} className="inline-block px-7 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90" style={btnStyle(primary)}>
              {content.ctaText as string}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function SplitBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const imageUrl = content.imageUrl as string | undefined
  const imageLeft = (content.imagePosition as string) !== 'right'
  const imageEl = imageUrl
    ? <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
    : <div className="w-full h-64 rounded-xl flex items-center justify-center" style={{ backgroundColor: primary + '22' }}>
        <div className="w-16 h-16 rounded-full opacity-30" style={{ backgroundColor: primary }} />
      </div>
  return (
    <section className={`w-full ${t.sectionA} py-20`}>
      <div className={`max-w-6xl mx-auto px-6 flex flex-col ${imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
        <div className="flex-1 min-h-64">{imageEl}</div>
        <div className="flex-1">
          {content.label && (
            <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${t.useAccentColor ? '' : t.label}`} style={t.useAccentColor ? { color: primary } : {}}>
              {content.label as string}
            </p>
          )}
          {content.heading && (
            <h2 className={`text-3xl sm:text-4xl font-bold leading-snug mb-5 ${t.heading}`}>{content.heading as string}</h2>
          )}
          {content.body && (
            <p className={`text-lg leading-relaxed mb-8 ${t.body}`}>{content.body as string}</p>
          )}
          {content.ctaText && (
            <a href={(content.ctaUrl as string) || '#'} className="inline-block px-7 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90" style={btnStyle(primary)}>
              {content.ctaText as string}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function FeaturesBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const items = (content.items as Array<{ icon?: string; label: string; description: string }>) ?? []
  const cols = (content.columns as number) === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <section className={`w-full ${t.sectionB} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className={`text-3xl font-bold text-center mb-12 ${t.heading}`}>{content.heading as string}</h2>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-10`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {item.icon
                  ? <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain rounded-lg" />
                  : <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${t.useAccentColor ? '' : t.iconBg}`} style={t.useAccentColor ? accentBgStyle(t, primary) : {}}>
                      <svg className={`w-5 h-5 ${t.useAccentColor ? 'text-white' : t.label}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                }
                <h3 className={`text-lg font-bold ${t.heading}`}>{item.label}</h3>
              </div>
              {item.description && (
                <p className={`text-base leading-relaxed ${t.body}`}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBlock({ content, t, primary }: { content: Record<string, unknown>; t: Theme; primary: string }) {
  const imageUrl = content.imageUrl as string | undefined
  return (
    <section
      className="relative w-full py-20 text-center"
      style={imageUrl
        ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : btnStyle(primary)
      }
    >
      {imageUrl && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-3">{(content.heading as string) || 'Ready to get started?'}</h2>
        {content.subheading && <p className="text-white/80 mb-8">{content.subheading as string}</p>}
        {content.buttonText && (
          <a href={(content.buttonUrl as string) || '#'} className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90" style={btnInvertStyle(primary)}>
            {content.buttonText as string}
          </a>
        )}
      </div>
    </section>
  )
}

function FooterBlock({ content, t }: { content: Record<string, unknown>; t: Theme }) {
  const links = (content.links as Array<{ label: string; url: string }>) ?? []
  return (
    <footer className={`w-full ${t.footer} py-10`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className={`text-sm ${t.footerText}`}>{(content.copyright as string) || ''}</p>
        {links.length > 0 && (
          <nav className="flex gap-5">
            {links.map((l, i) => (
              <a key={i} href={l.url || '#'} className={`text-sm transition-colors ${t.linkText}`}>{l.label}</a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}

function PitchBlock({ content, t, primary }: { content: PitchBlockContent; t: Theme; primary: string }) {
  const icon = content.logoUrl ?? content.faviconUrl
  const company = content.companyName ?? content.domain
  const lines = content.body
    ? (content.body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean).length > 1
        ? content.body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
        : content.body.split('\n').map(l => l.trim()).filter(Boolean))
    : []

  return (
    <section className={`w-full ${t.sectionA} py-20`}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          {icon
            ? <img src={icon} alt={company} className="w-8 h-8 rounded-lg object-contain" onError={e => { e.currentTarget.style.display = 'none' }} />
            : <div className="w-8 h-8 rounded-lg" style={accentBgStyle(t, primary)} />
          }
          <span className={`text-xs font-semibold tracking-widest uppercase ${t.useAccentColor ? '' : t.label}`} style={t.useAccentColor ? { color: primary } : {}}>
            For {company}
          </span>
        </div>

        <h2 className={`text-3xl sm:text-4xl font-bold leading-snug mb-8 ${t.heading}`}>
          {content.subject}
        </h2>

        <div className={`w-12 h-1 rounded-full mb-10 ${t.useAccentColor ? '' : t.divider}`} style={t.useAccentColor ? { backgroundColor: primary } : {}} />

        <div className="space-y-5">
          {lines.map((line, i) => (
            <p key={i} className={`text-[17px] leading-8 ${t.body}`}>{line}</p>
          ))}
        </div>

        {content.publishedAt && (
          <p className={`mt-10 text-xs ${t.body} opacity-50`}>
            {new Date(content.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </section>
  )
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export function BlockRenderer({ blocks, primaryColor, designTemplate }: Props) {
  if (!blocks || blocks.length === 0) return null

  const t = THEMES[designTemplate] ?? THEMES.modern

  return (
    <div className={`w-full ${t.page}`}>
      {blocks.map(block => {
        const c = block.content as Record<string, unknown>
        switch (block.type) {
          case 'pitch':    return <PitchBlock    key={block.id} content={c as unknown as PitchBlockContent} t={t} primary={primaryColor} />
          case 'header':   return <HeaderBlock   key={block.id} content={c} t={t} primary={primaryColor} />
          case 'hero':     return <HeroBlock     key={block.id} content={c} t={t} primary={primaryColor} />
          case 'text':     return <TextBlock     key={block.id} content={c} t={t} primary={primaryColor} />
          case 'split':    return <SplitBlock    key={block.id} content={c} t={t} primary={primaryColor} />
          case 'features': return <FeaturesBlock key={block.id} content={c} t={t} primary={primaryColor} />
          case 'services': return <ServicesBlock key={block.id} content={c} t={t} primary={primaryColor} />
          case 'team':     return <TeamBlock     key={block.id} content={c} t={t} />
          case 'cta':      return <CtaBlock      key={block.id} content={c} t={t} primary={primaryColor} />
          case 'footer':   return <FooterBlock   key={block.id} content={c} t={t} />
          default:         return null
        }
      })}
    </div>
  )
}
