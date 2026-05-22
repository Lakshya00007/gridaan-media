import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun, Bookmark, User, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GridaanLogo from './GridaanLogo';
import { categories } from '../../data/mockData';

export default function Header() {
  const { darkMode, toggleDarkMode, searchQuery, setSearchQuery, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1224]/80 dark:bg-[#060A16]/80 backdrop-blur-xl border-b border-[#1E293B]/50 dark:border-[#1E293B]/50 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-linear-to-r from-[#327CFA] via-[#1E3EC1] to-[#003CC6] text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="hidden sm:inline">🔥 Trending: AI & Machine Learning breakthroughs are reshaping 2026</span>
          <span className="sm:hidden">🔥 Trending in AI & ML</span>
          <div className="flex items-center gap-3">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/dashboard" className="hover:underline font-medium">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10 bg-[#0B1224]/0">
              <GridaanLogo className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-[#327CFA] to-[#003CC6] bg-clip-text text-transparent hidden sm:inline">
              Gridaan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#F8FAFC] hover:text-[#327CFA] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
              Home
            </Link>
            <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#F8FAFC] hover:text-[#327CFA] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 w-64 bg-[#0B1224] dark:bg-[#0B1224] rounded-xl shadow-2xl border border-[#1E293B] dark:border-[#1E293B] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.slice(0, 8).map(cat => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-colors">
                      <span className="text-lg">{cat.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-[#F8FAFC]">{cat.name}</div>
                        <div className="text-xs text-[#94A3B8]">{cat.count} articles</div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-[#1E293B] dark:border-[#1E293B] mt-1 pt-1">
                    <Link to="/categories" className="block px-4 py-2.5 text-sm text-[#327CFA] dark:text-[#94A3B8] font-medium hover:bg-[#0B1224] dark:hover:bg-[#0B1224]">
                      View all categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/trending" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#F8FAFC] hover:text-[#327CFA] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
              Trending
            </Link>
            <Link to="/tutorials" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#F8FAFC] hover:text-[#327CFA] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
              Tutorials
            </Link>
            <Link to="/videos" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#F8FAFC] hover:text-[#327CFA] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
              Videos
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-[#94A3B8] hover:text-[#327CFA] dark:text-[#94A3B8] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-[#94A3B8] hover:text-[#327CFA] dark:text-[#94A3B8] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all hidden sm:flex">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Bookmarks */}
            <Link to="/bookmarks" className="p-2 text-[#94A3B8] hover:text-[#327CFA] dark:text-[#94A3B8] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all hidden sm:flex">
              <Bookmark className="w-5 h-5" />
            </Link>

            {/* Dark mode */}
            <button onClick={toggleDarkMode} className="p-2 text-[#94A3B8] hover:text-[#327CFA] dark:text-[#94A3B8] dark:hover:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224] transition-all">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile */}
<Link to="/dashboard" className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 bg-linear-to-r from-[#327CFA] to-[#003CC6] text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-[#327CFA]/20 dark:hover:shadow-[#003CC6]/30 transition-all">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-[#94A3B8] hover:text-[#327CFA] dark:text-[#94A3B8] rounded-lg hover:bg-[#0B1224] dark:hover:bg-[#0B1224]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-[#1E293B] dark:border-[#1E293B] animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, tutorials, news..."
                className="w-full pl-12 pr-4 py-3 bg-[#0B1224] dark:bg-[#0B1224] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1E293B] dark:border-[#1E293B] bg-[#0B1224] dark:bg-[#0B1224] animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/categories', label: 'Categories' },
              { to: '/trending', label: 'Trending' },
              { to: '/tutorials', label: 'Tutorials' },
              { to: '/videos', label: 'Videos' },
              { to: '/bookmarks', label: 'Bookmarks' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/dashboard', label: 'Admin Dashboard' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-[#F8FAFC] hover:bg-[#0B1224] dark:hover:bg-[#0B1224] rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
