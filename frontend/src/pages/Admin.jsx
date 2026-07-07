import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    fetchApplications();
  }, [navigate]);

  const updateStatus = async (id, status) => {
    setProcessing({ ...processing, [id]: true });
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApplications();
    } catch (error) {
      console.error(error);
      alert('Error updating application: ' + (error.response?.data?.error || error.message));
    } finally {
      setProcessing({ ...processing, [id]: false });
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl text-white mb-2">Admin Panel</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Manage applications and users</p>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-white">Applications</h2>
            <span className="text-sm text-white/40">{applications.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-4 text-white/40">ID</th>
                  <th className="text-left py-2 px-4 text-white/40">User</th>
                  <th className="text-left py-2 px-4 text-white/40">Tier</th>
                  <th className="text-left py-2 px-4 text-white/40">Status</th>
                  <th className="text-left py-2 px-4 text-white/40">Date</th>
                  <th className="text-left py-2 px-4 text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-white/30">No applications found</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition" onClick={() => openDetails(app)}>
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
                      <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(app.id, 'approved')}
                              disabled={processing[app.id]}
                              className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs hover:bg-green-500/30 transition disabled:opacity-50"
                            >
                              {processing[app.id] ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'rejected')}
                              disabled={processing[app.id]}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs hover:bg-red-500/30 transition disabled:opacity-50"
                            >
                              {processing[app.id] ? '...' : 'Reject'}
                            </button>
                          </div>
                        )}
                        {app.status === 'approved' && (
                          <span className="text-green-400 text-xs">✓ Approved</span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="text-red-400 text-xs">✗ Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={closeModal}>
          <div className="bg-charcoal-light rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-white/5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl text-white">Application Details</h3>
              <button onClick={closeModal} className="text-white/40 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="space-y-4 text-sm">
              <div><span className="text-white/40">ID:</span> <span className="text-white">{selectedApp.id}</span></div>
              <div><span className="text-white/40">User ID:</span> <span className="text-white">{selectedApp.user_id}</span></div>
              <div><span className="text-white/40">Tier:</span> <span className="text-white capitalize">{selectedApp.tier}</span></div>
              <div><span className="text-white/40">Investment Plan:</span> <span className="text-white">{selectedApp.investment_plan || 'None'}</span></div>
              <div><span className="text-white/40">Referral Code:</span> <span className="text-white">{selectedApp.referral_code || 'None'}</span></div>
              <div><span className="text-white/40">Billing Cycle:</span> <span className="text-white capitalize">{selectedApp.billing_cycle || 'monthly'}</span></div>
              <div><span className="text-white/40">Answers:</span> <p className="text-white mt-1 bg-white/5 p-3 rounded">{selectedApp.answers || 'Not provided'}</p></div>
              <div><span className="text-white/40">Address:</span> <span className="text-white">{selectedApp.address || 'Not provided'}</span></div>
              <div><span className="text-white/40">Government ID:</span> <span className="text-white">{selectedApp.government_id_filename || 'Not uploaded'}</span></div>
              {selectedApp.government_id_url && (
                <div><a href={selectedApp.government_id_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">View ID</a></div>
              )}
              <hr className="border-white/10" />
              <h4 className="font-serif text-lg text-white">Payment Details</h4>
              <div><span className="text-white/40">Bank Name:</span> <span className="text-white">{selectedApp.bank_name || 'Not provided'}</span></div>
              <div><span className="text-white/40">Account Number:</span> <span className="text-white">{selectedApp.account_number || 'Not provided'}</span></div>
              <div><span className="text-white/40">Card Type:</span> <span className="text-white">{selectedApp.card_type || 'Not provided'}</span></div>
              <div><span className="text-white/40">Card Number:</span> <span className="text-white">{selectedApp.card_number || 'Not provided'}</span></div>
              <div><span className="text-white/40">Expiry:</span> <span className="text-white">{selectedApp.card_expiry || 'Not provided'}</span></div>
              <div><span className="text-white/40">CVV:</span> <span className="text-white">{selectedApp.card_cvv || 'Not provided'}</span></div>
              <hr className="border-white/10" />
              <div><span className="text-white/40">Status:</span> <span className={`text-xs px-2 py-1 rounded-full ${
                selectedApp.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                selectedApp.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>{selectedApp.status}</span></div>
              <div><span className="text-white/40">Created:</span> <span className="text-white">{new Date(selectedApp.created_at).toLocaleString()}</span></div>
              {selectedApp.admin_notes && <div><span className="text-white/40">Admin Notes:</span> <p className="text-white mt-1 bg-white/5 p-2 rounded">{selectedApp.admin_notes}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
