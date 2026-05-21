export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last updated: January 1, 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using Gridaan, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.' },
            { title: '2. Use of Content', content: 'All content published on Gridaan is protected by copyright. You may read, share, and reference our content for personal and non-commercial purposes. Reproducing or republishing our content without explicit permission is prohibited.' },
            { title: '3. User Conduct', content: 'Users are expected to engage respectfully in comments and discussions. Spam, hate speech, harassment, or any form of abusive behavior will result in account suspension or ban.' },
            { title: '4. Comments & User Content', content: 'By posting comments or content on Gridaan, you grant us a non-exclusive license to use, display, and distribute that content. You are responsible for the content you post and must not post anything illegal, offensive, or infringing.' },
            { title: '5. Advertising', content: 'Gridaan displays advertisements through Google AdSense and other advertising partners. We are not responsible for the content of third-party advertisements. Clicking on ads is at your own discretion.' },
            { title: '6. Disclaimer', content: 'Content on Gridaan is provided for informational purposes only. While we strive for accuracy, we make no warranties about the completeness or reliability of any content. Use information at your own risk.' },
            { title: '7. Limitation of Liability', content: 'Gridaan and its contributors shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or reliance on any content.' },
            { title: '8. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.' },
            { title: '9. Contact', content: 'For questions about these Terms of Service, contact us at legal@gridaan.com.' },
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
