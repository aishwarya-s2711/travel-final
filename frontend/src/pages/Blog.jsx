import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { FiUser, FiCalendar, FiClock, FiShare2, FiLink, FiSearch, FiArrowRight, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import api from '../utils/api';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}

function ShareButtons({ title }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const copy = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#888' }}>
        <FiShare2 style={{ display: 'inline', marginRight: 4 }} />Share
      </span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: '#1da1f2', color: '#fff' }}
        aria-label="Share on Twitter">
        <FiTwitter size={14} />
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: '#1877f2', color: '#fff' }}
        aria-label="Share on Facebook">
        <FaFacebook size={14} />
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: '#0a66c2', color: '#fff' }}
        aria-label="Share on LinkedIn">
        <FiLinkedin size={14} />
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: '#25d366', color: '#fff' }}
        aria-label="Share on WhatsApp">
        <FaWhatsapp size={14} />
      </a>
      <button onClick={copy}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: '#f0ede6', color: '#0f172a' }}
        aria-label="Copy link">
        <FiLink size={14} />
      </button>
    </div>
  );
}

/* Helper to format date string */
function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

/* Helper to derive author name from populated or raw */
function authorName(author) {
  if (!author) return 'TravelGo Team';
  if (typeof author === 'string') return author;
  return author.name || 'TravelGo Team';
}

