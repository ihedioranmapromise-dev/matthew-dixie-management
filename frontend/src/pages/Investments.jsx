import { useEffect, useState } from 'react';
import api from '../api';
import TierModal from '../components/TierModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await api.get('/public/investments');
        setInvestments(res.data);
      } catch (err) {
        console.error('Error fetching investments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  const openTierModal = (investmentId) => {
    setSelectedInvestmentId(investmentId);
    setShowTierModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl text-white mb-4 text-center">Investment Plans</h1>
        <p className="text-warm-sand-light opacity-70 text-center max-w-2xl mx-auto mb-12">
          Support Matthew's vision and be part of something extraordinary.
          Click on any plan to see the membership tiers.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {investments.map((inv) => (
            <div
              key={inv.id}
              onClick={() => openTierModal(inv.id)}
              className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-gold/30 transition cursor-pointer hover:scale-[1.02] hover:shadow-xl"
            >
              <h3 className="font-serif text-2xl text-white">{inv.name}</h3>
              <div className="mt-2 text-gold font-semibold">
                {inv.min_amount && inv.max_amount ? `$${inv.min_amount} – $${inv.max_amount}` :
                 inv.min_amount ? `$${inv.min_amount}+` : 'Flexible'}
              </div>
              <p className="text-warm-sand-light opacity-70 mt-2">{inv.description}</p>
              <div className="mt-4 text-sm text-gold/60">Click to view tiers →</div>
            </div>
          ))}
        </div>
      </div>
      <TierModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        investmentPlanId={selectedInvestmentId}
      />
    </div>
  );
};

export default Investments;
