import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/admin/login', { password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 rounded-2xl p-8 border border-white/5">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="font-serif text-3xl text-white">Admin Access</h2>
          <p className="text-warm-sand-light opacity-70 text-sm">Enter the admin password to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
