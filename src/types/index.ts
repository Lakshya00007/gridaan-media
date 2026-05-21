export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  comments: Comment[];
  status: 'draft' | 'published' | 'scheduled';
  featured: boolean;
  trending: boolean;
  seo: SEOData;
  type: 'article' | 'video' | 'tutorial' | 'news' | 'gallery';
  videoUrl?: string;
  galleryImages?: string[];
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  approved?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
  color: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'writer' | 'subscriber';
  status: 'active' | 'inactive';
  avatar: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AdPlacement {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'in-article' | 'footer' | 'sticky-mobile';
  format: string;
  enabled: boolean;
  impressions: number;
  clicks: number;
  revenue: number;
  adCode?: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  totalComments: number;
  totalSubscribers: number;
  revenue: number;
  viewsChart: { date: string; views: number }[];
  topArticles: { title: string; views: number }[];
  trafficSources: { source: string; percentage: number }[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  adsEnabled: boolean;
  adsensePublisherId: string;
  analyticsId: string;
  metaDescription: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  emailSettings: {
    contactEmail: string;
    adsEmail: string;
  };
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  uploadedAt: string;
}
