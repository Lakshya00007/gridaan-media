import { useState, type FormEvent, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun, Bookmark, User, ChevronDown, LogOut, FileText, Mail, Info } from 'lucide-react';
 
import NotificationBell from '../notifications/NotificationBell';
import { useUI } from '../../context/UIContext';
import { useAuthUser } from '../../hooks/useAuthUser';
import { signOut } from '../../lib/auth';
import GridaanLogo from './GridaanLogo';
import { useCategories } from '../../hooks/useArticles';

export default function Header() {
  const { darkMode, toggleDarkMode, searchQuery, setSearchQuery, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, isAdmin } = useAuthUser();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categories = [] } = useCategories();
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setCategoriesOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 bg-card/70 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? 'shadow-sm border-border/90' : 'border-border/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LEFT: Logo & Links */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all">
                <GridaanLogo className="w-7 h-7 text-primary" />
              </div>
              <span className="text-lg font-bold text-text tracking-tight group-hover:text-primary transition-colors">
                Gridaan
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link 
                to="/" 
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  location.pathname === '/' 
                    ? 'text-primary bg-primary/5' 
                    : 'text-text-secondary hover:text-text hover:bg-bg'
                }`}
              >
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button 
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    categoriesOpen 
                      ? 'text-primary bg-primary/5' 
                      : 'text-text-secondary hover:text-text hover:bg-bg'
                  }`}
                >
                  Categories <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                  {categoriesOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-card rounded-2xl shadow-xl border border-border py-2 z-50 transition transform duration-150 ease-out">
                      <div className="grid grid-cols-1 gap-0.5 p-1">
                        {categories.slice(0, 8).map(cat => (
                          <Link 
                            key={cat.id} 
                            to={`/category/${cat.slug}`} 
                            className="flex items-center gap-3 px-3 py-2 hover:bg-bg rounded-xl transition-all"
                          >
                            <span className="text-base">{cat.icon}</span>
                            <div>
                              <div className="text-xs font-semibold text-text">{cat.name}</div>
                              <div className="text-[10px] text-text-secondary">{cat.count} articles</div>
                            </div>
                          </Link>
                        ))}
                        {categories.length === 0 && (
                          <div className="px-4 py-3 text-xs text-text-secondary">No categories yet</div>
                        )}
                        <div className="border-t border-border mt-1 pt-1">
                          <Link 
                            to="/categories" 
                            className="block px-3 py-2 text-xs text-center text-primary font-bold hover:bg-primary/5 rounded-xl transition-all"
                          >
                            View all categories →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              <Link 
                to="/trending" 
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  location.pathname === '/trending' 
                    ? 'text-primary bg-primary/5' 
                    : 'text-text-secondary hover:text-text hover:bg-bg'
                }`}
              >
                Trending
              </Link>
              <Link 
                to="/tutorials" 
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  location.pathname === '/tutorials' 
                    ? 'text-primary bg-primary/5' 
                    : 'text-text-secondary hover:text-text hover:bg-bg'
                }`}
              >
                Tutorials
              </Link>
              <Link 
                to="/videos" 
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  location.pathname === '/videos' 
                    ? 'text-primary bg-primary/5' 
                    : 'text-text-secondary hover:text-text hover:bg-bg'
                }`}
              >
                Videos
              </Link>
            </nav>
          </div>

          {/* CENTER: Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, tutorials, videos..."
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-full text-sm text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow shadow-sm hover:shadow-md"
              />
            </form>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search Toggle (Mobile) */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="md:hidden p-2 text-text-secondary hover:text-text rounded-xl hover:bg-bg transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Bookmarks */}
            <Link 
              to="/bookmarks" 
              className={`p-2 text-text-secondary hover:text-text rounded-xl hover:bg-bg transition-all hidden sm:flex ${
                location.pathname === '/bookmarks' ? 'text-primary bg-primary/5' : ''
              }`}
              title="Bookmarks"
            >
              <Bookmark className="w-4.5 h-4.5" />
            </Link>

            {/* Notifications */}
            <div className="hidden sm:block">
              <NotificationBell />
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 text-text-secondary hover:text-text rounded-xl hover:bg-bg transition-all"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* User Profile / Admin Link / Login */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-border bg-bg hover:border-primary/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary pr-1" />
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-56 bg-card rounded-2xl shadow-xl border border-border py-1.5 z-50 transition transform duration-150 ease-out">
                      <div className="px-4 py-2 border-b border-border">
                        <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Signed in as</div>
                        <div className="text-xs font-bold text-text truncate mt-0.5">{user.email}</div>
                      </div>
                      <div className="p-1 space-y-0.5">
                        {isAdmin && (
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text hover:bg-bg rounded-xl transition-all"
                          >
                            <FileText className="w-4 h-4 text-text-secondary" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link 
                          to="/bookmarks" 
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text hover:bg-bg rounded-xl transition-all"
                        >
                          <Bookmark className="w-4 h-4 text-text-secondary" />
                          My Bookmarks
                        </Link>
                        <Link 
                          to="/about" 
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text hover:bg-bg rounded-xl transition-all"
                        >
                          <Info className="w-4 h-4 text-text-secondary" />
                          About Us
                        </Link>
                        <Link 
                          to="/contact" 
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text hover:bg-bg rounded-xl transition-all"
                        >
                          <Mail className="w-4 h-4 text-text-secondary" />
                          Contact Support
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-[#1d4ed8] rounded-full shadow-xs hover:shadow-md transition-all duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-text-secondary hover:text-text rounded-xl hover:bg-bg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 transition transform duration-150 ease-out">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles, tutorials, videos..."
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-xs text-text placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Side Drawer Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 top-16 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          {/* Drawer */}
          <div className="fixed top-16 right-0 bottom-0 w-80 bg-card border-l border-border z-40 lg:hidden p-6 overflow-y-auto transition-transform duration-250 ease-out">
            <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Navigation</h3>
                  <nav className="flex flex-col gap-2">
                    {[
                      { to: '/', label: 'Home' },
                      { to: '/categories', label: 'Explore Categories' },
                      { to: '/trending', label: 'Trending Stories' },
                      { to: '/tutorials', label: 'Tutorials' },
                      { to: '/videos', label: 'Videos' },
                      { to: '/bookmarks', label: 'Saved Bookmarks' },
                      { to: '/about', label: 'About Gridaan' },
                      { to: '/contact', label: 'Contact Us' },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`px-4 py-3 text-xs font-semibold rounded-xl hover:bg-bg transition-colors ${
                          location.pathname === item.to ? 'text-primary bg-primary/5' : 'text-text'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-border pt-6">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text truncate">{user.email}</div>
                          <div className="text-[10px] text-text-secondary">Verified Member</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isAdmin && (
                          <Link 
                            to="/dashboard" 
                            className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-text bg-bg border border-border rounded-xl hover:bg-border transition-all"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-white bg-primary hover:bg-[#1d4ed8] rounded-xl shadow-xs transition-all"
                    >
                      Sign In to Gridaan
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
    </header>
  );
}
