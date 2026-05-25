import { Link } from 'react-router-dom'
import LegalLayout from '../../components/legal/LegalLayout'
import { LEGAL_CONTACT, getLegalYear } from '../../data/legalNav'

export default function DisclaimerPage() {
  const year = getLegalYear()

  return (
    <LegalLayout
      title="Disclaimer"
      description="Important disclaimers about Gridaan content, AI/tech information, external links, and limitations of liability."
      path="/disclaimer"
      intro={`Gridaan publishes technology news, AI analysis, tutorials, and opinion pieces. This Disclaimer clarifies the limits of our responsibility in ${year}.`}
      sections={[
        {
          id: 'general',
          title: '1. General Information Only',
          content: (
            <p>
              All content on Gridaan—including articles, tutorials, videos, newsletters, and
              comments—is provided for general informational and educational purposes. It does not
              constitute professional advice (legal, financial, medical, security, or engineering).
              Consult qualified professionals before making decisions based on site content.
            </p>
          ),
        },
        {
          id: 'accuracy',
          title: '2. Accuracy & Timeliness',
          content: (
            <p>
              We strive for accurate, up-to-date coverage of technology and AI topics, but rapidly
              evolving fields mean information may become outdated or contain errors. We make no
              warranty that content is complete, current, or suitable for your specific situation.
              Verify critical facts independently.
            </p>
          ),
        },
        {
          id: 'ai',
          title: '3. AI & Emerging Technology',
          content: (
            <p>
              Articles about artificial intelligence, automation, APIs, and experimental tools may
              describe capabilities that change without notice. Performance claims, benchmarks, and
              vendor statements are not independently guaranteed by Gridaan. Use third-party AI
              services according to their own terms and safety guidelines.
            </p>
          ),
        },
        {
          id: 'tutorials',
          title: '4. Tutorials & Code Samples',
          content: (
            <p>
              Tutorials may include code snippets, configuration steps, or deployment instructions.
              You are responsible for testing in appropriate environments, backing up data, and
              complying with licenses. We are not liable for downtime, data loss, or security issues
              resulting from following tutorials.
            </p>
          ),
        },
        {
          id: 'external',
          title: '5. External Links & References',
          content: (
            <p>
              Gridaan frequently links to external websites, documentation, repositories, and
              products. These links do not constitute endorsement. We do not control third-party
              content, availability, or privacy practices. Your use of external resources is at your
              own risk.
            </p>
          ),
        },
        {
          id: 'ads',
          title: '6. Third-Party Advertisements',
          content: (
            <p>
              Advertisements displayed on Gridaan (including programmatic ads) are served by third
              parties. We are not responsible for ad content, offers, pricing, or transactions. Any
              relationship you enter with an advertiser is solely between you and that party.
            </p>
          ),
        },
        {
          id: 'affiliate',
          title: '7. Affiliate & Sponsored Content',
          content: (
            <p>
              Some posts may reference products, courses, or services. Where applicable, we will
              disclose sponsored or affiliate relationships. Opinions remain those of the authors unless
              explicitly labeled as paid promotion.
            </p>
          ),
        },
        {
          id: 'views',
          title: '8. Opinions & Comments',
          content: (
            <p>
              Editorial opinions are those of the named authors. User comments reflect individual
              views and not necessarily Gridaan&apos;s position. We moderate comments but do not
              guarantee their accuracy or legality.
            </p>
          ),
        },
        {
          id: 'liability',
          title: '9. Limitation of Liability',
          content: (
            <p>
              To the maximum extent permitted by law, Gridaan, its owners, editors, and contributors
              disclaim all liability for damages arising from reliance on site content, including
              direct, indirect, incidental, and consequential damages. Some jurisdictions do not
              allow certain exclusions; in those cases, our liability is limited to the extent
              allowed by law.
            </p>
          ),
        },
        {
          id: 'related',
          title: '10. Related Policies',
          content: (
            <p>
              This Disclaimer supplements our{' '}
              <Link to="/terms-and-conditions" className="text-[#14B8A6] hover:underline">
                Terms & Conditions
              </Link>
              ,{' '}
              <Link to="/privacy-policy" className="text-[#14B8A6] hover:underline">
                Privacy Policy
              </Link>
              , and{' '}
              <Link to="/cookie-policy" className="text-[#14B8A6] hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          ),
        },
        {
          id: 'contact',
          title: '11. Contact',
          content: (
            <p>
              Questions about this Disclaimer:{' '}
              <a href={`mailto:${LEGAL_CONTACT.legal}`} className="text-[#14B8A6] hover:underline">
                {LEGAL_CONTACT.legal}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
