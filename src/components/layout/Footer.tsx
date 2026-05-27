import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Code, BookOpen, Play, Rss, Heart } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCategories } from '../../hooks/useArticles';
import { getLegalYear, LEGAL_PAGES } from '../../data/legalNav';
import Card from '../ui/Card';
import { Button } from '../ui';

export default function Footer() {
  const { newsletterEmail, setNewsletterEmail, subscribed, subscribe, subscriberCount } = useUI();
  const { data: categories = [] } = useCategories();
  const year = getLegalYear();

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      subscribe(newsletterEmail);
    }
  };

  return (
    <footer className="bg-card text-text-secondary border-t border-border transition-colors duration-300">
      
      {/* Newsletter Block */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Card className="max-w-3xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Stay ahead of the curve</h3>
                <p className="text-sm text-text-secondary mt-1">Get the best articles and tutorials delivered weekly.</p>
              </div>
              <div className="w-full md:w-auto">
                {subscribed ? (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-primary font-semibold text-center">🎉 Subscribed</div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="you@company.com" className="px-4 py-2 rounded-lg border border-border w-full md:w-72" required />
                    <Button type="submit" variant="primary" size="md">Subscribe</Button>
                  </form>
                )}
                <div className="text-xs text-text-secondary mt-2">Join {subscriberCount.toLocaleString()}+ readers — no spam.</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-xs">
                <span className="text-white font-bold text-base">G</span>
              </div>
              <span className="text-lg font-bold text-text group-hover:text-primary transition-colors">Gridaan</span>
            </Link>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed max-w-sm">
              Your premium source for technology news, tutorials, and expert insights. Empowering developers and tech enthusiasts worldwide with quality editorial coverage.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Globe, href: '#' },
                { Icon: Code, href: '#' },
                { Icon: BookOpen, href: '#' },
                { Icon: Play, href: '#' },
                { Icon: Rss, href: '#' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  className="w-8 h-8 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center text-text-secondary hover:text-primary transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-xs text-text-secondary hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-xs text-text-secondary">No categories yet</li>
              )}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Support' },
                { to: '/trending', label: 'Trending News' },
                { to: '/tutorials', label: 'Guides & Tutorials' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs text-text-secondary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {LEGAL_PAGES.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs text-text-secondary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>

        {/* Contact Info Widget */}
        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="flex items-center gap-1.5 text-text">
              <Mail className="w-3.5 h-3.5 text-primary" />
              gridaanmedia@gmail.com
            </span>
            <span>San Francisco, CA · United States</span>
          </div>
          <div className="text-xs">
            <span className="text-text-secondary">Interested in partnering?</span>{' '}
            <Link to="/contact" className="text-primary font-bold hover:underline">Advertise with us →</Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-border bg-bg/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © {year} Gridaan. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the tech community.
          </p>
        </div>
      </div>
    </footer>
  );
}
