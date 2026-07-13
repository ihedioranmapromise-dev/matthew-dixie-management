import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [content, setContent] = useState({
    hero_title: 'Join the Inner Circle',
    hero_subtitle: 'An application-based membership for those who seek depth, connection, and the extraordinary.',
    hero_background_image: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/public/site-content');
        const data = res.data;
        setContent({
          hero_title: data.hero_title || 'Join the Inner Circle',
          hero_subtitle: data.hero_subtitle || 'An application-based membership for those who seek depth, connection, and the extraordinary.',
          hero_background_image: data.hero_background_image || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-charcoal text-warm-sand pt-20">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center px-6 md:px-20">
        {content.hero_background_image && (
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${content.hero_background_image})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-charcoal-light opacity-50" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />

        <div className="relative max-w-3xl">
          <span className="inline-block px-4 py-1 border border-gold rounded-full text-xs uppercase tracking-widest text-gold mb-6">
            ✦ Exclusive Access
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            {content.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-warm-sand-light opacity-80 mt-6 max-w-lg leading-relaxed">
            {content.hero_subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/apply" className="px-8 py-3 bg-gold text-charcoal rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-gold-light transition">
              Apply Now
            </Link>
            <Link to="/tiers" className="px-8 py-3 border border-white/20 text-white rounded-full font-semibold uppercase tracking-wider text-sm hover:border-gold hover:text-gold transition">
              Explore Tiers
            </Link>
            <Link to="/investments" className="px-8 py-3 border border-gold/40 text-gold rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-gold hover:text-charcoal transition">
              Invest
            </Link>
          </div>
          <div className="flex gap-12 mt-12 pt-8 border-t border-white/10">
            <div><span className="block font-serif text-2xl text-white">247</span><span className="text-xs uppercase tracking-widest text-white/40">Members</span></div>
            <div><span className="block font-serif text-2xl text-white">12</span><span className="text-xs uppercase tracking-widest text-white/40">Countries</span></div>
            <div><span className="block font-serif text-2xl text-white">94%</span><span className="text-xs uppercase tracking-widest text-white/40">Retention</span></div>
          </div>
        </div>
      </div>

      {/* About / Mission Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold">About Matthew</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white mt-2">
              A Visionary for <span className="text-gold">the New Era</span>
            </h2>
            <div className="w-16 h-0.5 bg-gold mt-4" />
            <p className="text-warm-sand-light opacity-80 mt-6 leading-relaxed">
              {content.about_text || 'Matthew Dixie is a creative architect, cultural entrepreneur, and visionary who believes in the power of intentional community.'}
            </p>
            <Link to="/press" className="inline-block mt-6 text-gold hover:text-gold-light transition font-semibold">
              Learn More →
            </Link>
          </div>
          <div className="relative aspect-square bg-gradient-to-br from-gold/10 to-transparent rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
            <div className="text-7xl text-white/10 font-serif">✦</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;