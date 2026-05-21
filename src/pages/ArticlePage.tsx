import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Heart, Bookmark, Share2, MessageCircle, Calendar, Tag, ChevronRight, ThumbsUp, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import ReadingProgress from '../components/ui/ReadingProgress';

export default function ArticlePage() {
  const { slug } = useParams();
  const { articles, bookmarks, toggleBookmark, addComment } = useApp();
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const article = articles.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);
  const relatedArticles = articles.filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(t => article.tags.includes(t)))).slice(0, 3);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatViews = (views: number) => views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views.toString();

  // Simple markdown-like content rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-gray-900 dark:bg-black rounded-xl p-5 overflow-x-auto mb-6 border border-gray-800">
              <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                <span>{codeLanguage}</span>
                <button className="hover:text-white">Copy</button>
              </div>
              <code className="text-sm text-green-400 font-mono">{codeContent}</code>
            </pre>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.slice(3);
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={`space-${i}`} className="h-2" />);
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4" id={trimmed.slice(3).toLowerCase().replace(/\s/g, '-')}>{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3" id={trimmed.slice(4).toLowerCase().replace(/\s/g, '-')}>{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith('#### ')) {
        elements.push(<h4 key={i} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">{trimmed.slice(5)}</h4>);
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-indigo-500 pl-5 py-3 my-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl italic text-gray-700 dark:text-gray-300">
            {trimmed.slice(2)}
          </blockquote>
        );
      } else if (trimmed.startsWith('- **')) {
        const boldEnd = trimmed.indexOf('**', 4);
        const boldText = trimmed.slice(4, boldEnd);
        const rest = trimmed.slice(boldEnd + 2);
        elements.push(
          <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300 mb-2 ml-4">
            <span className="text-indigo-500 mt-1.5 text-xs">●</span>
            <span><strong className="text-gray-900 dark:text-white">{boldText}</strong>{rest}</span>
          </li>
        );
      } else if (/^\d+\./.test(trimmed)) {
        const text = trimmed.replace(/^\d+\.\s*/, '');
        const boldMatch = text.match(/^\*\*(.*?)\*\*(.*)/);
        if (boldMatch) {
          elements.push(
            <li key={i} className="text-gray-700 dark:text-gray-300 mb-3 ml-6 list-decimal">
              <strong className="text-gray-900 dark:text-white">{boldMatch[1]}</strong>{boldMatch[2]}
            </li>
          );
        } else {
          elements.push(<li key={i} className="text-gray-700 dark:text-gray-300 mb-2 ml-6 list-decimal">{text}</li>);
        }
      } else if (trimmed.startsWith('---')) {
        elements.push(<hr key={i} className="my-8 border-gray-200 dark:border-gray-700" />);
      } else if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
        elements.push(<p key={i} className="text-gray-500 dark:text-gray-400 italic mb-4">{trimmed.slice(1, -1)}</p>);
      } else {
        // Handle inline formatting
        let html = trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
          .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm text-indigo-600 dark:text-indigo-400 font-mono">$1</code>');
        elements.push(<p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-[17px]" dangerouslySetInnerHTML={{ __html: html }} />);
      }
    });

    return elements;
  };

  // Generate Table of Contents
  const toc = article.content.split('\n')
    .filter(line => line.trim().startsWith('## ') || line.trim().startsWith('### '))
    .map(line => {
      const level = line.trim().startsWith('### ') ? 3 : 2;
      const text = line.trim().replace(/^#{2,3}\s/, '');
      const id = text.toLowerCase().replace(/\s/g, '-');
      return { level, text, id };
    });

  return (
    <>
      <ReadingProgress />
      <article className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/category/${article.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{article.category}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-400 dark:text-gray-500 truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link to={`/category/${article.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
              {article.category}
            </Link>
            <span className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3 h-3" /> {formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" /> {article.readingTime} min read</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><Eye className="w-3 h-3" /> {formatViews(article.views)} views</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{article.excerpt}</p>

          {/* Author & Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{article.author.name}</div>
                <div className="text-sm text-gray-500">{article.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${liked ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} /> {article.likes + (liked ? 1 : 0)}
              </button>
              <button onClick={() => toggleBookmark(article.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isBookmarked ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} /> Save
              </button>
              <div className="relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                    {['Copy Link', 'Twitter / X', 'LinkedIn', 'Facebook', 'Email'].map(platform => (
                      <button key={platform} onClick={() => setShowShareMenu(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {platform}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div>
            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
              <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
            </div>

            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  📋 Table of Contents
                </h3>
                <ul className="space-y-2">
                  {toc.map((item, i) => (
                    <li key={i} className={`${item.level === 3 ? 'ml-4' : ''}`}>
                      <a href={`#${item.id}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content */}
            <div className="prose-custom max-w-none">
              {renderContent(article.content)}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map(tag => (
                <Link key={tag} to={`/search?q=${tag}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Ad */}
            <div className="my-8">
              <AdBanner position="in-article" />
            </div>

            {/* Author Bio */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 my-8 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Written by {article.author.name}</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">{article.author.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{article.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="my-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Comments ({article.comments.length})
              </h3>
              
              {/* Comment Form */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {commentAuthor ? commentAuthor.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={e => setCommentAuthor(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none transition-all"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          if (commentText.trim() && commentAuthor.trim()) {
                            addComment(article.id, { author: commentAuthor, avatar: '', content: commentText });
                            setCommentText('');
                            setCommentAuthor('');
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        disabled={!commentText.trim() || !commentAuthor.trim()}
                      >
                        <Send className="w-4 h-4" /> Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {article.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.author}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                          <ThumbsUp className="w-3 h-3" /> {comment.likes}
                        </button>
                        <button className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* TOC Mini */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">On This Page</h3>
                <ul className="space-y-2">
                  {toc.slice(0, 6).map((item, i) => (
                    <li key={i}>
                      <a href={`#${item.id}`} className={`text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${item.level === 3 ? 'ml-3' : 'font-medium'}`}>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <AdBanner position="sidebar" />

              {/* Related */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Related Articles</h3>
                {relatedArticles.map(a => (
                  <ArticleCard key={a.id} article={a} variant="compact" />
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles (Full Width) */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You Might Also Like</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
