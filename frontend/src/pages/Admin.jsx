import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data);
      } catch (error) {
        console.error(error);
        alert('You must be an admin to view this page.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl text-white mb-2">Admin Panel</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Manage applications and users</p>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h2 className="font-serif text-xl text-white mb-4">Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-4 text-white/40">ID</th>
                  <th className="text-left py-2 px-4 text-white/40">User</th>
                  <th className="text-left py-2 px-4 text-white/40">Tier</th>
                  <th className="text-left py-2 px-4 text-white/40">Status</th>
                  <th className="text-left py-2 px-4 text-white/40">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-white/5">
                    <td className="py-2 px-4 text-white/60">{app.id}</td>
                    <td className="py-2 px-4 text-white/60">{app.user_id}</td>
                    <td className="py-2 px-4 text-white/60 capitalize">{app.tier}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-white/40">{new Date(app.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
