import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect, lazy, Suspense, type ReactNode } from 'react';
import { UIProvider } from './context/UIContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackToTop from './components/ui/BackToTop';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationsFeed from './components/layout/NotificationsFeed';

// Route-based code splitting — all pages are lazily imported
const HomePage = lazy(() => import('./pages/HomePage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const TrendingPage = lazy(() => import('./pages/TrendingPage'))
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'))
const VideosPage = lazy(() => import('./pages/VideosPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'))
const TermsAndConditionsPage = lazy(() => import('./pages/legal/TermsAndConditionsPage'))
const DisclaimerPage = lazy(() => import('./pages/legal/DisclaimerPage'))
const CookiePolicyPage = lazy(() => import('./pages/legal/CookiePolicyPage'))
const LoginPage = lazy(() => import('./pages/admin/LoginPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  const routeFallback = (
    <div className="min-h-screen flex items-center justify-center bg-[#080d1a]">
      <div className="rounded-3xl bg-slate-100 dark:bg-[#0B1224] p-6 text-base font-medium text-slate-900 dark:text-slate-100 animate-pulse">
        Loading page…
      </div>
    </div>
  )
  const withBoundary = (children: ReactNode, title: string) => (
    <ErrorBoundary
      title={title}
      resetKey={`${location.pathname}${location.search}`}
    >
      {children}
    </ErrorBoundary>
  )

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-300">
      <NotificationsFeed />
      <Header />
      <main>
        <Suspense fallback={routeFallback}>
          <div key={location.pathname} className="transition-opacity duration-200 ease-out">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={withBoundary(<ArticlePage />, 'Article failed to load.')} />
            <Route path="/category/:slug" element={withBoundary(<CategoryPage />, 'Category failed to load.')} />
            <Route path="/categories" element={withBoundary(<CategoriesPage />, 'Categories failed to load.')} />
            <Route path="/search" element={withBoundary(<SearchPage />, 'Search failed to load.')} />
            <Route path="/trending" element={withBoundary(<TrendingPage />, 'Trending articles failed to load.')} />
            <Route path="/tutorials" element={withBoundary(<TutorialsPage />, 'Tutorials failed to load.')} />
            <Route path="/videos" element={withBoundary(<VideosPage />, 'Videos failed to load.')} />
            <Route path="/bookmarks" element={withBoundary(<BookmarksPage />, 'Bookmarks failed to load.')} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/login" element={withBoundary(<LoginPage />, 'Login failed to load.')} />
            <Route path="/dashboard" element={
              withBoundary(
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>,
                'Dashboard failed to load.'
              )
            } />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
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
      <h1 className="text-4xl font-bold text-[#F8FAFC] dark:text-white mb-4">404 - Page Not Found</h1>
      <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-8 text-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1D4ED8] transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <UIProvider>
        <ScrollToTop />
        <AppLayout />
      </UIProvider>
    </Router>
  );
}
