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
    <div className="min-h-screen bg-[#f8f8f7]">
      <SEO title={title} description={description} url={canonicalUrl} type="website" />

      <header className="relative overflow-hidden border-b border-[#e6e6e6] bg-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563eb] mb-3">
            Legal
          </p>
          <h1 className="text-section font-semibold text-[#1c1c1c] tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-[#6b6b6b]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          {intro && (
            <p className="mt-6 text-base text-[#6b6b6b] leading-relaxed max-w-2xl mx-auto">
              {intro}
            </p>
          )}
        </div>
      </header>

      <nav
        aria-label="Legal pages"
        className="sticky top-16 z-40 border-b border-[#e6e6e6] bg-white/90 backdrop-blur-md"
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
                        ? 'bg-[#eef4ff] text-[#1d4ed8] border border-[#cfe0ff]'
                        : 'bg-white text-[#4b4b4b] border border-[#e6e6e6] hover:bg-[#f5f5f2]'
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
        <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1c1c1c] mb-3">
                  {section.title}
                </h2>
                <div className="text-sm sm:text-base text-[#4b4b4b] leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6b6b6b]">
          <p>© {year} Gridaan. All rights reserved.</p>
          <Link
            to="/contact"
            className="font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
          >
            Questions? Contact us →
          </Link>
        </footer>
      </article>
    </div>
  )
}
