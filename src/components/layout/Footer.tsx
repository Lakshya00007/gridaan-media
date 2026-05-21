import { Link } from 'react-router-dom';
import { Mail, Globe, Code, BookOpen, Play, Rss, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/mockData';

export default function Footer() {
  const { newsletterEmail, setNewsletterEmail, subscribed, subscribe, subscribers } = useApp();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      subscribe(newsletterEmail);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay ahead of the curve</h3>
            <p className="text-indigo-100 mb-6">Get the latest articles, tutorials, and tech news delivered to your inbox weekly.</p>
            {subscribed ? (
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-white font-medium">
                ✅ You're subscribed! Check your inbox for confirmation.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  required
                />
                <button type="submit" className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-xs text-indigo-200 mt-3">No spam. Unsubscribe anytime. {subscribers.length.toLocaleString()}+ subscribers</p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-white">NexusMedia</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your premium source for technology news, tutorials, and expert insights. Empowering developers and tech enthusiasts worldwide.
            </p>
            <div className="flex gap-3">
              {[Globe, Code, BookOpen, Play, Rss].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all hover:-translate-y-0.5">
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
                  <Link to={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
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
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                hello@nexusmedia.com
              </li>
              <li>San Francisco, CA</li>
              <li>United States</li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">📢 Want to advertise?</p>
              <Link to="/contact" className="text-xs text-indigo-400 font-medium hover:underline">Contact our ad team →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 NexusMedia. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the developer community
          </p>
        </div>
      </div>
    </footer>
  );
}
