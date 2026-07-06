import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#D4C5B2]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center px-6 md:px-20">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1 border border-[#C9A96E] rounded-full text-xs uppercase tracking-widest text-[#C9A96E] mb-6">
            ✦ Exclusive Access
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            Join the <span className="text-[#C9A96E] italic">Inner Circle</span>
          </h1>
          <p className="text-lg text-[#E8DDD0] opacity-80 mt-6 max-w-lg leading-relaxed">
            An application‑based membership for those who seek depth, connection, 
            and the extraordinary. Invest in Matthew Dixie's journey and become part of a movement.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/apply" className="px-8 py-3 bg-[#C9A96E] text-[#1A1A1A] rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-[#E0C99A] transition">
              Apply Now
            </Link>
            <Link to="/tiers" className="px-8 py-3 border border-white/20 text-white rounded-full font-semibold uppercase tracking-wider text-sm hover:border-[#C9A96E] hover:text-[#C9A96E] transition">
              Explore Tiers
            </Link>
          </div>
          <div className="flex gap-12 mt-12 pt-8 border-t border-white/10">
            <div><span className="block font-serif text-2xl text-white">247</span><span className="text-xs uppercase tracking-widest text-white/40">Members</span></div>
            <div><span className="block font-serif text-2xl text-white">12</span><span className="text-xs uppercase tracking-widest text-white/40">Countries</span></div>
            <div><span className="block font-serif text-2xl text-white">94%</span><span className="text-xs uppercase tracking-widest text-white/40">Retention</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
