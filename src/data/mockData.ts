import { Article, Author, Category, AnalyticsData } from '../types';

export const authors: Author[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
    bio: 'Senior Tech Editor with 10+ years covering AI, cloud computing, and emerging technologies.',
    role: 'Senior Editor',
    social: { twitter: '@sarahchen', linkedin: 'sarahchen', github: 'sarahchen' }
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
    bio: 'Full-stack developer and tech writer specializing in web technologies and DevOps.',
    role: 'Tech Writer',
    social: { twitter: '@marcusj', github: 'marcusj' }
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    avatar: 'https://images.pexels.com/photos/2451568/pexels-photo-2451568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
    bio: 'Data scientist and AI researcher sharing insights on machine learning and data analytics.',
    role: 'AI Correspondent',
    social: { twitter: '@elenarodz', linkedin: 'elenarodriguez' }
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Latest in tech innovation', icon: '💻', count: 156, color: '#6366f1' },
  { id: '2', name: 'AI & Machine Learning', slug: 'ai-ml', description: 'Artificial Intelligence breakthroughs', icon: '🤖', count: 89, color: '#8b5cf6' },
  { id: '3', name: 'Programming', slug: 'programming', description: 'Coding tutorials and guides', icon: '⌨️', count: 234, color: '#06b6d4' },
  { id: '4', name: 'Web Development', slug: 'web-development', description: 'Frontend & backend development', icon: '🌐', count: 178, color: '#10b981' },
  { id: '5', name: 'Cybersecurity', slug: 'cybersecurity', description: 'Security news and best practices', icon: '🔒', count: 67, color: '#ef4444' },
  { id: '6', name: 'Cloud Computing', slug: 'cloud-computing', description: 'AWS, Azure, GCP and more', icon: '☁️', count: 93, color: '#3b82f6' },
  { id: '7', name: 'Mobile Development', slug: 'mobile-development', description: 'iOS and Android development', icon: '📱', count: 112, color: '#f59e0b' },
  { id: '8', name: 'Data Science', slug: 'data-science', description: 'Analytics, visualization, big data', icon: '📊', count: 76, color: '#ec4899' },
  { id: '9', name: 'DevOps', slug: 'devops', description: 'CI/CD, containers, infrastructure', icon: '⚙️', count: 54, color: '#14b8a6' },
  { id: '10', name: 'Startup', slug: 'startup', description: 'Entrepreneurship and funding', icon: '🚀', count: 45, color: '#f97316' },
];

