import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [fanCard, setFanCard] = useState(null);
  const [giftKit, setGiftKit] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profileRes = await axios.get('/api/user/profile', { headers });
        setUser(profileRes.data);

        // If user is pending, show pending message instead of fetching other data
        if (profileRes.data.status === 'pending') {
          setLoading(false);
          return;
        }

        const appRes = await axios.get('/api/user/application', { headers });
        setApplication(appRes.data);

        const cardRes = await axios.get('/api/user/fan-card', { headers });
        if (cardRes.data) {
          setFanCard(cardRes.data.fanCard);
          setGiftKit(cardRes.data.giftKit);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;
  }

  // If user is pending, show pending message
  if (user?.status === 'pending') {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 rounded-2xl p-8 border border-white/5 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="font-serif text-3xl text-white mb-2">Account Pending</h2>
          <p className="text-warm-sand-light opacity-70">
            Your account is pending approval. You will receive a notification when your account is approved.
          </p>
          <p className="text-sm text-white/40 mt-4">
            If you have any questions, please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Regular dashboard for approved users
  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Welcome back, {user?.name || 'Member'}.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fan Card */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-white">Fan Card</h2>
              {fanCard?.status === 'active' && (
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Active</span>
              )}
              {fanCard?.status === 'pending' && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">Pending</span>
              )}
            </div>
            {fanCard ? (
              <div className="mt-4 bg-gradient-to-br from-gold/10 to-transparent rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/40">Member</div>
                    <div className="font-serif text-xl text-white">{user?.name}</div>
                  </div>
                  <div className="w-12 h-12 border-2 border-gold rounded-full flex items-center justify-center text-gold font-serif text-lg">
                    MD
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div>
                    <span className="text-white/40">Tier</span>
                    <div className="text-white capitalize font-semibold">{fanCard?.tier || application?.tier || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-white/40">Card #</span>
                    <div className="text-white font-mono">{fanCard?.card_number || 'Pending'}</div>
                  </div>
                </div>
                {fanCard?.status === 'active' && (
                  <div className="mt-4 text-xs text-white/30 border-t border-white/10 pt-2">
                    Issued: {new Date(fanCard?.issued_at).toLocaleDateString()}
                  </div>
                )}
                {fanCard?.status === 'pending' && (
                  <div className="mt-4 text-xs text-yellow-400/60 border-t border-white/10 pt-2">
                    Your card is being processed. Gift kit will be shipped soon.
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 text-white/40 text-sm">No fan card issued yet. Complete your application.</div>
            )}
          </div>

          {/* Gift Kit Tracker (only if approved) */}
          {fanCard && fanCard.status === 'active' && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h2 className="font-serif text-xl text-white mb-4">🎁 Gift Kit</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${giftKit?.status === 'processing' || giftKit?.status === 'packaging' ? 'bg-yellow-400' : giftKit?.status === 'shipped' || giftKit?.status === 'delivered' ? 'bg-green-400' : 'bg-white/20'}`} />
                  <span className="text-sm text-white/80">Processing</span>
                  {giftKit?.status === 'processing' && <span className="text-xs text-yellow-400/60 ml-auto">In progress</span>}
                  {giftKit?.status === 'packaging' && <span className="text-xs text-yellow-400/60 ml-auto">Packaging</span>}
                  {giftKit?.status === 'shipped' && <span className="text-xs text-green-400/60 ml-auto">✓ Done</span>}
                  {giftKit?.status === 'delivered' && <span className="text-xs text-green-400/60 ml-auto">✓ Delivered</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${giftKit?.status === 'packaging' || giftKit?.status === 'shipped' || giftKit?.status === 'delivered' ? 'bg-green-400' : 'bg-white/20'}`} />
                  <span className="text-sm text-white/80">Packaging</span>
                  {giftKit?.status === 'packaging' && <span className="text-xs text-yellow-400/60 ml-auto">In progress</span>}
                  {giftKit?.status === 'shipped' && <span className="text-xs text-green-400/60 ml-auto">✓ Done</span>}
                  {giftKit?.status === 'delivered' && <span className="text-xs text-green-400/60 ml-auto">✓ Delivered</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${giftKit?.status === 'shipped' || giftKit?.status === 'delivered' ? 'bg-green-400' : 'bg-white/20'}`} />
                  <span className="text-sm text-white/80">Shipped</span>
                  {giftKit?.status === 'shipped' && <span className="text-xs text-green-400/60 ml-auto">✓ Done</span>}
                  {giftKit?.status === 'delivered' && <span className="text-xs text-green-400/60 ml-auto">✓ Delivered</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${giftKit?.status === 'delivered' ? 'bg-green-400' : 'bg-white/20'}`} />
                  <span className="text-sm text-white/80">Delivered</span>
                  {giftKit?.status === 'delivered' && <span className="text-xs text-green-400/60 ml-auto">✓ Delivered</span>}
                </div>
                {giftKit?.tracking_number && (
                  <div className="mt-2 text-xs text-white/30">Tracking: {giftKit.tracking_number}</div>
                )}
                {!giftKit && (
                  <div className="text-sm text-white/40">Your gift kit will be processed after approval.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
