import { Link } from 'react-router-dom'
import LegalLayout from '../../components/legal/LegalLayout'
import { LEGAL_CONTACT, getLegalYear } from '../../data/legalNav'

export default function PrivacyPolicyPage() {
  const year = getLegalYear()

  return (
    <LegalLayout
      title="Privacy Policy"
      description="Learn how Gridaan collects, uses, and protects your personal data on our AI and technology publishing platform."
      path="/privacy-policy"
      intro={`This Privacy Policy explains how Gridaan ("we", "us", "our") handles information when you read articles, tutorials, news, and other digital content on gridaan.com in ${year}.`}
      sections={[
        {
          id: 'scope',
          title: '1. Scope',
          content: (
            <p>
              This policy applies to visitors and registered users of Gridaan, including readers of
              our tech blog, AI news coverage, tutorials, videos, newsletters, and community features.
              By using the site, you agree to the practices described here.
            </p>
          ),
        },
        {
          id: 'collect',
          title: '2. Information We Collect',
          content: (
            <>
              <p>We may collect the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
                <li>
                  <strong className="text-[#F8FAFC]">Account data:</strong> email address, display
                  name, and authentication identifiers when you sign in (e.g. via Google OAuth).
                </li>
                <li>
                  <strong className="text-[#F8FAFC]">User-generated content:</strong> comments,
                  bookmarks, and profile information you choose to provide.
                </li>
                <li>
                  <strong className="text-[#F8FAFC]">Communications:</strong> messages sent through
                  contact forms or support requests.
                </li>
                <li>
                  <strong className="text-[#F8FAFC]">Usage data:</strong> pages viewed, referring
                  URLs, device type, browser, approximate location, and interaction events collected
                  via cookies and analytics tools.
                </li>
                <li>
                  <strong className="text-[#F8FAFC]">Technical logs:</strong> IP address, timestamps,
                  and security-related metadata required to operate and protect the service.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'use',
          title: '3. How We Use Your Information',
          content: (
            <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
              <li>Deliver, personalize, and improve articles, tutorials, and platform features.</li>
              <li>Authenticate users, manage sessions, and enforce admin access controls.</li>
              <li>Send newsletters or product updates where you have opted in.</li>
              <li>Measure audience engagement with Google Analytics (GA4).</li>
              <li>Display and measure third-party advertising, including Google AdSense or similar partners.</li>
              <li>Detect abuse, spam, fraud, and security incidents.</li>
              <li>Comply with legal obligations and respond to lawful requests.</li>
            </ul>
          ),
        },
        {
          id: 'analytics',
          title: '4. Google Analytics (GA4)',
          content: (
            <p>
              We use Google Analytics 4 (measurement ID G-2KHF0F8DMM) to understand how visitors
              discover and use Gridaan. Google may process usage data according to its own privacy
              policy. You can limit analytics through browser settings, opt-out extensions, or
              Google&apos;s{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="text-[#14B8A6] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Analytics opt-out tools
              </a>
              .
            </p>
          ),
        },
        {
          id: 'cookies',
          title: '5. Cookies & Similar Technologies',
          content: (
            <p>
              We use cookies, local storage, and similar technologies for authentication, preferences,
              analytics, and advertising. See our{' '}
              <Link to="/cookie-policy" className="text-[#14B8A6] hover:underline">
                Cookie Policy
              </Link>{' '}
              for details. You may control cookies through your browser; disabling some cookies may
              affect site functionality.
            </p>
          ),
        },
        {
          id: 'sharing',
          title: '6. Sharing & Third Parties',
          content: (
            <>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#2563EB]">
                <li>Hosting and infrastructure providers (e.g. Vercel, Supabase).</li>
                <li>Analytics providers (Google Analytics).</li>
                <li>Advertising partners serving third-party ads on our pages.</li>
                <li>Authentication providers when you choose social login.</li>
                <li>Professional advisers or authorities when required by law.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'retention',
          title: '7. Data Retention',
          content: (
            <p>
              We retain personal data only as long as needed for the purposes above, including legal,
              accounting, and security requirements. Comment and account data may persist until you
              request deletion or we remove it under our content policies.
            </p>
          ),
        },
        {
          id: 'rights',
          title: '8. Your Rights',
          content: (
            <p>
              Depending on your location, you may have rights to access, correct, delete, restrict,
              or port your personal data, and to object to certain processing. EU/UK users may lodge
              complaints with a supervisory authority. To exercise rights, contact{' '}
              <a href={`mailto:${LEGAL_CONTACT.privacy}`} className="text-[#14B8A6] hover:underline">
                {LEGAL_CONTACT.privacy}
              </a>
              .
            </p>
          ),
        },
        {
          id: 'security',
          title: '9. Security',
          content: (
            <p>
              We apply reasonable technical and organizational safeguards, including encrypted
              transport (HTTPS) and access controls. No online service can guarantee absolute
              security; use Gridaan at your own risk where applicable.
            </p>
          ),
        },
        {
          id: 'children',
          title: '10. Children',
          content: (
            <p>
              Gridaan is not directed at children under 16. We do not knowingly collect personal
              information from children. Contact us if you believe a child has provided data.
            </p>
          ),
        },
        {
          id: 'changes',
          title: '11. Changes to This Policy',
          content: (
            <p>
              We may update this Privacy Policy periodically. Material changes will be reflected by
              updating the &quot;Last updated&quot; date. Continued use after changes constitutes
              acceptance of the revised policy.
            </p>
          ),
        },
        {
          id: 'contact',
          title: '12. Contact',
          content: (
            <p>
              Questions about privacy:{' '}
              <a href={`mailto:${LEGAL_CONTACT.privacy}`} className="text-[#14B8A6] hover:underline">
                {LEGAL_CONTACT.privacy}
              </a>
              . General inquiries:{' '}
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
