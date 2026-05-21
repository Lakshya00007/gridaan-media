import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Image, FolderOpen, MessageSquare, Users,
  Settings, BarChart3, DollarSign, Eye, TrendingUp, ArrowUp, ArrowDown,
  Plus, Edit, Trash2, Search, Globe, Lock,
  Bell, LogOut, Menu, X, ChevronRight, Check,
  AlertCircle, Info, CheckCircle, XCircle, Save, Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Article, Category, User, MediaFile } from '../../types';

type Tab = 'dashboard' | 'articles' | 'create' | 'media' | 'categories' | 'comments' | 'users' | 'ads' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const { 
    articles, addArticle, updateArticle, deleteArticle,
    categories, addCategory, updateCategory, deleteCategory,
    users, addUser, updateUser, deleteUser,
    isAdmin, currentUser, login, logout,
    notifications, markNotificationRead, clearNotifications, unreadCount,
    adPlacements, toggleAdPlacement,
    siteSettings, updateSettings,
    mediaFiles, addMediaFile, deleteMediaFile,
    darkMode, toggleDarkMode, approveComment, deleteComment, subscribers
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClick = () => setShowNotifications(false);
    if (showNotifications) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showNotifications]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please enter email and password');
      return;
    }
    
    const success = login(loginForm.email, loginForm.password);
    if (!success) {
      setLoginError('Invalid credentials or insufficient permissions');
    }
  };

  // Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to access the dashboard</p>
            </div>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={loginForm.email} 
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={loginForm.password} 
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} 
                  placeholder="Enter your password" 
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const sidebarItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'create', label: 'Create Article', icon: Plus },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'ads', label: 'Ad Management', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">NexusAdmin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-180px)]">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
            <Globe className="w-4 h-4" /> View Site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {activeTab === 'create' ? 'Create Article' : activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }} 
                className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div onClick={e => e.stopPropagation()} className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="text-xs text-red-500 hover:text-red-600">
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.slice(0, 10).map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                      >
                        <div className="flex gap-3">
                          {getNotificationIcon(n.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-gray-500 truncate">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5" />}
                        </div>
                      </div>
                    )) : (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.name}</span>
                <p className="text-[10px] text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {activeTab === 'dashboard' && <DashboardContent articles={articles} subscribers={subscribers} adPlacements={adPlacements} />}
          {activeTab === 'articles' && <ArticlesContent articles={articles} deleteArticle={deleteArticle} updateArticle={updateArticle} setActiveTab={setActiveTab} />}
          {activeTab === 'create' && <CreateArticleContent categories={categories} addArticle={addArticle} />}
          {activeTab === 'media' && <MediaContent mediaFiles={mediaFiles} addMediaFile={addMediaFile} deleteMediaFile={deleteMediaFile} />}
          {activeTab === 'categories' && <CategoriesContent categories={categories} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />}
          {activeTab === 'comments' && <CommentsContent articles={articles} approveComment={approveComment} deleteComment={deleteComment} />}
          {activeTab === 'users' && <UsersContent users={users} currentUser={currentUser} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} />}
          {activeTab === 'ads' && <AdsContent adPlacements={adPlacements} toggleAdPlacement={toggleAdPlacement} />}
          {activeTab === 'analytics' && <AnalyticsContent articles={articles} subscribers={subscribers} />}
          {activeTab === 'settings' && <SettingsContent settings={siteSettings} updateSettings={updateSettings} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        </main>
      </div>
    </div>
  );
}

