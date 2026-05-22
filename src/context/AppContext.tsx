import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, Category, User, Notification, AdPlacement, SiteSettings, MediaFile, Comment } from '../types';
import { articles as initialArticles, categories as initialCategories } from '../data/mockData';
import toast from 'react-hot-toast';

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Articles
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'slug' | 'views' | 'likes' | 'comments'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'count'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Comments
  addComment: (articleId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  deleteComment: (articleId: string, commentId: string) => void;
  approveComment: (articleId: string, commentId: string) => void;
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Authentication
  isAdmin: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
  
  // Ads
  adPlacements: AdPlacement[];
  toggleAdPlacement: (id: string) => void;
  updateAdPlacement: (id: string, updates: Partial<AdPlacement>) => void;
  
  // Settings
  siteSettings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  
  // Media
  mediaFiles: MediaFile[];
  addMediaFile: (file: Omit<MediaFile, 'id' | 'uploadedAt'>) => void;
  deleteMediaFile: (id: string) => void;
  
  // Bookmarks
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  
  // Newsletter
  newsletterEmail: string;
  setNewsletterEmail: (e: string) => void;
  subscribed: boolean;
  subscribe: (email: string) => void;
  subscribers: string[];
}

const AppContext = createContext<AppState | undefined>(undefined);

// Initial data
const hashPassword = (password: string) => `b64:${btoa(password)}`;
const verifyPassword = (stored: string, password: string) => stored.startsWith('b64:') ? stored === hashPassword(password) : stored === password;
const normalizePassword = (password: string) => hashPassword(password);

const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@gridaan.com', password: 'b64:YWRtaW4xMjM=', role: 'admin', status: 'active', avatar: '', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@gridaan.com', password: 'b64:ZWRpdG9yMTIz', role: 'editor', status: 'active', avatar: '', createdAt: '2024-02-15T00:00:00Z' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@gridaan.com', password: 'b64:d3JpdGVyMTIz', role: 'writer', status: 'active', avatar: '', createdAt: '2024-03-20T00:00:00Z' },
  { id: '4', name: 'Elena Rodriguez', email: 'elena@gridaan.com', password: 'b64:d3JpdGVyMTIz', role: 'writer', status: 'active', avatar: '', createdAt: '2024-04-10T00:00:00Z' },
  { id: '5', name: 'Alex Turner', email: 'alex@example.com', password: 'b64:dXNlcjEyMw==', role: 'subscriber', status: 'active', avatar: '', createdAt: '2024-05-05T00:00:00Z' },
];

const initialAdPlacements: AdPlacement[] = [
  { id: '1', name: 'Header Banner', position: 'header', format: '728x90', enabled: true, impressions: 125000, clicks: 3200, revenue: 340 },
  { id: '2', name: 'Sidebar Ad', position: 'sidebar', format: '300x250', enabled: true, impressions: 98000, clicks: 2100, revenue: 280 },
  { id: '3', name: 'In-Article Ad', position: 'in-article', format: 'Responsive', enabled: true, impressions: 156000, clicks: 4500, revenue: 420 },
  { id: '4', name: 'Footer Banner', position: 'footer', format: '728x90', enabled: false, impressions: 45000, clicks: 890, revenue: 95 },
  { id: '5', name: 'Mobile Sticky', position: 'sticky-mobile', format: '320x50', enabled: true, impressions: 210000, clicks: 6800, revenue: 510 },
];