export function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/public/blogs')
      .then(r => setBlogs(r.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(blogs.map(b => b.category).filter(Boolean))];
  const filtered = blogs.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || b.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
      <SEO
        title="Travel Blog — Insights & Guides"
        description="Expert travel advice, destination guides and inspiring stories from TravelGo's team of travel specialists."
        canonical="/blog"
      />

      <PageHero
        badge="Our Blog"
        title="Travel Insights"
        subtitle="Expert guides, destination stories, and insider tips from our travel specialists"
        image="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=60"
      />

      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <div className="flex items-center gap-2 flex-1 min-w-52 rounded-xl px-5 py-3"
              style={{ background: '#fff', border: '1.5px solid #e8e4dc' }}>
              <FiSearch style={{ color: '#7C3AED' }} />
              <input
                type="text"
                placeholder=""
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif', background: 'transparent', color: '#1a1a1a' }}
                aria-label="Search blog articles"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
                  style={{
                    background: category === c ? '#0f172a' : 'transparent',
                    color: category === c ? '#fff' : '#4a4a4a',
                    border: `1.5px solid ${category === c ? '#0f172a' : '#e8e4dc'}`,
                  }}
                  aria-pressed={category === c}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center py-24">
              <div className="text-5xl mb-4 animate-spin">⏳</div>
              <p style={{ color: '#888' }}>Loading articles...</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* Featured */}
              {category === 'All' && !search && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl overflow-hidden mb-12 group"
                  style={{ boxShadow: '0 24px 64px rgba(10,25,47,0.12)' }}
                >
                  <Link to={`/blog/${filtered[0]._id}`} className="block">
                    <div className="relative h-80 lg:h-[420px] overflow-hidden">
                      <img
                        src={filtered[0].image}
                        alt={filtered[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,47,0.92) 0%, rgba(10,25,47,0.30) 60%, transparent 100%)' }} />
                      <div className="absolute bottom-0 left-0 p-8 lg:p-12 max-w-2xl">
                        <span className="section-badge" style={{ color: '#2563EB', borderColor: 'rgba(212,180,131,0.35)', background: 'rgba(212,180,131,0.12)', marginBottom: 12 }}>
                          {filtered[0].category}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-light text-white mb-3"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          {filtered[0].title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.90)' }}>
                          <span className="flex items-center gap-1.5"><FiUser size={11} />{authorName(filtered[0].author)}</span>
                          <span className="flex items-center gap-1.5"><FiCalendar size={11} />{formatDate(filtered[0].createdAt || filtered[0].date)}</span>
                          {filtered[0].readTime && <span className="flex items-center gap-1.5"><FiClock size={11} />{filtered[0].readTime}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(category === 'All' && !search ? filtered.slice(1) : filtered).map((blog, i) => (
                  <motion.article key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="luxury-card group h-full"
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="relative h-52 overflow-hidden img-hover">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-4 left-4">
                        <span className="section-badge" style={{ background: 'rgba(10,25,47,0.75)', color: '#2563EB', borderColor: 'rgba(212,180,131,0.30)', marginBottom: 0 }}>
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div className="flex items-center gap-3 text-xs mb-4" style={{ color: '#4b5563' }}>
                        <span className="flex items-center gap-1"><FiCalendar size={12} />{formatDate(blog.createdAt || blog.date)}</span>
                        {blog.readTime && <span className="flex items-center gap-1"><FiClock size={12} />{blog.readTime}</span>}
                      </div>
                      <h3 className="font-semibold text-2xl mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {blog.title}
                      </h3>
                      <p className="text-[0.9375rem] mb-5" style={{ color: '#374151', lineHeight: 1.75, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.excerpt}</p>
                      <div className="flex items-center justify-between pt-5" style={{ borderTop: '1px solid #f0ede6', marginTop: 'auto' }}>
                        <span className="flex items-center gap-2 text-sm font-medium" style={{ color: '#444' }}>
                          <FiUser size={14} style={{ color: '#7C3AED' }} />{authorName(blog.author)}
                        </span>
                        <Link to={`/blog/${blog._id}`}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all px-4 py-2 rounded-md bg-[#0f172a] hover:bg-[#1e293b] text-white"
                          aria-label={`Read ${blog.title}`}>
                          Read More <FiArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-light mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>No articles found</h3>
              <p className="text-sm" style={{ color: '#888' }}>Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/public/blogs/${id}`),
      api.get('/public/blogs'),
    ]).then(([blogRes, allRes]) => {
      setBlog(blogRes.data);
      setAllBlogs(allRes.data || []);
    }).catch(() => {
      setBlog(null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f6f2' }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <p style={{ color: '#888' }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f6f2' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>Article not found</h2>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const related = allBlogs.filter(b => b._id !== blog._id && b.category === blog.category).slice(0, 3);
  const otherBlogs = allBlogs.filter(b => b._id !== blog._id).slice(0, 4);
  const paragraphs = (blog.content || blog.excerpt || '').split('\n\n');

  return (
    <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
      <ReadingProgress />
      <SEO
        title={blog.title}
        description={blog.excerpt}
        image={blog.image}
        canonical={`/blog/${blog._id}`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          description: blog.excerpt,
          image: blog.image,
          author: { '@type': 'Person', name: authorName(blog.author) },
          datePublished: blog.createdAt || blog.date,
        }}
      />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover ken-burns" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.82) 60%, rgba(10,25,47,0.68) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, #ffffff, transparent)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-6" style={{ zIndex: 1 }}>
          <span className="section-badge mb-4" style={{ color: '#2563EB', borderColor: 'rgba(212,180,131,0.35)', background: 'rgba(212,180,131,0.12)' }}>
            {blog.category}
          </span>
          <h1 className="text-4xl lg:text-6xl font-light text-white max-w-4xl mb-5"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm" style={{ color: 'rgba(255,255,255,0.90)' }}>
            <span className="flex items-center gap-1.5"><FiUser size={13} />{authorName(blog.author)}</span>
            <span className="flex items-center gap-1.5"><FiCalendar size={13} />{formatDate(blog.createdAt || blog.date)}</span>
            {blog.readTime && <span className="flex items-center gap-1.5"><FiClock size={13} />{blog.readTime}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex gap-12">

          {/* Article */}
          <article className="flex-1 min-w-0">
            <div className="rounded-3xl p-8 lg:p-12 mb-8" style={{ background: '#fff', boxShadow: '0 8px 32px rgba(10,25,47,0.07)' }}>
              {blog.excerpt && (
                <p className="text-lg leading-relaxed mb-8 italic"
                  style={{ color: '#374151', borderLeft: '3px solid #7C3AED', paddingLeft: 20, fontFamily: 'Inter, sans-serif', fontSize: '1.2rem' }}>
                  {blog.excerpt}
                </p>
              )}
              <div className="space-y-6">
                {paragraphs.map((para, i) => {
                  if (para.startsWith('**') && para.includes('**')) {
                    const isHeading = para.match(/^\*\*[^*]+\*\*/);
                    if (isHeading) {
                      const heading = para.match(/^\*\*([^*]+)\*\*/)?.[1] || '';
                      const body = para.replace(/^\*\*[^*]+\*\*/, '').trim();
                      return (
                        <div key={i}>
                          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                            {heading}
                          </h3>
                          {body && <p className="text-[1.0625rem] leading-[1.85]" style={{ color: '#374151' }}>{body}</p>}
                        </div>
                      );
                    }
                  }
                  return (
                    <p key={i} className="text-[1.0625rem] leading-[1.85]" style={{ color: '#374151' }}>{para}</p>
                  );
                })}
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid #e8e4dc' }}>
                  {blog.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(124,58,237,0.10)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.25)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 flex items-center gap-4 flex-wrap" style={{ borderTop: '1px solid #e8e4dc' }}>
                <ShareButtons title={blog.title} />
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 rounded-full" style={{ background: '#7C3AED' }} />
                  <h2 className="text-2xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                    Related Articles
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {related.map(b => (
                    <Link key={b._id} to={`/blog/${b._id}`}
                      className="luxury-card group block"
                      aria-label={`Read ${b.title}`}>
                      <div className="relative h-40 overflow-hidden img-hover">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs mb-1" style={{ color: '#7C3AED', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                          {b.category}
                        </p>
                        <h4 className="font-light text-base line-clamp-2 group-hover:text-[#7C3AED] transition-colors"
                          style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                          {b.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Author card */}
              <div className="rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.06)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#7C3AED' }}>About the Author</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                    {authorName(blog.author)[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{authorName(blog.author)}</p>
                    <p className="text-xs" style={{ color: '#888' }}>Travel Specialist</p>
                  </div>
                </div>
                <p className="text-[0.8125rem] leading-relaxed" style={{ color: '#4b5563' }}>
                  Passionate travel writer and destination expert with years of first-hand experience across luxury destinations worldwide.
                </p>
              </div>

              {/* More articles */}
              {otherBlogs.length > 0 && (
                <div className="rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.06)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#7C3AED' }}>More Articles</p>
                  <div className="space-y-4">
                    {otherBlogs.map(b => (
                      <Link key={b._id} to={`/blog/${b._id}`} className="flex gap-3 group">
                        <img src={b.image} alt={b.title} className="w-14 h-14 rounded-lg object-cover shrink-0" loading="lazy" />
                        <div>
                          <p className="text-[0.8125rem] font-medium line-clamp-2 group-hover:text-[#7C3AED] transition-colors"
                            style={{ color: '#0f172a' }}>{b.title}</p>
                          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{formatDate(b.createdAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