const articleContent = `
## Introduction

In the rapidly evolving landscape of technology, staying ahead of the curve is not just an advantage—it's a necessity. This comprehensive guide explores the latest developments that are reshaping how we build, deploy, and scale modern applications.

### The Rise of AI-Powered Development

Artificial intelligence has fundamentally transformed the software development lifecycle. From code completion to automated testing, AI tools are augmenting developer capabilities in unprecedented ways.

> "The best way to predict the future is to invent it." — Alan Kay

#### Key Trends to Watch

1. **Large Language Models in Production** - Companies are increasingly deploying LLMs for customer-facing applications, moving beyond experimental chatbots to production-grade systems.

2. **Edge Computing Revolution** - Processing data closer to the source reduces latency and bandwidth costs, making real-time applications more feasible than ever.

3. **WebAssembly Everywhere** - WASM is breaking free from the browser, enabling near-native performance across diverse environments.

### Code Example

\`\`\`typescript
// Modern API route handler
export async function handler(req: Request) {
  const data = await processWithAI(req.body);
  return Response.json({
    status: 'success',
    data,
    timestamp: Date.now()
  });
}
\`\`\`

### Performance Optimization

Modern web applications must deliver sub-second load times to maintain user engagement. Here are proven strategies:

- **Code splitting** - Load only what's needed
- **Image optimization** - Use modern formats like WebP and AVIF
- **CDN distribution** - Serve assets from edge locations
- **Server-side rendering** - Improve initial load performance
- **Caching strategies** - Implement smart caching at every layer

### The Future is Now

As we look toward the future, the convergence of AI, cloud-native architecture, and edge computing promises to unlock entirely new categories of applications. Organizations that embrace these technologies today will be well-positioned for tomorrow's challenges.

### Conclusion

The technology landscape continues to evolve at an accelerating pace. By understanding and adopting these trends, developers and organizations can build more resilient, performant, and intelligent applications.

---

*What trends are you most excited about? Share your thoughts in the comments below.*
`;

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of AI: How GPT-5 Will Transform Software Development Forever',
    slug: 'future-of-ai-gpt5-software-development',
    excerpt: 'Explore how the next generation of AI models will revolutionize coding, testing, and deployment workflows for developers worldwide.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'AI & Machine Learning',
    tags: ['AI', 'GPT-5', 'Software Development', 'Machine Learning'],
    author: authors[0],
    publishedAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-15T10:00:00Z',
    readingTime: 8,
    views: 45200,
    likes: 2340,
    comments: [
      { id: 'c1', author: 'Alex Turner', avatar: '', content: 'Incredible insights! The section on LLMs in production really resonated with our team.', createdAt: '2025-12-15T12:00:00Z', likes: 23, replies: [] },
      { id: 'c2', author: 'Priya Patel', avatar: '', content: 'Great article. Would love to see a follow-up on the ethical implications.', createdAt: '2025-12-15T14:00:00Z', likes: 15, replies: [] }
    ],
    status: 'published',
    featured: true,
    trending: true,
    seo: { metaTitle: 'Future of AI: GPT-5 Impact on Software Development', metaDescription: 'Discover how GPT-5 will transform software development', canonicalUrl: '/article/future-of-ai-gpt5-software-development', ogImage: '' },
    type: 'article'
  },
  {
    id: '2',
    title: 'Building Scalable Microservices with Kubernetes: A Complete 2026 Guide',
    slug: 'scalable-microservices-kubernetes-2026',
    excerpt: 'Master the art of container orchestration with this comprehensive Kubernetes guide covering advanced patterns and best practices.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'DevOps',
    tags: ['Kubernetes', 'Microservices', 'Docker', 'Cloud'],
    author: authors[1],
    publishedAt: '2025-12-14T09:00:00Z',
    updatedAt: '2025-12-14T09:00:00Z',
    readingTime: 12,
    views: 32100,
    likes: 1890,
    comments: [
      { id: 'c3', author: 'Dev Kumar', avatar: '', content: 'This is exactly what I needed for our migration project. Thanks!', createdAt: '2025-12-14T11:00:00Z', likes: 8, replies: [] }
    ],
    status: 'published',
    featured: true,
    trending: true,
    seo: { metaTitle: 'Kubernetes Microservices Guide 2026', metaDescription: 'Complete guide to building scalable microservices with Kubernetes', canonicalUrl: '/article/scalable-microservices-kubernetes-2026', ogImage: '' },
    type: 'tutorial'
  },
  {
    id: '3',
    title: 'React 20 vs Vue 4 vs Angular 19: The Ultimate Frontend Framework Comparison',
    slug: 'react-vue-angular-comparison-2026',
    excerpt: 'An in-depth comparison of the top three frontend frameworks with benchmarks, ecosystem analysis, and real-world use cases.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Web Development',
    tags: ['React', 'Vue', 'Angular', 'Frontend', 'JavaScript'],
    author: authors[2],
    publishedAt: '2025-12-13T08:00:00Z',
    updatedAt: '2025-12-13T08:00:00Z',
    readingTime: 15,
    views: 67800,
    likes: 4210,
    comments: [
      { id: 'c4', author: 'Framework Fan', avatar: '', content: 'Finally an unbiased comparison! Great work Elena.', createdAt: '2025-12-13T10:00:00Z', likes: 45, replies: [] }
    ],
    status: 'published',
    featured: true,
    trending: true,
    seo: { metaTitle: 'React vs Vue vs Angular 2026 Comparison', metaDescription: 'Ultimate frontend framework comparison for 2026', canonicalUrl: '/article/react-vue-angular-comparison-2026', ogImage: '' },
    type: 'article'
  },
  {
    id: '4',
    title: 'Cybersecurity in 2026: Top 10 Threats Every Developer Must Know',
    slug: 'cybersecurity-top-threats-2026',
    excerpt: 'Stay ahead of emerging cyber threats with our comprehensive breakdown of the most critical security vulnerabilities this year.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Cybersecurity',
    tags: ['Security', 'Cyber Threats', 'Privacy', 'Encryption'],
    author: authors[0],
    publishedAt: '2025-12-12T07:00:00Z',
    updatedAt: '2025-12-12T07:00:00Z',
    readingTime: 10,
    views: 28900,
    likes: 1560,
    comments: [],
    status: 'published',
    featured: false,
    trending: true,
    seo: { metaTitle: 'Top Cybersecurity Threats 2026', metaDescription: 'Critical security threats every developer should know about in 2026', canonicalUrl: '/article/cybersecurity-top-threats-2026', ogImage: '' },
    type: 'news'
  },
  {
    id: '5',
    title: 'Complete Guide to Building REST APIs with Node.js and TypeScript',
    slug: 'building-rest-apis-nodejs-typescript',
    excerpt: 'Learn how to build production-ready REST APIs using Node.js, Express, and TypeScript with authentication, validation, and testing.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Programming',
    tags: ['Node.js', 'TypeScript', 'REST API', 'Backend'],
    author: authors[1],
    publishedAt: '2025-12-11T06:00:00Z',
    updatedAt: '2025-12-11T06:00:00Z',
    readingTime: 20,
    views: 41300,
    likes: 2780,
    comments: [
      { id: 'c5', author: 'NodeDev', avatar: '', content: 'Best Node.js tutorial I have read this year!', createdAt: '2025-12-11T09:00:00Z', likes: 34, replies: [] }
    ],
    status: 'published',
    featured: false,
    trending: false,
    seo: { metaTitle: 'Build REST APIs with Node.js and TypeScript', metaDescription: 'Complete tutorial for building REST APIs', canonicalUrl: '/article/building-rest-apis-nodejs-typescript', ogImage: '' },
    type: 'tutorial'
  },
  {
    id: '6',
    title: 'AWS vs Azure vs GCP: Cloud Platform Comparison for Startups',
    slug: 'aws-azure-gcp-cloud-comparison-startups',
    excerpt: 'Choosing the right cloud platform can make or break your startup. Here is a detailed comparison to help you decide.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Cloud Computing',
    tags: ['AWS', 'Azure', 'GCP', 'Cloud', 'Startup'],
    author: authors[2],
    publishedAt: '2025-12-10T05:00:00Z',
    updatedAt: '2025-12-10T05:00:00Z',
    readingTime: 14,
    views: 25600,
    likes: 1340,
    comments: [],
    status: 'published',
    featured: false,
    trending: false,
    seo: { metaTitle: 'AWS vs Azure vs GCP for Startups', metaDescription: 'Cloud platform comparison guide for startups', canonicalUrl: '/article/aws-azure-gcp-cloud-comparison-startups', ogImage: '' },
    type: 'article'
  },
  {
    id: '7',
    title: 'Flutter vs React Native in 2026: Which Should You Choose?',
    slug: 'flutter-vs-react-native-2026',
    excerpt: 'A comprehensive comparison of the two leading cross-platform mobile development frameworks with real-world benchmarks.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/14841760/pexels-photo-14841760.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Mobile Development',
    tags: ['Flutter', 'React Native', 'Mobile', 'Cross-Platform'],
    author: authors[0],
    publishedAt: '2025-12-09T04:00:00Z',
    updatedAt: '2025-12-09T04:00:00Z',
    readingTime: 11,
    views: 38700,
    likes: 2100,
    comments: [],
    status: 'published',
    featured: false,
    trending: true,
    seo: { metaTitle: 'Flutter vs React Native 2026', metaDescription: 'Which mobile framework is best in 2026?', canonicalUrl: '/article/flutter-vs-react-native-2026', ogImage: '' },
    type: 'article'
  },
  {
    id: '8',
    title: 'Machine Learning Pipeline: From Data Collection to Model Deployment',
    slug: 'machine-learning-pipeline-complete-guide',
    excerpt: 'Build end-to-end ML pipelines with this step-by-step guide covering data preprocessing, model training, and production deployment.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Data Science',
    tags: ['Machine Learning', 'Data Science', 'Python', 'MLOps'],
    author: authors[2],
    publishedAt: '2025-12-08T03:00:00Z',
    updatedAt: '2025-12-08T03:00:00Z',
    readingTime: 18,
    views: 29400,
    likes: 1890,
    comments: [],
    status: 'published',
    featured: false,
    trending: false,
    seo: { metaTitle: 'Complete ML Pipeline Guide', metaDescription: 'End-to-end machine learning pipeline tutorial', canonicalUrl: '/article/machine-learning-pipeline-complete-guide', ogImage: '' },
    type: 'tutorial'
  },
  {
    id: '9',
    title: 'How We Raised $5M: A Startup Founders Journey Through Y Combinator',
    slug: 'startup-journey-y-combinator-5m-funding',
    excerpt: 'An honest look at the highs and lows of going through Y Combinator and raising a Series A round in the current market.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/15543034/pexels-photo-15543034.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Startup',
    tags: ['Startup', 'Funding', 'Y Combinator', 'Entrepreneurship'],
    author: authors[1],
    publishedAt: '2025-12-07T02:00:00Z',
    updatedAt: '2025-12-07T02:00:00Z',
    readingTime: 9,
    views: 52100,
    likes: 3450,
    comments: [],
    status: 'published',
    featured: true,
    trending: true,
    seo: { metaTitle: 'Startup Journey Through Y Combinator', metaDescription: 'How we raised $5M through Y Combinator', canonicalUrl: '/article/startup-journey-y-combinator-5m-funding', ogImage: '' },
    type: 'article'
  },
  {
    id: '10',
    title: 'Understanding WebAssembly: The Future of High-Performance Web Apps',
    slug: 'understanding-webassembly-future-web',
    excerpt: 'Dive deep into WebAssembly and discover how it enables near-native performance in the browser for complex applications.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/14314636/pexels-photo-14314636.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Technology',
    tags: ['WebAssembly', 'WASM', 'Performance', 'Web'],
    author: authors[0],
    publishedAt: '2025-12-06T01:00:00Z',
    updatedAt: '2025-12-06T01:00:00Z',
    readingTime: 13,
    views: 19800,
    likes: 1120,
    comments: [],
    status: 'published',
    featured: false,
    trending: false,
    seo: { metaTitle: 'WebAssembly Guide for Web Developers', metaDescription: 'Complete guide to WebAssembly for high-performance web apps', canonicalUrl: '/article/understanding-webassembly-future-web', ogImage: '' },
    type: 'article'
  },
  {
    id: '11',
    title: 'Docker and Container Security: Best Practices for Production',
    slug: 'docker-container-security-best-practices',
    excerpt: 'Secure your containerized applications with these proven security practices covering image scanning, runtime protection, and more.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/17713879/pexels-photo-17713879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'DevOps',
    tags: ['Docker', 'Security', 'Containers', 'DevOps'],
    author: authors[1],
    publishedAt: '2025-12-05T00:00:00Z',
    updatedAt: '2025-12-05T00:00:00Z',
    readingTime: 16,
    views: 22300,
    likes: 1450,
    comments: [],
    status: 'published',
    featured: false,
    trending: false,
    seo: { metaTitle: 'Docker Security Best Practices', metaDescription: 'Production-ready container security guide', canonicalUrl: '/article/docker-container-security-best-practices', ogImage: '' },
    type: 'tutorial'
  },
  {
    id: '12',
    title: 'Building Real-Time Apps with WebSockets and Server-Sent Events',
    slug: 'realtime-apps-websockets-sse',
    excerpt: 'Learn to build responsive real-time applications using WebSockets and SSE with practical examples in Node.js.',
    content: articleContent,
    featuredImage: 'https://images.pexels.com/photos/6914058/pexels-photo-6914058.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'Programming',
    tags: ['WebSockets', 'Real-time', 'Node.js', 'SSE'],
    author: authors[2],
    publishedAt: '2025-12-04T23:00:00Z',
    updatedAt: '2025-12-04T23:00:00Z',
    readingTime: 14,
    views: 18600,
    likes: 980,
    comments: [],
    status: 'published',
    featured: false,
    trending: false,
    seo: { metaTitle: 'Real-Time Apps with WebSockets', metaDescription: 'Build real-time applications tutorial', canonicalUrl: '/article/realtime-apps-websockets-sse', ogImage: '' },
    type: 'tutorial'
  }
];

export const analyticsData: AnalyticsData = {
  totalViews: 1248500,
  totalArticles: 342,
  totalComments: 8945,
  totalSubscribers: 24680,
  revenue: 12450.80,
  viewsChart: [
    { date: 'Mon', views: 4200 },
    { date: 'Tue', views: 5800 },
    { date: 'Wed', views: 6100 },
    { date: 'Thu', views: 5400 },
    { date: 'Fri', views: 7200 },
    { date: 'Sat', views: 8900 },
    { date: 'Sun', views: 7600 },
  ],
  topArticles: [
    { title: 'React vs Vue vs Angular 2026', views: 67800 },
    { title: 'Y Combinator Journey', views: 52100 },
    { title: 'Future of AI: GPT-5', views: 45200 },
    { title: 'REST APIs with Node.js', views: 41300 },
    { title: 'Flutter vs React Native', views: 38700 },
  ],
  trafficSources: [
    { source: 'Google Search', percentage: 45 },
    { source: 'Direct', percentage: 22 },
    { source: 'Social Media', percentage: 18 },
    { source: 'Referral', percentage: 10 },
    { source: 'Email', percentage: 5 },
  ]
};
