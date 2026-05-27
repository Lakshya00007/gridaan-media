import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/seo/SEO';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Contact Us"
        description="Get in touch with the Gridaan team for advertising inquiries, feedback, or support queries."
      />
      <div className="bg-mesh-hero border-b border-border text-text">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', detail: 'hello@gridaan.com', sub: 'We respond within 24 hours' },
              { icon: MapPin, title: 'Location', detail: 'San Francisco, CA', sub: 'United States' },
              { icon: Clock, title: 'Business Hours', detail: 'Mon - Fri: 9AM - 6PM PST', sub: 'Weekend: Limited support' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-5 bg-card rounded-2xl border border-border shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-text">{item.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{item.detail}</p>
                  <p className="text-[10px] text-text-secondary font-medium mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}

            <div className="p-5 bg-card border border-primary/20 rounded-3xl shadow-xs">
              <h3 className="font-bold text-xs text-text mb-2">📢 Advertising</h3>
              <p className="text-xs text-text-secondary mb-3 leading-relaxed">Interested in advertising with Gridaan? We offer banner ads, sponsored posts, and native advertising.</p>
              <p className="text-[10px] font-bold tracking-wider text-primary">ads@gridaan.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {sent ? (
              <div className="bg-card rounded-3xl border border-border p-12 text-center shadow-xs">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-text mb-2">Message Sent!</h2>
                <p className="text-xs text-text-secondary">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-6 md:p-8 space-y-4 shadow-xs">
                <h2 className="text-sm font-bold text-text mb-2">Send us a message</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-xs text-text placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-xs text-text placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Subject</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-xs text-text placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="">Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Advertising & Partnerships</option>
                    <option>Content Submission</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={4} className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-xs text-text placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none" placeholder="Your message..." />
                </div>
                <button type="submit" className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#1d4ed8] transition-colors cursor-pointer">
                  <Send className="w-3.5 h-3.5" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
