import { Link } from 'react-router-dom';

const Home = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Intentional Community',
      excerpt: 'Building something that outlasts trends requires more than vision – it requires a tribe of believers...',
      date: 'July 5, 2026',
      category: 'Community'
    },
    {
      id: 2,
      title: 'Behind the Scenes: The Inner Circle Launch',
      excerpt: 'What does it take to build a movement from the ground up? A look behind the curtain at the Inner Circle...',
      date: 'July 3, 2026',
      category: 'Updates'
    },
    {
      id: 3,
      title: 'Why We Build: A Conversation with Matthew',
      excerpt: 'Sitting down with Matthew to discuss the vision, the journey, and the future of the Inner Circle...',
      date: 'June 28, 2026',
      category: 'Interviews'
    }
  ];

  return (
    <div className="min-h-screen bg-charcoal text-warm-sand pt-20">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center px-6 md:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-charcoal-light opacity-50" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />

        <div className="relative max-w-3xl">
          <span className="inline-block px-4 py-1 border border-gold rounded-full text-xs uppercase tracking-widest text-gold mb-6">
            ✦ Exclusive Access
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            Join the <span className="text-gold italic">Inner Circle</span>
          </h1>
          <p className="text-lg md:text-xl text-warm-sand-light opacity-80 mt-6 max-w-lg leading-relaxed">
            Matthew Dixie is a creative architect, cultural entrepreneur, and visionary who believes 
            in the power of intentional community. His work spans music, art, and strategic philanthropy – 
            always with an eye toward building something that outlasts trends.
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
              Born in Augusta, Maine, Matthew Dixie grew up with his hands in the earth and his eyes 
              on the horizon. His journey took him from the forests of New England to the creative 
              hubs of London and beyond, where he discovered that true wealth isn't built in 
              isolation – it's cultivated in community.
            </p>
            <p className="text-warm-sand-light opacity-70 mt-4 leading-relaxed">
              Today, Matthew is a creative architect, cultural entrepreneur, and visionary who 
              believes in the power of intentional connection.
            </p>
          </div>
          <div className="relative aspect-square bg-gradient-to-br from-gold/10 to-transparent rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
            <div className="text-7xl text-white/10 font-serif">✦</div>
          </div>
        </div>
      </div>

      {/* Blog / Stories Section */}
      <div className="bg-charcoal-light py-20 px-6 md:px-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold">Stories</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mt-1">
                Latest <span className="text-gold">Updates</span>
              </h2>
            </div>
            <Link to="/blog" className="text-gold hover:text-gold-light transition font-semibold text-sm">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-gold/20 transition hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gold uppercase tracking-widest">{post.category}</span>
                  <span className="text-xs text-white/20">•</span>
                  <span className="text-xs text-white/30">{post.date}</span>
                </div>
                <h3 className="font-serif text-xl text-white mb-2">{post.title}</h3>
                <p className="text-warm-sand-light opacity-70 text-sm leading-relaxed">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="inline-block mt-4 text-gold text-sm hover:text-gold-light transition font-semibold">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-gold">Media</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white mt-1">
              In the <span className="text-gold">Spotlight</span>
            </h2>
            <p className="text-warm-sand-light opacity-70 mt-2">Featured videos and moments from the journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group cursor-pointer hover:border-gold/30 transition">
              <div className="text-center">
                <div className="text-4xl text-gold/30 group-hover:text-gold/60 transition">▶</div>
                <span className="text-xs text-white/30 block mt-2">Watch: Episode 1</span>
              </div>
            </div>
            <div className="relative aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group cursor-pointer hover:border-gold/30 transition">
              <div className="text-center">
                <div className="text-4xl text-gold/30 group-hover:text-gold/60 transition">▶</div>
                <span className="text-xs text-white/30 block mt-2">Watch: Behind the Scenes</span>
              </div>
            </div>
            <div className="relative aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group cursor-pointer hover:border-gold/30 transition">
              <div className="text-center">
                <div className="text-4xl text-gold/30 group-hover:text-gold/60 transition">▶</div>
                <span className="text-xs text-white/30 block mt-2">Watch: The Inner Circle</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                <span className="text-white/10 text-2xl">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="border-t border-white/5 py-16 px-6 md:px-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl text-white mb-4">Ready to Join?</h3>
          <p className="text-warm-sand-light opacity-70 mb-6">Become part of a movement that's building something extraordinary.</p>
          <Link to="/apply" className="px-8 py-3 bg-gold text-charcoal rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-gold-light transition inline-block">
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
