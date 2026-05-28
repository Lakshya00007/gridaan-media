import { useState, type FormEvent, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, ChevronDown, LogOut, FileText, Bookmark, Settings, User, BarChart2 } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import { useUI } from '../../context/UIContext'
import { useAuthUser } from '../../hooks/useAuthUser'
import { signOut } from '../../lib/auth'
import GridaanLogo from './GridaanLogo'
import { useCategories } from '../../hooks/useArticles'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/trending', label: 'Trending' },
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/videos', label: 'Videos' },
]

export default function Header() {
  const { searchQuery, setSearchQuery, mobileMenuOpen, setMobileMenuOpen } = useUI()
  const { user, isAdmin } = useAuthUser()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { data: categories = [] } = useCategories()
  const profileRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setProfileOpen(false)
    setCategoriesOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname, setMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node
      if (profileRef.current && !profileRef.current.contains(node)) setProfileOpen(false)
      if (categoriesRef.current && !categoriesRef.current.contains(node)) setCategoriesOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    setSearchOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6e6e6] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <GridaanLogo className="h-8 w-8" />
            <span className="hidden text-lg font-semibold tracking-tight text-[#1c1c1c] sm:inline">Gridaan</span>
          </Link>
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories"
              className="h-10 w-72 rounded-full border border-[#e6e6e6] bg-[#f8f8f7] pl-9 pr-4 text-sm text-[#242424] placeholder:text-[#8b8b8b] focus:border-[#2563eb] focus:outline-none"
            />
          </form>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-3 py-2 text-sm transition ${
                location.pathname === item.to
                  ? 'bg-[#f1f5ff] text-[#1d4ed8]'
                  : 'text-[#4b4b4b] hover:bg-[#f5f5f2] hover:text-[#1c1c1c]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-[#4b4b4b] hover:bg-[#f5f5f2] lg:hidden"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to={user ? (isAdmin ? '/dashboard' : '/bookmarks') : '/login'}
            className="hidden rounded-full border border-[#e6e6e6] bg-white px-4 py-2 text-sm font-medium text-[#242424] transition hover:bg-[#f8f8f7] sm:inline-flex"
          >
            Write
          </Link>

          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full border border-[#e6e6e6] bg-white p-1 pl-2"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="text-xs font-medium text-[#4b4b4b] hidden sm:inline">{user.email?.split('@')[0]}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
                <ChevronDown className="mr-1 h-4 w-4 text-[#6b6b6b]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-lg">
                  <div className="border-b border-[#efefef] px-4 py-3">
                    <p className="text-xs font-medium text-[#6b6b6b]">Signed in as</p>
                    <p className="mt-0.5 truncate text-sm font-medium text-[#1c1c1c]">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#242424] hover:bg-[#f5f5f2]"
                      aria-disabled
                      title="Coming soon"
                    >
                      <User className="h-4 w-4 text-[#6b6b6b]" />
                      Profile
                    </Link>
                  {isAdmin && (
                    <Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#242424] hover:bg-[#f5f5f2]">
                      <FileText className="h-4 w-4 text-[#6b6b6b]" />
                      Dashboard
                    </Link>
                  )}
                  <Link to="/bookmarks" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#242424] hover:bg-[#f5f5f2]">
                    <Bookmark className="h-4 w-4 text-[#6b6b6b]" />
                    Bookmarks
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#242424] hover:bg-[#f5f5f2]"
                    aria-disabled
                    title="Coming soon"
                  >
                    <BarChart2 className="h-4 w-4 text-[#6b6b6b]" />
                    Stats
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#242424] hover:bg-[#f5f5f2]"
                    aria-disabled
                    title="Coming soon"
                  >
                    <Settings className="h-4 w-4 text-[#6b6b6b]" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden rounded-full bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-white hover:bg-[#2c2c2c] sm:inline-flex">
              Sign in
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-[#4b4b4b] hover:bg-[#f5f5f2] md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#e6e6e6] bg-white px-4 py-3 lg:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories"
              className="h-10 w-full rounded-full border border-[#e6e6e6] bg-[#f8f8f7] pl-9 pr-4 text-sm text-[#242424] placeholder:text-[#8b8b8b] focus:border-[#2563eb] focus:outline-none"
              autoFocus
            />
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="border-t border-[#e6e6e6] bg-white px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-xl px-3 py-2.5 text-sm text-[#242424] hover:bg-[#f5f5f2]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[#e6e6e6] pt-4" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-[#242424] hover:bg-[#f5f5f2]"
            >
              Browse categories
              <ChevronDown className={`h-4 w-4 text-[#6b6b6b] transition ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            {categoriesOpen && (
              <div className="mt-2 grid grid-cols-2 gap-2 px-2">
                {categories.slice(0, 8).map((cat) => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} className="rounded-lg border border-[#e6e6e6] px-2 py-2 text-xs text-[#4b4b4b]">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
