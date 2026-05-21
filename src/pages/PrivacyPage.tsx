export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: January 1, 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray dark:prose-invert">
        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly, such as your name, email address when subscribing to our newsletter, and any information you provide through our contact forms. We also automatically collect certain information about your device and usage patterns through cookies and similar technologies.' },
            { title: '2. How We Use Your Information', content: 'We use the information we collect to provide and improve our services, send you newsletter updates (if subscribed), personalize your experience, analyze website traffic and trends, and display relevant advertisements through Google AdSense.' },
            { title: '3. Cookies & Tracking', content: 'We use cookies and similar tracking technologies to track activity on our website and store certain information. This includes Google Analytics for traffic analysis and Google AdSense for personalized advertising. You can manage cookie preferences through your browser settings.' },
            { title: '4. Third-Party Services', content: 'We use third-party services including Google AdSense for advertising, Google Analytics for website analytics, and various social media platforms for content sharing. Each of these services has their own privacy policies governing their use of your information.' },
            { title: '5. Data Security', content: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.' },
            { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal information. You can unsubscribe from our newsletter at any time. For EU residents, you have additional rights under GDPR including the right to data portability and the right to restrict processing.' },
            { title: '7. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at privacy@nexusmedia.com.' },
          ].map(section => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
              <p className="leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
