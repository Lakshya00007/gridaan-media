import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Code, BookOpen, Play, Rss, Heart } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCategories } from '../../hooks/useArticles';

export default function Footer() {
  const { newsletterEmail, setNewsletterEmail, subscribed, subscribe, subscriberCount } = useUI();
  const { data: categories = [] } = useCategories();

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      subscribe(newsletterEmail);
    }
  };

  return (
    <footer className="bg-[#060A16] dark:bg-[#060A16] text-[#94A3B8] border-t border-[#1E293B]">
      {/* Newsletter */}
      <div className="bg-linear-to-r from-[#2563EB] via-[#334155] to-[#1D4ED8]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay ahead of the curve</h3>
            <p className="text-[#94A3B8] mb-6">Get the latest articles, tutorials, and tech news delivered to your inbox weekly.</p>
            {subscribed ? (
              <div className="bg-[#0B1224]/20 backdrop-blur rounded-xl p-4 text-white font-medium">
                ✅ You're subscribed! Check your inbox for confirmation.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-[#0B1224]/10 backdrop-blur border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  required
                />
                <button type="submit" className="px-8 py-3.5 bg-[#0B1224] text-[#2563EB] rounded-xl font-semibold hover:bg-[#0B1224] transition-all shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-xs text-[#94A3B8] mt-3">No spam. Unsubscribe anytime. {subscriberCount.toLocaleString()}+ subscribers</p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-linear-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-white">Gridaan</span>
            </Link>
            <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed">
              Your premium source for technology news, tutorials, and expert insights. Empowering developers and tech enthusiasts worldwide.
            </p>
            <div className="flex gap-3">
              {[Globe, Code, BookOpen, Play, Rss].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-[#0B1224] hover:bg-[#2563EB] flex items-center justify-center transition-all hover:-translate-y-0.5">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-[#94A3B8] hover:text-[#94A3B8] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-sm text-[#94A3B8]">No categories yet</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/trending', label: 'Trending' },
                { to: '/tutorials', label: 'Tutorials' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#94A3B8] hover:text-[#94A3B8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#94A3B8]" />
                gridaanmedia@gmail.com
              </li>
              <li>San Francisco, CA</li>
              <li>United States</li>
            </ul>
            <div className="mt-4 p-3 bg-[#0B1224] rounded-lg">
              <p className="text-xs text-[#94A3B8]">📢 Want to advertise?</p>
              <Link to="/contact" className="text-xs text-[#94A3B8] font-medium hover:underline">Contact our ad team →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#94A3B8]">
            © 2026 Gridaan. All rights reserved.
          </p>
          <p className="text-sm text-[#94A3B8] flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the developer community
          </p>
        </div>
      </div>
    </footer>
  );
}
