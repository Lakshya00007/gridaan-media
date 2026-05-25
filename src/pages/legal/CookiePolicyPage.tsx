import { Link } from 'react-router-dom'
import LegalLayout from '../../components/legal/LegalLayout'
import { LEGAL_CONTACT, getLegalYear } from '../../data/legalNav'

export default function CookiePolicyPage() {
  const year = getLegalYear()

  return (
    <LegalLayout
      title="Cookie Policy"
      description="How Gridaan uses cookies, Google Analytics, advertising technologies, and how you can manage preferences."
      path="/cookie-policy"
      intro={`This Cookie Policy explains how Gridaan uses cookies and similar technologies when you visit our site in ${year}.`}
      sections={[
        {
          id: 'what',
          title: '1. What Are Cookies?',
          content: (
            <p>
              Cookies are small text files stored on your device when you visit a website. We also
              use similar technologies such as local storage, session storage, and pixels to remember
              preferences, keep you signed in, and understand how the site is used.
            </p>
          ),
        },
        {
          id: 'why',
          title: '2. Why We Use Cookies',
          content: (
            <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
              <li>Operate core features (navigation, authentication, security).</li>
              <li>Remember display preferences such as theme or layout settings.</li>
              <li>Measure traffic and engagement via Google Analytics 4.</li>
              <li>Deliver and measure third-party advertisements.</li>
              <li>Protect against abuse and improve performance.</li>
            </ul>
          ),
        },
        {
          id: 'types',
          title: '3. Types of Cookies We Use',
          content: (
            <>
              <div className="overflow-x-auto rounded-xl border border-[#1E293B]/50">
                <table className="w-full text-left text-sm min-w-[280px]">
                  <thead>
                    <tr className="border-b border-[#1E293B]/50 bg-[#080d1a]/60">
                      <th className="px-4 py-3 font-semibold text-[#F8FAFC]">Category</th>
                      <th className="px-4 py-3 font-semibold text-[#F8FAFC]">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/40">
                    <tr>
                      <td className="px-4 py-3 text-[#F8FAFC]">Essential</td>
                      <td className="px-4 py-3">Login sessions, security, load balancing</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#F8FAFC]">Functional</td>
                      <td className="px-4 py-3">Preferences, bookmarks, UI state</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#F8FAFC]">Analytics</td>
                      <td className="px-4 py-3">Google Analytics (GA4) usage statistics</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#F8FAFC]">Advertising</td>
                      <td className="px-4 py-3">Ad delivery, frequency caps, relevance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          id: 'ga4',
          title: '4. Google Analytics (GA4)',
          content: (
            <p>
              We use Google Analytics 4 with measurement ID <strong className="text-[#F8FAFC]">G-2KHF0F8DMM</strong>.
              Google may set cookies such as <code className="text-[#14B8A6]">_ga</code> and{' '}
              <code className="text-[#14B8A6]">_ga_*</code> to distinguish users and sessions. Data
              processed may include pages visited, approximate geography, device information, and
              referral source. Review{' '}
              <a
                href="https://policies.google.com/privacy"
                className="text-[#14B8A6] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>{' '}
              for details.
            </p>
          ),
        },
        {
          id: 'ads',
          title: '5. Advertising Cookies',
          content: (
            <p>
              Third-party ad partners (including Google AdSense or similar networks) may place cookies
              to show relevant ads, limit repeat impressions, and measure campaign performance. These
              partners process data under their own policies. You can manage ad personalization via{' '}
              <a
                href="https://adssettings.google.com"
                className="text-[#14B8A6] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </p>
          ),
        },
        {
          id: 'third',
          title: '6. Third-Party Cookies',
          content: (
            <p>
              Embedded content (videos, social widgets, GitHub gists, etc.) may set cookies from
              those providers. We do not control third-party cookies; check each provider&apos;s policy
              when interacting with embedded media.
            </p>
          ),
        },
        {
          id: 'manage',
          title: '7. Managing Cookies',
          content: (
            <>
              <p>You can control cookies in several ways:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
                <li>Browser settings to block or delete cookies.</li>
                <li>Private/incognito browsing modes.</li>
                <li>Industry opt-out tools for interest-based advertising.</li>
                <li>Disabling analytics via browser extensions or Google opt-out add-ons.</li>
              </ul>
              <p className="mt-3">
                Blocking essential cookies may prevent sign-in, comments, or other features from
                working correctly.
              </p>
            </>
          ),
        },
        {
          id: 'storage',
          title: '8. Local Storage',
          content: (
            <p>
              We may store notification preferences, newsletter state, or similar data in local
              storage on your device. This data stays on your device until cleared via browser settings
              or our UI controls where available.
            </p>
          ),
        },
        {
          id: 'updates',
          title: '9. Updates',
          content: (
            <p>
              We may update this Cookie Policy when our technology stack or partners change. The
              &quot;Last updated&quot; date at the top reflects the latest revision.
            </p>
          ),
        },
        {
          id: 'more',
          title: '10. More Information',
          content: (
            <p>
              For how we handle personal data, see our{' '}
              <Link to="/privacy-policy" className="text-[#14B8A6] hover:underline">
                Privacy Policy
              </Link>
              . Questions:{' '}
              <a href={`mailto:${LEGAL_CONTACT.privacy}`} className="text-[#14B8A6] hover:underline">
                {LEGAL_CONTACT.privacy}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
