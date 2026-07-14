import { useEffect, useState } from 'react';
import api from '../api';

const TierModal = ({ isOpen, onClose, investmentPlanId }) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && investmentPlanId) {
      const fetchTiers = async () => {
        try {
          const res = await api.get(`/public/investment-tier-prices/${investmentPlanId}`);
          setTiers(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTiers();
    }
  }, [isOpen, investmentPlanId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl text-white">Choose Your Tier</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-3xl transition">&times;</button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-white/40">Loading tiers...</div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-8 text-white/40">No tiers available for this plan.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-gold/40 transition hover:shadow-gold/10 hover:shadow-lg group">
                <h3 className="font-serif text-2xl text-white capitalize">{tier.tier_name}</h3>
                <div className="mt-2 text-gold text-2xl font-bold">${tier.price_monthly}<span className="text-sm text-white/40 font-normal"> / month</span></div>
                <p className="text-white/40 text-sm mt-4">Perfect for those starting their journey.</p>
                <button className="mt-4 w-full py-2 border border-gold text-gold rounded-full text-sm hover:bg-gold hover:text-charcoal transition font-semibold">
                  Select {tier.tier_name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TierModal;
