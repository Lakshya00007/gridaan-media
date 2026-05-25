import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEO from '../seo/SEO'
import { siteUrl } from '../../lib/theme'
import { getLegalYear, LEGAL_PAGES } from '../../data/legalNav'

export interface LegalSection {
  id: string
  title: string
  content: ReactNode
}

interface LegalLayoutProps {
  title: string
  description: string
  path: string
  intro?: string
  sections: LegalSection[]
}

export default function LegalLayout({
  title,
  description,
  path,
  intro,
  sections,
}: LegalLayoutProps) {
  const year = getLegalYear()
  const canonicalUrl = `${siteUrl}${path}`
  const location = useLocation()

  const resolveActivePath = (pathname: string) => {
    if (pathname === '/privacy') return '/privacy-policy'
    if (pathname === '/terms') return '/terms-and-conditions'
    return pathname
  }

  const activePath = resolveActivePath(location.pathname)

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <SEO title={title} description={description} url={canonicalUrl} type="website" />

      <header className="relative overflow-hidden border-b border-[#1E293B]/40 bg-mesh-hero">
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#14B8A6] mb-3">
            Legal
          </p>
          <h1 className="text-section font-bold text-[#F8FAFC] tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-[#64748B]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          {intro && (
            <p className="mt-6 text-base text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
              {intro}
            </p>
          )}
        </div>
      </header>

      <nav
        aria-label="Legal pages"
        className="sticky top-16 z-40 border-b border-[#1E293B]/50 bg-[#080d1a]/90 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {LEGAL_PAGES.map((item) => {
              const isActive = activePath === item.to
              return (
                <li key={item.to} className="shrink-0">
                  <Link
                    to={item.to}
                    className={`inline-block rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                        : 'bg-[#0B1224]/80 text-[#94A3B8] ring-1 ring-white/10 hover:text-white hover:ring-[#2563EB]/40'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-2xl border border-[#1E293B]/50 bg-[#0B1224]/40 p-6 sm:p-8 shadow-xl shadow-black/10 backdrop-blur-sm">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-lg sm:text-xl font-semibold text-[#F8FAFC] mb-3">
                  {section.title}
                </h2>
                <div className="text-sm sm:text-base text-[#94A3B8] leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#64748B]">
          <p>© {year} Gridaan. All rights reserved.</p>
          <Link
            to="/contact"
            className="font-medium text-[#14B8A6] hover:text-[#5eead4] transition-colors"
          >
            Questions? Contact us →
          </Link>
        </footer>
      </article>
    </div>
  )
}
