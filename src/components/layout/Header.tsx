import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun, Bookmark, User, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="hidden sm:inline">🔥 Trending: AI & Machine Learning breakthroughs are reshaping 2026</span>
          <span className="sm:hidden">🔥 Trending in AI & ML</span>
          <div className="flex items-center gap-3">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/admin" className="hover:underline font-medium">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              Gridaan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Home
            </Link>
            <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.slice(0, 8).map(cat => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <span className="text-lg">{cat.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</div>
                        <div className="text-xs text-gray-500">{cat.count} articles</div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <Link to="/categories" className="block px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                      View all categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/trending" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Trending
            </Link>
            <Link to="/tutorials" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Tutorials
            </Link>
            <Link to="/videos" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Videos
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hidden sm:flex">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Bookmarks */}
            <Link to="/bookmarks" className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hidden sm:flex">
              <Bookmark className="w-5 h-5" />
            </Link>

            {/* Dark mode */}
            <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile */}
            <Link to="/admin" className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, tutorials, news..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
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
              { to: '/admin', label: 'Admin Dashboard' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
