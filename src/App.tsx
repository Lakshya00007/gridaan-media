import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackToTop from './components/ui/BackToTop';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import SearchPage from './pages/SearchPage';
import TrendingPage from './pages/TrendingPage';
import TutorialsPage from './pages/TutorialsPage';
import VideosPage from './pages/VideosPage';
import BookmarksPage from './pages/BookmarksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoginPage from './pages/admin/LoginPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <ScrollToTop />
        <AppLayout />
      </AppProvider>
    </Router>
  );
}