const initialMediaFiles: MediaFile[] = [
  { id: '1', name: 'hero-ai-robot.jpg', url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', type: 'image', size: '245 KB', uploadedAt: '2025-12-15T10:00:00Z' },
  { id: '2', name: 'developer-workspace.jpg', url: 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', type: 'image', size: '312 KB', uploadedAt: '2025-12-14T09:00:00Z' },
  { id: '3', name: 'coding-laptop.jpg', url: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', type: 'image', size: '198 KB', uploadedAt: '2025-12-13T08:00:00Z' },
  { id: '4', name: 'tech-meeting.jpg', url: 'https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', type: 'image', size: '287 KB', uploadedAt: '2025-12-12T07:00:00Z' },
  { id: '5', name: 'modern-office.jpg', url: 'https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', type: 'image', size: '234 KB', uploadedAt: '2025-12-11T06:00:00Z' },
  { id: '6', name: 'workspace-setup.jpg', url: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', type: 'image', size: '276 KB', uploadedAt: '2025-12-10T05:00:00Z' },
];

const initialSettings: SiteSettings = {
  siteName: 'Gridaan',
  tagline: 'Premium Digital Publishing Platform',
  logo: '/images/gridaan-logo.svg',
  primaryColor: '#6366f1',
  adsEnabled: true,
  adsensePublisherId: '',
  analyticsId: '',
  metaDescription: 'Gridaan - Your premium source for technology news, tutorials, and digital content.',
  socialLinks: {
    twitter: 'https://twitter.com/gridaan',
    github: 'https://github.com/gridaan',
    linkedin: 'https://linkedin.com/company/gridaan',
  },
  emailSettings: {
    contactEmail: 'hello@gridaan.com',
    adsEmail: 'ads@gridaan.com',
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const getSavedLocalStorage = (newKey: string, oldKey: string) => {
    const value = localStorage.getItem(newKey);
    if (value !== null) return value;
    const legacy = localStorage.getItem(oldKey);
    if (legacy !== null) {
      localStorage.setItem(newKey, legacy);
      localStorage.removeItem(oldKey);
      return legacy;
    }
    return null;
  };

  // Load from localStorage or use defaults
  const [darkMode, setDarkMode] = useState(() => {
    const saved = getSavedLocalStorage('gridaan_darkMode', 'nexus_darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = getSavedLocalStorage('gridaan_articles', 'nexus_articles');
    return saved ? JSON.parse(saved) : initialArticles;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = getSavedLocalStorage('gridaan_categories', 'nexus_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = getSavedLocalStorage('gridaan_users', 'nexus_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = getSavedLocalStorage('gridaan_currentUser', 'nexus_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = getSavedLocalStorage('gridaan_notifications', 'nexus_notifications');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'info', title: 'Welcome to Gridaan!', message: 'Your admin dashboard is ready.', createdAt: new Date().toISOString(), read: false },
      { id: '2', type: 'success', title: 'New subscriber', message: 'alex@example.com just subscribed to newsletter.', createdAt: new Date().toISOString(), read: false },
    ];
  });
  
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>(() => {
    const saved = getSavedLocalStorage('gridaan_adPlacements', 'nexus_adPlacements');
    return saved ? JSON.parse(saved) : initialAdPlacements;
  });
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = getSavedLocalStorage('gridaan_settings', 'nexus_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => {
    const saved = getSavedLocalStorage('gridaan_media', 'nexus_media');
    return saved ? JSON.parse(saved) : initialMediaFiles;
  });
  
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = getSavedLocalStorage('gridaan_bookmarks', 'nexus_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [subscribers, setSubscribers] = useState<string[]>(() => {
    const saved = getSavedLocalStorage('gridaan_subscribers', 'nexus_subscribers');
    return saved ? JSON.parse(saved) : ['alex@example.com', 'priya@example.com'];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('gridaan_darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  
  useEffect(() => { localStorage.setItem('gridaan_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('gridaan_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('gridaan_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gridaan_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('gridaan_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('gridaan_adPlacements', JSON.stringify(adPlacements)); }, [adPlacements]);
  useEffect(() => { localStorage.setItem('gridaan_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('gridaan_media', JSON.stringify(mediaFiles)); }, [mediaFiles]);
  useEffect(() => { localStorage.setItem('gridaan_bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem('gridaan_subscribers', JSON.stringify(subscribers)); }, [subscribers]);

  // Helper functions
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Theme
  const toggleDarkMode = () => setDarkMode((prev: boolean) => !prev);

  // Articles CRUD
  const addArticle = (article: Omit<Article, 'id' | 'slug' | 'views' | 'likes' | 'comments'>) => {
    const newArticle: Article = {
      ...article,
      id: generateId(),
      slug: generateSlug(article.title),
      views: 0,
      likes: 0,
      comments: [],
    };
    setArticles(prev => [newArticle, ...prev]);
    addNotification({ type: 'success', title: 'Article Created', message: `"${article.title}" has been created.` });
    toast.success('Article created successfully!');
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates, slug: updates.title ? generateSlug(updates.title) : a.slug } : a));
    toast.success('Article updated successfully!');
  };

  const deleteArticle = (id: string) => {
    const article = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    if (article) {
      addNotification({ type: 'warning', title: 'Article Deleted', message: `"${article.title}" has been deleted.` });
      toast.success('Article deleted successfully!');
    }
  };

  // Categories CRUD
  const addCategory = (category: Omit<Category, 'id' | 'count'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      count: 0,
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success('Category created successfully!');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Category updated successfully!');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted successfully!');
  };

  // Comments
  const addComment = (articleId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...comment,
      id: generateId(),
      createdAt: new Date().toISOString(),
      likes: 0,
      approved: false,
    };
    setArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, comments: [...a.comments, newComment] } : a
    ));
    addNotification({ type: 'info', title: 'New Comment', message: `${comment.author} commented on an article.` });
    toast.success('Comment posted! Awaiting approval.');
  };

  const deleteComment = (articleId: string, commentId: string) => {
    setArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, comments: a.comments.filter(c => c.id !== commentId) } : a
    ));
    toast.success('Comment deleted!');
  };

  const approveComment = (articleId: string, commentId: string) => {
    setArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, comments: a.comments.map(c => c.id === commentId ? { ...c, approved: true } : c) } : a
    ));
    toast.success('Comment approved!');
  };

  // Users CRUD
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      toast.error('User with this email already exists!');
      return;
    }
    const newUser: User = {
      ...user,
      password: normalizePassword(user.password),
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    addNotification({ type: 'success', title: 'User Created', message: `${user.name} has been added.` });
    toast.success('User created successfully!');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updated = { ...updates };
    if (updates.password) {
      updated.password = normalizePassword(updates.password);
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    toast.success('User updated successfully!');
  };

  const deleteUser = (id: string) => {
    if (currentUser?.id === id) {
      toast.error('Cannot delete your own account!');
      return;
    }
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user) {
      addNotification({ type: 'warning', title: 'User Deleted', message: `${user.name} has been removed.` });
      toast.success('User deleted successfully!');
    }
  };

  // Authentication
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && verifyPassword(u.password, password));
    if (user) {
      if (user.status === 'inactive') {
        toast.error('Account is inactive. Contact administrator.');
        return false;
      }
      if (user.role !== 'admin' && user.role !== 'editor') {
        toast.error('Access denied. Admin or Editor role required.');
        return false;
      }
      setCurrentUser(user);
      addNotification({ type: 'success', title: 'Welcome back!', message: `Logged in as ${user.name}` });
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    }
    toast.error('Invalid email or password!');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success('Logged out successfully!');
  };

  // Notifications
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared!');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Ads
  const toggleAdPlacement = (id: string) => {
    setAdPlacements(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    const ad = adPlacements.find(a => a.id === id);
    if (ad) {
      toast.success(`${ad.name} ${ad.enabled ? 'disabled' : 'enabled'}!`);
    }
  };

  const updateAdPlacement = (id: string, updates: Partial<AdPlacement>) => {
    setAdPlacements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  // Settings
  const updateSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
    toast.success('Settings saved successfully!');
  };

  // Media
  const addMediaFile = (file: Omit<MediaFile, 'id' | 'uploadedAt'>) => {
    const newFile: MediaFile = {
      ...file,
      id: generateId(),
      uploadedAt: new Date().toISOString(),
    };
    setMediaFiles(prev => [newFile, ...prev]);
    toast.success('File uploaded successfully!');
  };

  const deleteMediaFile = (id: string) => {
    setMediaFiles(prev => prev.filter(f => f.id !== id));
    toast.success('File deleted successfully!');
  };

  // Bookmarks
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      if (prev.includes(id)) {
        toast.success('Removed from bookmarks');
        return prev.filter(b => b !== id);
      } else {
        toast.success('Added to bookmarks');
        return [...prev, id];
      }
    });
  };

  // Newsletter
  const subscribe = (email: string) => {
    if (subscribers.includes(email)) {
      toast.error('Already subscribed!');
      return;
    }
    setSubscribers(prev => [...prev, email]);
    setSubscribed(true);
    setNewsletterEmail('');
    addNotification({ type: 'success', title: 'New Subscriber', message: `${email} subscribed to newsletter.` });
    toast.success('Successfully subscribed!');
  };

  const isAdmin = currentUser !== null && (currentUser.role === 'admin' || currentUser.role === 'editor');

  return (
    <AppContext.Provider value={{
      darkMode, toggleDarkMode,
      articles, addArticle, updateArticle, deleteArticle,
      categories, addCategory, updateCategory, deleteCategory,
      addComment, deleteComment, approveComment,
      users, addUser, updateUser, deleteUser,
      isAdmin, currentUser, login, logout,
      notifications, addNotification, markNotificationRead, clearNotifications, unreadCount,
      adPlacements, toggleAdPlacement, updateAdPlacement,
      siteSettings, updateSettings,
      mediaFiles, addMediaFile, deleteMediaFile,
      bookmarks, toggleBookmark,
      searchQuery, setSearchQuery,
      mobileMenuOpen, setMobileMenuOpen,
      newsletterEmail, setNewsletterEmail, subscribed, subscribe, subscribers
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
