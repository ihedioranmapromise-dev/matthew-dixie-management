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

  // Use uploaded profile image or fallback to avatar
  const profileImage = content.profile_image_url || 'https://ui-avatars.com/api/?name=Matthew+Dixie&size=300&background=C9A96E&color=1A1A1A&bold=true';

  // Split social links if stored as newline-separated
  const socialLinks = content.press_social_links?.split('\n').filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Logo (if any) */}
        {content.logo_url && (
          <div className="mb-6">
            <img src={content.logo_url} alt="Matthew Dixie Logo" className="h-20 w-auto" />
          </div>
        )}

        {/* Header with Profile Image and Name */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={profileImage}
            alt="Matthew Dixie"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-gold shadow-xl"
          />
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-white">Matthew Dixie</h1>
            <p className="text-warm-sand-light opacity-70 text-lg">Press Kit</p>
            <p className="text-warm-sand-light opacity-50 text-sm">Media resources for Matthew Dixie</p>
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-3">
                {socialLinks.map((link, i) => {
                  // Simple detection: if it contains 'instagram' or '@' we can show an icon
                  const label = link.includes('@') ? link : link;
                  return (
                    <a
                      key={i}
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold hover:text-gold-light transition underline underline-offset-2"
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

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

        {/* Photos placeholder – we can later replace with uploaded press photos */}
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
          {socialLinks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-sm">Social Links</p>
              <div className="flex flex-wrap gap-3 mt-1">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold hover:text-gold-light transition"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Press;
