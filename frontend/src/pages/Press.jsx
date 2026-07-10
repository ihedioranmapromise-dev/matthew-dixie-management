import { useEffect, useState } from 'react';
import api from '../api';

const Press = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/public/site-content');
        setContent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  const episodes = content.press_featured_episodes?.split('\n').filter(Boolean) || [];
  const stories = content.press_stories?.split('\n').filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Logo */}
        {content.logo_url && (
          <div className="mb-6">
            <img src={content.logo_url} alt="Matthew Dixie Logo" className="h-20 w-auto" />
          </div>
        )}

        <h1 className="font-serif text-4xl text-white mb-2">Press Kit</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Media resources for Matthew Dixie</p>

        {/* Show Info */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
          <h2 className="font-serif text-2xl text-white mb-2">{content.press_show_name || 'Maine Cabin Masters (Magnolia Network)'}</h2>
          <p className="text-warm-sand-light opacity-80">{content.press_show_description || 'Matthew "Dixie" Dix is a master carpenter and a beloved cast member...'}</p>
        </div>

        {/* Bio */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
          <h2 className="font-serif text-xl text-white mb-3">Biography</h2>
          <p className="text-warm-sand-light opacity-80 leading-relaxed">{content.about_text || 'About Matthew...'}</p>
        </div>

        {/* Stories */}
        {stories.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
            <h2 className="font-serif text-xl text-white mb-3">📰 Stories</h2>
            <ul className="list-disc list-inside space-y-2 text-warm-sand-light opacity-80">
              {stories.map((story, i) => <li key={i}>{story}</li>)}
            </ul>
          </div>
        )}

        {/* Featured Episodes */}
        {episodes.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
            <h2 className="font-serif text-xl text-white mb-3">Featured Episodes</h2>
            <ul className="list-disc list-inside space-y-2 text-warm-sand-light opacity-80">
              {episodes.map((ep, i) => <li key={i}>{ep}</li>)}
            </ul>
          </div>
        )}

        {/* Photos placeholder */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
          <h2 className="font-serif text-xl text-white mb-3">Press Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-white/10 rounded-xl flex items-center justify-center text-white/30">
                📸 Photo {i}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-3">High‑resolution images coming soon. Contact press for access.</p>
        </div>

        {/* Contact */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h2 className="font-serif text-xl text-white mb-3">Media Contact</h2>
          <div className="space-y-2 text-warm-sand-light opacity-80">
            <p><span className="text-white/40">Email:</span> {content.press_contact_email || 'press@matthewdixie.com'}</p>
            <p><span className="text-white/40">Phone:</span> {content.press_contact_phone || '+1 (207) 555-0199'}</p>
          </div>
          {content.press_social_links && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-sm">Social Links</p>
              <p className="text-warm-sand-light opacity-80 whitespace-pre-line">{content.press_social_links}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Press;
