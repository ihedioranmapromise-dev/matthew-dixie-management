import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Tiers = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await axios.get('/api/public/tiers');
        setTiers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-charcoal-light py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-gold">Membership</span>
        <h2 className="font-serif text-4xl md:text-5xl text-white mt-2">Choose Your <span className="text-gold">Path</span></h2>
        <p className="text-warm-sand-light opacity-70 mt-4 max-w-lg mx-auto">Three tiers crafted for different levels of investment and access.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div key={tier.id} className={`bg-white/5 rounded-2xl p-8 border transition hover:-translate-y-2 hover:shadow-2xl ${tier.is_active ? 'border-white/5' : 'border-red-500/20 opacity-60'}`}>
            <span className="inline-block px-3 py-1 border border-gold rounded-full text-xs uppercase tracking-widest text-gold mb-4">
              {tier.name}
            </span>
            <h3 className="font-serif text-2xl text-white capitalize">{tier.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-white">${tier.price_monthly}</span>
              <span className="text-warm-sand-light opacity-60"> / month</span>
              {tier.price_yearly && (
                <div className="text-sm text-white/40">or ${tier.price_yearly} yearly</div>
              )}
            </div>
            <ul className="space-y-3 text-sm text-warm-sand-light opacity-80">
              {(tier.benefits || []).map((benefit, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-gold">◆</span> {benefit}</li>
              ))}
            </ul>
            <Link to="/apply" className="block text-center mt-6 px-6 py-3 border border-gold text-gold rounded-full text-sm uppercase tracking-wider font-semibold hover:bg-gold hover:text-charcoal transition">
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tiers;
