import { Link } from 'react-router-dom';

const Tiers = () => {
  const tiers = [
    {
      name: 'Explorer',
      price: '$49',
      badge: 'Entry',
      features: ['Monthly curated editorial', 'Community forum access', 'Early event notifications', 'Digital Fan Card'],
      popular: false
    },
    {
      name: 'Builder',
      price: '$149',
      badge: 'Most Popular',
      features: ['All Explorer benefits', 'Quarterly intimate dinners', '1:1 mentoring session', 'Physical Fan Card + Gift Kit', 'Private community channel'],
      popular: true
    },
    {
      name: 'Master',
      price: '$349',
      badge: 'Premier',
      features: ['All Builder benefits', 'Annual private retreat', 'Strategic advisory session', 'Premium Gift Kit', 'Direct line to Matthew'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#2A2A2A] py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C9A96E]">Membership</span>
        <h2 className="font-serif text-4xl md:text-5xl text-white mt-2">Choose Your <span className="text-[#C9A96E]">Path</span></h2>
        <p className="text-[#E8DDD0] opacity-70 mt-4 max-w-lg mx-auto">Three tiers crafted for different levels of investment and access.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier, index) => (
          <div key={index} className={`bg-white/5 rounded-2xl p-8 border transition hover:-translate-y-2 hover:shadow-2xl ${tier.popular ? 'border-[#C9A96E]/30 bg-[#C9A96E]/5' : 'border-white/5'}`}>
            <span className="inline-block px-3 py-1 border border-[#C9A96E] rounded-full text-xs uppercase tracking-widest text-[#C9A96E] mb-4">{tier.badge}</span>
            <h3 className="font-serif text-2xl text-white">{tier.name}</h3>
            <div className="mt-2 mb-4"><span className="text-3xl font-bold text-white">{tier.price}</span><span className="text-[#D4C5B2] opacity-60"> / month</span></div>
            <ul className="space-y-3 text-sm text-[#E8DDD0] opacity-80">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-[#C9A96E]">◆</span> {feature}</li>
              ))}
            </ul>
            <Link to="/apply" className={`block text-center mt-6 px-6 py-3 rounded-full text-sm uppercase tracking-wider font-semibold transition ${tier.popular ? 'bg-[#C9A96E] text-[#1A1A1A] hover:bg-[#E0C99A]' : 'border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#1A1A1A]'}`}>
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tiers;
