import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-300 text-lg">Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email Us', detail: 'hello@gridaan.com', sub: 'We respond within 24 hours' },
              { icon: MapPin, title: 'Location', detail: 'San Francisco, CA', sub: 'United States' },
              { icon: Clock, title: 'Business Hours', detail: 'Mon - Fri: 9AM - 6PM PST', sub: 'Weekend: Limited support' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.detail}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}

            <div className="p-5 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl text-white">
              <h3 className="font-bold mb-2">📢 Advertising</h3>
              <p className="text-sm text-indigo-100 mb-3">Interested in advertising with Gridaan? We offer banner ads, sponsored posts, and native advertising.</p>
              <p className="text-xs text-indigo-200">ads@gridaan.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {sent ? (
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
                <p className="text-gray-500 dark:text-gray-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    <option value="">Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Advertising & Partnerships</option>
                    <option>Content Submission</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" placeholder="Your message..." />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
