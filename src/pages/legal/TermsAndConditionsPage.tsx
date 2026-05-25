import { Link } from 'react-router-dom'
import LegalLayout from '../../components/legal/LegalLayout'
import { LEGAL_CONTACT, getLegalYear } from '../../data/legalNav'

export default function TermsAndConditionsPage() {
  const year = getLegalYear()

  return (
    <LegalLayout
      title="Terms & Conditions"
      description="Terms and conditions governing your use of Gridaan, including content, accounts, advertising, and liability."
      path="/terms-and-conditions"
      intro={`These Terms & Conditions ("Terms") govern access to Gridaan in ${year}. Please read them carefully before using our technology news, tutorials, and publishing platform.`}
      sections={[
        {
          id: 'acceptance',
          title: '1. Acceptance of Terms',
          content: (
            <p>
              By accessing gridaan.com or any Gridaan service, you agree to these Terms and our{' '}
              <Link to="/privacy-policy" className="text-[#14B8A6] hover:underline">
                Privacy Policy
              </Link>
              . If you disagree, do not use the site.
            </p>
          ),
        },
        {
          id: 'service',
          title: '2. The Service',
          content: (
            <p>
              Gridaan provides editorial content, tutorials, AI and technology news, videos,
              bookmarks, comments, and related digital publishing features. We may add, modify, or
              discontinue features at any time without prior notice.
            </p>
          ),
        },
        {
          id: 'accounts',
          title: '3. Accounts & Authentication',
          content: (
            <p>
              Some features require an account (e.g. admin dashboard, comments, bookmarks). You are
              responsible for safeguarding credentials and for activity under your account. We may
              suspend or terminate accounts that violate these Terms or applicable law.
            </p>
          ),
        },
        {
          id: 'content',
          title: '4. Editorial Content & Copyright',
          content: (
            <>
              <p>
                Unless otherwise stated, all articles, graphics, logos, and site design are owned by
                Gridaan or our licensors and protected by copyright and intellectual property laws.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
                <li>You may read, share links, and quote limited excerpts with attribution.</li>
                <li>Republication, scraping, or commercial reuse requires written permission.</li>
                <li>Third-party trademarks and media remain the property of their owners.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'user-content',
          title: '5. User Comments & Submissions',
          content: (
            <p>
              By posting comments or other submissions, you grant Gridaan a non-exclusive, worldwide,
              royalty-free license to host, display, and distribute that content in connection with
              the service. You represent that you have the right to post the content and that it does
              not infringe third-party rights or violate law. We may remove content at our discretion.
            </p>
          ),
        },
        {
          id: 'conduct',
          title: '6. Acceptable Use',
          content: (
            <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
              <li>No spam, malware, harassment, hate speech, or illegal activity.</li>
              <li>No attempts to breach security, scrape at scale, or disrupt infrastructure.</li>
              <li>No impersonation of Gridaan staff or other users.</li>
              <li>Respect community guidelines in discussions and feedback.</li>
            </ul>
          ),
        },
        {
          id: 'ads',
          title: '7. Advertising & Third-Party Services',
          content: (
            <p>
              Gridaan may display third-party advertisements (including Google AdSense or similar).
              Ads are provided by independent partners; we do not endorse advertised products. Your
              interactions with advertisers are solely between you and the advertiser. External links
              are provided for convenience; see our{' '}
              <Link to="/disclaimer" className="text-[#14B8A6] hover:underline">
                Disclaimer
              </Link>
              .
            </p>
          ),
        },
        {
          id: 'external',
          title: '8. External Links',
          content: (
            <p>
              The site may link to third-party websites, tools, or documentation. We are not
              responsible for their content, privacy practices, or availability. Access external sites
              at your own risk.
            </p>
          ),
        },
        {
          id: 'disclaimer',
          title: '9. Informational Purpose',
          content: (
            <p>
              Content is for general information and education only—not professional, legal,
              financial, or technical advice. See the full{' '}
              <Link to="/disclaimer" className="text-[#14B8A6] hover:underline">
                Disclaimer
              </Link>{' '}
              for limitations.
            </p>
          ),
        },
        {
          id: 'liability',
          title: '10. Limitation of Liability',
          content: (
            <p>
              To the fullest extent permitted by law, Gridaan and its contributors shall not be liable
              for indirect, incidental, special, consequential, or punitive damages, or for loss of
              profits, data, or goodwill arising from your use of the site. Our total liability for
              any claim shall not exceed the greater of USD $100 or the amount you paid us in the past
              twelve months (if any).
            </p>
          ),
        },
        {
          id: 'warranty',
          title: '11. Disclaimer of Warranties',
          content: (
            <p>
              The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
              of any kind, express or implied, including merchantability, fitness for a particular
              purpose, and non-infringement. We do not warrant uninterrupted or error-free operation.
            </p>
          ),
        },
        {
          id: 'indemnity',
          title: '12. Indemnification',
          content: (
            <p>
              You agree to indemnify and hold harmless Gridaan from claims arising out of your use of
              the service, your content, or your violation of these Terms or third-party rights.
            </p>
          ),
        },
        {
          id: 'law',
          title: '13. Governing Law',
          content: (
            <p>
              These Terms are governed by the laws of the State of California, United States, without
              regard to conflict-of-law principles, except where mandatory local law applies.
            </p>
          ),
        },
        {
          id: 'changes',
          title: '14. Changes',
          content: (
            <p>
              We may revise these Terms at any time. Updated Terms take effect when posted with a new
              &quot;Last updated&quot; date. Continued use constitutes acceptance.
            </p>
          ),
        },
        {
          id: 'contact',
          title: '15. Contact',
          content: (
            <p>
              Legal inquiries:{' '}
              <a href={`mailto:${LEGAL_CONTACT.legal}`} className="text-[#14B8A6] hover:underline">
                {LEGAL_CONTACT.legal}
              </a>
              . Support:{' '}
              <a href={`mailto:${LEGAL_CONTACT.general}`} className="text-[#14B8A6] hover:underline">
                {LEGAL_CONTACT.general}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
