import { useEffect, useState } from 'react';
import api from '../api';

const TierModal = ({ isOpen, onClose, investmentPlanId }) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && investmentPlanId) {
      const fetchTiers = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get(`/public/investment-tier-prices/${investmentPlanId}`);
          setTiers(res.data);
        } catch (err) {
          console.error('Error fetching tiers:', err);
          setError('Failed to load tiers. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchTiers();
    }
  }, [isOpen, investmentPlanId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-charcoal-light rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 border border-white/5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-2xl text-white">Membership Tiers</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">&times;</button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-white/40">Loading tiers...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-8 text-white/40">No tiers available for this investment plan.</div>
        ) : (
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xl text-white capitalize">{tier.tier_name}</h4>
                  <span className="text-gold font-semibold">${tier.price_monthly}/mo</span>
                </div>
                {tier.price_yearly && (
                  <div className="text-sm text-white/40">or ${tier.price_yearly}/yr</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TierModal;
