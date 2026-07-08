import { useEffect, useState } from 'react';
import api from '../api';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await api.get('/public/investments');
        setInvestments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl text-white mb-4 text-center">Investment Plans</h1>
        <p className="text-warm-sand-light opacity-70 text-center max-w-2xl mx-auto mb-12">Support Matthew's vision and be part of something extraordinary.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-gold/30 transition">
              <h3 className="font-serif text-2xl text-white">{inv.name}</h3>
              <div className="mt-2 text-gold font-semibold">
                {inv.min_amount && inv.max_amount ? `$${inv.min_amount} – $${inv.max_amount}` :
                 inv.min_amount ? `$${inv.min_amount}+` : 'Flexible'}
              </div>
              <p className="text-warm-sand-light opacity-70 mt-2">{inv.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Investments;