// ===================== DASHBOARD =====================
function DashboardContent({ articles, subscribers, adPlacements }: { articles: Article[]; subscribers: string[]; adPlacements: any[] }) {
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalRevenue = adPlacements.reduce((sum, a) => sum + a.revenue, 0);
  
  const viewsChart = [
    { date: 'Mon', views: 4200 + Math.floor(Math.random() * 1000) },
    { date: 'Tue', views: 5800 + Math.floor(Math.random() * 1000) },
    { date: 'Wed', views: 6100 + Math.floor(Math.random() * 1000) },
    { date: 'Thu', views: 5400 + Math.floor(Math.random() * 1000) },
    { date: 'Fri', views: 7200 + Math.floor(Math.random() * 1000) },
    { date: 'Sat', views: 8900 + Math.floor(Math.random() * 1000) },
    { date: 'Sun', views: 7600 + Math.floor(Math.random() * 1000) },
  ];

  const stats = [
    { label: 'Total Views', value: (totalViews / 1000).toFixed(1) + 'K', change: '+12.5%', up: true, icon: Eye, color: 'bg-blue-500' },
    { label: 'Total Articles', value: articles.length.toString(), change: '+' + articles.filter(a => new Date(a.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, up: true, icon: FileText, color: 'bg-green-500' },
    { label: 'Subscribers', value: subscribers.length.toString(), change: '+2.3%', up: true, icon: Users, color: 'bg-purple-500' },
    { label: 'Revenue', value: '$' + totalRevenue.toLocaleString(), change: '+18.2%', up: true, icon: DollarSign, color: 'bg-orange-500' },
  ];

  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Views This Week</h3>
          <div className="flex items-end gap-2 h-48">
            {viewsChart.map((item, i) => {
              const maxViews = Math.max(...viewsChart.map(d => d.views));
              const height = (item.views / maxViews) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-gray-500">{(item.views / 1000).toFixed(1)}K</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all hover:from-indigo-600 hover:to-purple-600 cursor-pointer" style={{ height: `${height}%` }} />
                  <span className="text-[10px] text-gray-500">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Articles</h3>
          <div className="space-y-3">
            {topArticles.map((article, i) => (
              <div key={article.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-300 w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{article.title}</p>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-1.5" style={{ width: `${(article.views / topArticles[0].views) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{(article.views / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue & Traffic */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
          {[
            { source: 'Google Search', percentage: 45 },
            { source: 'Direct', percentage: 22 },
            { source: 'Social Media', percentage: 18 },
            { source: 'Referral', percentage: 10 },
            { source: 'Email', percentage: 5 },
          ].map(source => (
            <div key={source.source} className="flex items-center gap-3 py-2">
              <span className="text-sm text-gray-700 dark:text-gray-300 w-28 shrink-0">{source.source}</span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-2 transition-all" style={{ width: `${source.percentage}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">{source.percentage}%</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Revenue by Source</h3>
          {adPlacements.map(ad => (
            <div key={ad.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.name}</p>
                <p className="text-xs text-gray-500">{ad.impressions.toLocaleString()} impressions</p>
              </div>
              <span className="text-sm font-bold text-green-600">${ad.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== ARTICLES =====================
function ArticlesContent({ articles, deleteArticle, updateArticle, setActiveTab }: { articles: Article[]; deleteArticle: (id: string) => void; updateArticle: (id: string, updates: Partial<Article>) => void; setActiveTab: (tab: Tab) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (article: Article) => {
    updateArticle(article.id, { status: article.status === 'published' ? 'draft' : 'published' });
  };

  const toggleFeatured = (article: Article) => {
    updateArticle(article.id, { featured: !article.featured });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search articles..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button 
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Featured</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(article => (
                <tr key={article.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={article.featuredImage} alt="" className="w-12 h-12 rounded-lg object-cover hidden sm:block" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</p>
                        <p className="text-xs text-gray-500">{article.author.name} · {new Date(article.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">{article.category}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{(article.views / 1000).toFixed(1)}K</td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => toggleStatus(article)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        article.status === 'published' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200'
                      }`}
                    >
                      {article.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <button 
                      onClick={() => toggleFeatured(article)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        article.featured 
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Delete this article?')) deleteArticle(article.id); }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No articles found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== CREATE ARTICLE =====================
function CreateArticleContent({ categories, addArticle }: { categories: Category[]; addArticle: (article: any) => void }) {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    status: 'draft' as 'draft' | 'published',
    type: 'article' as Article['type'],
    featured: false,
    trending: false,
    seoTitle: '',
    seoDescription: ''
  });

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!form.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    const article = {
      title: form.title,
      excerpt: form.excerpt || form.content.slice(0, 150) + '...',
      content: form.content,
      category: form.category || categories[0]?.name || 'Technology',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featuredImage: form.featuredImage,
      status,
      type: form.type,
      featured: form.featured,
      trending: form.trending,
      author: { id: '1', name: 'Admin User', avatar: '', bio: '', role: 'Admin', social: {} },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readingTime: Math.max(1, Math.ceil(form.content.split(' ').length / 200)),
      seo: {
        metaTitle: form.seoTitle || form.title,
        metaDescription: form.seoDescription || form.excerpt,
        canonicalUrl: '',
        ogImage: form.featuredImage
      }
    };
    
    addArticle(article);
    
    // Reset form
    setForm({
      title: '', excerpt: '', content: '', category: '', tags: '',
      featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      status: 'draft', type: 'article', featured: false, trending: false, seoTitle: '', seoDescription: ''
    });
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Article Details</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              placeholder="Enter article title..." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" 
            />
            <p className="text-xs text-gray-500 mt-1">Slug: {form.title ? generateSlug(form.title) : 'auto-generated'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Excerpt</label>
            <textarea 
              value={form.excerpt} 
              onChange={e => setForm({ ...form, excerpt: e.target.value })} 
              rows={2} 
              placeholder="Brief description..." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600 resize-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Content (Markdown supported)</label>
            <textarea 
              value={form.content} 
              onChange={e => setForm({ ...form, content: e.target.value })} 
              rows={15} 
              placeholder="Write your article content here... Supports Markdown formatting." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono border border-gray-200 dark:border-gray-600 resize-y" 
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })} 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
              <select 
                value={form.type} 
                onChange={e => setForm({ ...form, type: e.target.value as Article['type'] })} 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600"
              >
                <option value="article">Article</option>
                <option value="tutorial">Tutorial</option>
                <option value="news">News</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
            <input 
              type="text" 
              value={form.tags} 
              onChange={e => setForm({ ...form, tags: e.target.value })} 
              placeholder="React, JavaScript, Tutorial" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Featured Image URL</label>
            <input 
              type="url" 
              value={form.featuredImage} 
              onChange={e => setForm({ ...form, featuredImage: e.target.value })} 
              placeholder="https://..." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" 
            />
            {form.featuredImage && (
              <img src={form.featuredImage} alt="Preview" className="mt-3 rounded-xl max-h-40 object-cover" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.featured} 
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.trending} 
                onChange={e => setForm({ ...form, trending: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Trending</span>
            </label>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-500" /> SEO Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Title</label>
            <input 
              type="text" 
              value={form.seoTitle} 
              onChange={e => setForm({ ...form, seoTitle: e.target.value })} 
              placeholder="SEO optimized title..." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" 
            />
            <p className="text-xs text-gray-500 mt-1">{(form.seoTitle || form.title).length}/60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Description</label>
            <textarea 
              value={form.seoDescription} 
              onChange={e => setForm({ ...form, seoDescription: e.target.value })} 
              rows={2} 
              placeholder="SEO meta description..." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600 resize-none" 
            />
            <p className="text-xs text-gray-500 mt-1">{(form.seoDescription || form.excerpt).length}/160 characters</p>
          </div>
          {/* Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 mb-2">Google Search Preview:</p>
            <p className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">{form.seoTitle || form.title || 'Article Title'} - Gridaan</p>
            <p className="text-green-700 text-xs">gridaan.com/article/{form.title ? generateSlug(form.title).slice(0, 30) : 'article-slug'}</p>
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{form.seoDescription || form.excerpt || 'Article description will appear here...'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => handleSubmit('draft')}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Save className="w-4 h-4" /> Save as Draft
        </button>
        <button 
          onClick={() => handleSubmit('published')}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" /> Publish Now
        </button>
      </div>
    </div>
  );
}

// ===================== MEDIA LIBRARY =====================
function MediaContent({ mediaFiles, addMediaFile, deleteMediaFile }: { mediaFiles: MediaFile[]; addMediaFile: (file: any) => void; deleteMediaFile: (id: string) => void }) {
  const [showUpload, setShowUpload] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  const handleUpload = () => {
    if (!newUrl.trim()) return;
    addMediaFile({
      name: newName || 'image-' + Date.now() + '.jpg',
      url: newUrl,
      type: 'image',
      size: Math.floor(Math.random() * 500) + 100 + ' KB'
    });
    setNewUrl('');
    setNewName('');
    setShowUpload(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{mediaFiles.length} files</p>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>
      
      {showUpload && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 space-y-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="File name (optional)"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600"
          />
          <input
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="Image URL (https://...)"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600"
          />
          <div className="flex gap-2">
            <button onClick={handleUpload} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add</button>
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaFiles.map(file => (
          <div key={file.id} className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <img src={file.url} alt={file.name} className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => navigator.clipboard.writeText(file.url)}
                className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 text-xs"
              >
                Copy URL
              </button>
              <button 
                onClick={() => { if(confirm('Delete this file?')) deleteMediaFile(file.id); }}
                className="p-2 bg-white rounded-lg text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">{file.name}</p>
              <p className="text-[10px] text-gray-500">{file.size} · {new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== CATEGORIES =====================
function CategoriesContent({ categories, addCategory, updateCategory, deleteCategory }: { categories: Category[]; addCategory: (cat: any) => void; updateCategory: (id: string, updates: any) => void; deleteCategory: (id: string) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '📁', color: '#6366f1' });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addCategory({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      icon: form.icon,
      color: form.color
    });
    setForm({ name: '', slug: '', description: '', icon: '📁', color: '#6366f1' });
    setShowAdd(false);
  };

  const handleUpdate = () => {
    if (!editingId || !form.name.trim()) return;
    updateCategory(editingId, {
      name: form.name,
      slug: form.slug,
      description: form.description,
      icon: form.icon,
      color: form.color
    });
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', icon: '📁', color: '#6366f1' });
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, color: cat.color });
    setShowAdd(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories.length} categories</p>
        <button 
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); setForm({ name: '', slug: '', description: '', icon: '📁', color: '#6366f1' }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      
      {showAdd && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="Category name" className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
            <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Icon emoji" className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          </div>
          <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          <div className="flex items-center gap-3">
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer" />
            <span className="text-sm text-gray-500">Color: {form.color}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={editingId ? handleUpdate : handleAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button onClick={() => { setShowAdd(false); setEditingId(null); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{cat.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.count} articles · /{cat.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
              <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => { if(confirm('Delete category?')) deleteCategory(cat.id); }} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== COMMENTS =====================
function CommentsContent({ articles, approveComment, deleteComment }: { articles: Article[]; approveComment: (articleId: string, commentId: string) => void; deleteComment: (articleId: string, commentId: string) => void }) {
  const allComments = articles.flatMap(a => a.comments.map(c => ({ ...c, articleId: a.id, articleTitle: a.title })));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{allComments.length} comments</p>
      {allComments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No comments yet</div>
      ) : (
        <div className="space-y-3">
          {allComments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      {!comment.approved && <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] rounded-full">Pending</span>}
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1.5">on: {comment.articleTitle}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!comment.approved && (
                    <button 
                      onClick={() => approveComment(comment.articleId, comment.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  <button 
                    onClick={() => { if(confirm('Delete comment?')) deleteComment(comment.articleId, comment.id); }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===================== USERS =====================
function UsersContent({ users, currentUser, addUser, updateUser, deleteUser }: { users: User[]; currentUser: User | null; addUser: (user: any) => void; updateUser: (id: string, updates: any) => void; deleteUser: (id: string) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'subscriber' as User['role'], status: 'active' as User['status'] });

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert('Please fill all required fields');
      return;
    }
    addUser({ ...form, avatar: '' });
    setForm({ name: '', email: '', password: '', role: 'subscriber', status: 'active' });
    setShowAdd(false);
  };

  const toggleStatus = (user: User) => {
    updateUser(user.id, { status: user.status === 'active' ? 'inactive' : 'active' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{users.length} users</p>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>
      
      {showAdd && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name *" className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password *" className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm dark:text-white border border-gray-200 dark:border-gray-600">
              <option value="subscriber">Subscriber</option>
              <option value="writer">Writer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as User['status'] })} className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm dark:text-white border border-gray-200 dark:border-gray-600">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add User</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">{user.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                    user.role === 'editor' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    user.role === 'writer' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>{user.role}</span>
                </td>
                <td className="px-5 py-4">
                  <button 
                    onClick={() => toggleStatus(user)}
                    disabled={user.id === currentUser?.id}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    } ${user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                  >
                    {user.status}
                  </button>
                </td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={() => { if(user.id !== currentUser?.id && confirm('Delete user?')) deleteUser(user.id); }}
                    disabled={user.id === currentUser?.id}
                    className={`p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${user.id === currentUser?.id ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===================== ADS MANAGEMENT =====================
function AdsContent({ adPlacements, toggleAdPlacement }: { adPlacements: any[]; toggleAdPlacement: (id: string) => void }) {
  const totalRevenue = adPlacements.reduce((sum, a) => sum + a.revenue, 0);
  const totalImpressions = adPlacements.reduce((sum, a) => sum + a.impressions, 0);
  const totalClicks = adPlacements.reduce((sum, a) => sum + a.clicks, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-1">Google AdSense Dashboard</h3>
        <p className="text-green-100 text-sm mb-4">Manage your ad placements and monitor performance</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-green-200">Total Revenue (MTD)</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(0)}K</div>
            <div className="text-xs text-green-200">Impressions</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">{((totalClicks / totalImpressions) * 100).toFixed(2)}%</div>
            <div className="text-xs text-green-200">CTR Average</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Ad Placements</h3>
        </div>
        {adPlacements.map(ad => (
          <div key={ad.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.name}</p>
              <p className="text-xs text-gray-500">{ad.position} · {ad.format}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-xs text-gray-500">{ad.impressions.toLocaleString()} imp · {ad.clicks.toLocaleString()} clicks</p>
                <p className="text-sm font-medium text-green-600">${ad.revenue}</p>
              </div>
              <button
                onClick={() => toggleAdPlacement(ad.id)}
                className={`relative w-12 h-6 rounded-full transition-colors ${ad.enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${ad.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== ANALYTICS =====================
function AnalyticsContent({ articles, subscribers }: { articles: Article[]; subscribers: string[] }) {
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalComments = articles.reduce((sum, a) => sum + a.comments.length, 0);
  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  
  const viewsChart = [
    { date: 'Mon', views: 4200 },
    { date: 'Tue', views: 5800 },
    { date: 'Wed', views: 6100 },
    { date: 'Thu', views: 5400 },
    { date: 'Fri', views: 7200 },
    { date: 'Sat', views: 8900 },
    { date: 'Sun', views: 7600 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Page Views', value: (totalViews / 1000).toFixed(1) + 'K', icon: Eye },
          { label: 'Unique Visitors', value: Math.floor(totalViews / 2.2 / 1000) + 'K', icon: Users },
          { label: 'Comments', value: totalComments.toString(), icon: MessageSquare },
          { label: 'Subscribers', value: subscribers.length.toString(), icon: Users },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
            <stat.icon className="w-5 h-5 text-indigo-500 mb-2" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Traffic Overview</h3>
        <div className="flex items-end gap-3 h-64">
          {viewsChart.map((item, i) => {
            const maxViews = Math.max(...viewsChart.map(d => d.views));
            const height = (item.views / maxViews) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{(item.views / 1000).toFixed(1)}K</span>
                <div className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500 to-purple-500 transition-all hover:opacity-80 cursor-pointer" style={{ height: `${height}%` }} />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Performing Content</h3>
          {topArticles.map((article, i) => (
            <div key={article.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="text-sm font-bold text-indigo-500 w-6">#{i + 1}</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{article.title}</p>
              <span className="text-xs font-medium text-gray-500">{(article.views / 1000).toFixed(1)}K views</span>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
          {[
            { source: 'Google Search', percentage: 45 },
            { source: 'Direct', percentage: 22 },
            { source: 'Social Media', percentage: 18 },
            { source: 'Referral', percentage: 10 },
            { source: 'Email', percentage: 5 },
          ].map(source => (
            <div key={source.source} className="flex items-center gap-3 py-2.5">
              <span className="text-sm text-gray-700 dark:text-gray-300 w-28 shrink-0">{source.source}</span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-2.5" style={{ width: `${source.percentage}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">{source.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== SETTINGS =====================
function SettingsContent({ settings, updateSettings, darkMode, toggleDarkMode }: { settings: any; updateSettings: (s: any) => void; darkMode: boolean; toggleDarkMode: () => void }) {
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    updateSettings(form);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* General */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Site Name</label>
            <input type="text" value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tagline</label>
            <input type="text" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-500">Toggle dark theme</p>
            </div>
            <button 
              onClick={toggleDarkMode} 
              className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* AdSense */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Google AdSense</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Publisher ID</label>
            <input type="text" value={form.adsensePublisherId} onChange={e => setForm({ ...form, adsensePublisherId: e.target.value })} placeholder="ca-pub-XXXXXXXXXXXXXXXX" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600 font-mono" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Enable Ads</p>
              <p className="text-xs text-gray-500">Show advertisements on the site</p>
            </div>
            <button
              onClick={() => setForm({ ...form, adsEnabled: !form.adsEnabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.adsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.adsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">SEO & Analytics</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Default Meta Description</label>
            <textarea rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Google Analytics ID</label>
            <input type="text" value={form.analyticsId} onChange={e => setForm({ ...form, analyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600 font-mono" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Email Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Email</label>
            <input type="email" value={form.emailSettings?.contactEmail || ''} onChange={e => setForm({ ...form, emailSettings: { ...form.emailSettings, contactEmail: e.target.value } })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Advertising Email</label>
            <input type="email" value={form.emailSettings?.adsEmail || ''} onChange={e => setForm({ ...form, emailSettings: { ...form.emailSettings, adsEmail: e.target.value } })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-gray-600" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
}
