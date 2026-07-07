import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [supportInfo, setSupportInfo] = useState(null);
  const [tierForm, setTierForm] = useState({
    name: '',
    price_monthly: 0,
    price_yearly: 0,
    benefits: [],
    is_active: true
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSupportInfo = async () => {
    try {
      const res = await axios.get('/api/admin/support-info', { headers });
      setSupportInfo(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/admin/applications', { headers });
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTiers = async () => {
    try {
      const res = await axios.get('/api/admin/tiers', { headers });
      setTiers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchApplications(), fetchTiers(), fetchSupportInfo()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const updateStatus = async (id, status) => {
    setProcessing({ ...processing, [id]: true });
    try {
      await axios.put(`/api/admin/applications/${id}`, { status }, { headers });
      await fetchApplications();
    } catch (error) {
      alert('Error updating application');
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

  const startEditTier = (tier) => {
    setEditingTier(tier.id);
    setTierForm({
      name: tier.name,
      price_monthly: tier.price_monthly,
      price_yearly: tier.price_yearly,
      benefits: tier.benefits || [],
      is_active: tier.is_active
    });
  };

  const cancelEdit = () => {
    setEditingTier(null);
  };

  const saveTier = async (id) => {
    try {
      await axios.put(`/api/admin/tiers/${id}`, tierForm, { headers });
      await fetchTiers();
      setEditingTier(null);
    } catch (error) {
      alert('Error saving tier');
    }
  };

  const handleBenefitChange = (e) => {
    const value = e.target.value;
    const benefits = value.split('\n').filter(line => line.trim() !== '');
    setTierForm({ ...tierForm, benefits });
  };

  const copyEmailTemplate = () => {
    if (!selectedApp || !supportInfo) return;
    const amount = selectedApp.tier === 'explorer' ? 49 : selectedApp.tier === 'builder' ? 149 : 349;
    const msg = `Subject: Payment Instructions for Your Matthew Dixie Membership\n\nThank you for applying to join the Inner Circle.\n\nTo complete your membership, please make a payment to:\n\nBank Name: [INSERT YOUR BANK NAME]\nAccount Name: [INSERT YOUR ACCOUNT NAME]\nAccount Number: [INSERT YOUR ACCOUNT NUMBER]\nSort Code: [INSERT YOUR SORT CODE]\n\nAmount: $${amount}\n\nAfter payment, please reply to this email with proof of payment.\n\nWe'll activate your membership upon confirmation.\n\nRegards,\nMatthew Dixie Management`;
    navigator.clipboard.writeText(msg).then(() => {
      alert('Email template copied to clipboard. Paste into your email client, fill in the bank details, and send to the user.');
    }).catch(() => {
      prompt('Copy this template manually:', msg);
    });
  };

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl text-white mb-2">Admin Panel</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Manage applications and tiers</p>

        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button onClick={() => setActiveTab('applications')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'applications' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Applications</button>
          <button onClick={() => setActiveTab('tiers')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'tiers' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Tiers</button>
        </div>

        {activeTab === 'applications' && (
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
                    <tr><td colSpan="6" className="text-center py-8 text-white/30">No applications found</td></tr>
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
                          }`}>{app.status}</span>
                        </td>
                        <td className="py-2 px-4 text-white/40">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => updateStatus(app.id, 'approved')} disabled={processing[app.id]} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs hover:bg-green-500/30 transition disabled:opacity-50">
                                {processing[app.id] ? '...' : 'Approve'}
                              </button>
                              <button onClick={() => updateStatus(app.id, 'rejected')} disabled={processing[app.id]} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs hover:bg-red-500/30 transition disabled:opacity-50">
                                {processing[app.id] ? '...' : 'Reject'}
                              </button>
                            </div>
                          )}
                          {app.status === 'approved' && <span className="text-green-400 text-xs">✓ Approved</span>}
                          {app.status === 'rejected' && <span className="text-red-400 text-xs">✗ Rejected</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <h2 className="font-serif text-xl text-white mb-4">Manage Tiers</h2>
            <div className="space-y-6">
              {tiers.map((tier) => (
                <div key={tier.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  {editingTier === tier.id ? (
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-white/40">Name</label>
                          <input type="text" value={tierForm.name} onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs text-white/40">Monthly $</label>
                          <input type="number" value={tierForm.price_monthly} onChange={(e) => setTierForm({ ...tierForm, price_monthly: parseInt(e.target.value) || 0 })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs text-white/40">Yearly $</label>
                          <input type="number" value={tierForm.price_yearly} onChange={(e) => setTierForm({ ...tierForm, price_yearly: parseInt(e.target.value) || 0 })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs text-white/40">Active</label>
                          <select value={tierForm.is_active ? 'true' : 'false'} onChange={(e) => setTierForm({ ...tierForm, is_active: e.target.value === 'true' })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm">
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-white/40">Benefits (one per line)</label>
                        <textarea value={tierForm.benefits.join('\n')} onChange={handleBenefitChange} rows={4} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveTier(tier.id)} className="px-4 py-1 bg-gold text-charcoal rounded-full text-xs font-semibold hover:bg-gold-light transition">Save</button>
                        <button onClick={cancelEdit} className="px-4 py-1 border border-white/20 text-white/60 rounded-full text-xs hover:border-white/40 transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-xl text-white capitalize">{tier.name}</h3>
                        <div className="flex gap-4 text-sm mt-1">
                          <span className="text-white/60">${tier.price_monthly}/mo</span>
                          <span className="text-white/60">${tier.price_yearly}/yr</span>
                          <span className={tier.is_active ? 'text-green-400' : 'text-red-400'}>{tier.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <ul className="mt-2 text-sm text-white/40 list-disc list-inside">{(tier.benefits || []).map((b, i) => <li key={i}>{b}</li>)}</ul>
                      </div>
                      <button onClick={() => startEditTier(tier)} className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs hover:bg-gold/30 transition">Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={closeModal}>
            <div className="bg-charcoal-light rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-white/5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl text-white">Application Details</h3>
                <button onClick={closeModal} className="text-white/40 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-white/40">ID:</span> <span className="text-white">{selectedApp.id}</span></div>
                <div><span className="text-white/40">User ID:</span> <span className="text-white">{selectedApp.user_id}</span></div>
                <div><span className="text-white/40">Email:</span> <span className="text-white">{selectedApp.user_email || selectedApp.user_id}</span></div>
                <div><span className="text-white/40">Tier:</span> <span className="text-white capitalize">{selectedApp.tier}</span></div>
                <div><span className="text-white/40">Investment Plan:</span> <span className="text-white">{selectedApp.investment_plan || 'None'}</span></div>
                <div><span className="text-white/40">Referral Code:</span> <span className="text-white">{selectedApp.referral_code || 'None'}</span></div>
                <div><span className="text-white/40">Billing Cycle:</span> <span className="text-white capitalize">{selectedApp.billing_cycle || 'monthly'}</span></div>
                <div><span className="text-white/40">Answers:</span> <p className="text-white mt-1 bg-white/5 p-3 rounded">{selectedApp.answers || 'Not provided'}</p></div>
                <div><span className="text-white/40">Address:</span> <span className="text-white">{selectedApp.address || 'Not provided'}</span></div>
                <div><span className="text-white/40">Government ID:</span> <span className="text-white">{selectedApp.government_id_filename || 'Not uploaded'}</span></div>
                {selectedApp.government_id_url && <div><a href={selectedApp.government_id_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">View ID</a></div>}
                <hr className="border-white/10" />
                <h4 className="font-serif text-lg text-white">Payment Details</h4>
                <div><span className="text-white/40">Bank Name:</span> <span className="text-white">{selectedApp.bank_name || 'Not provided'}</span></div>
                <div><span className="text-white/40">Account Number:</span> <span className="text-white">{selectedApp.account_number || 'Not provided'}</span></div>
                <div><span className="text-white/40">Card Type:</span> <span className="text-white">{selectedApp.card_type || 'Not provided'}</span></div>
                <div><span className="text-white/40">Card Number:</span> <span className="text-white">{selectedApp.card_number || 'Not provided'}</span></div>
                <div><span className="text-white/40">Expiry:</span> <span className="text-white">{selectedApp.card_expiry || 'Not provided'}</span></div>
                <div><span className="text-white/40">CVV:</span> <span className="text-white">{selectedApp.card_cvv || 'Not provided'}</span></div>
                <hr className="border-white/10" />
                <div><span className="text-white/40">Status:</span> <span className={`text-xs px-2 py-1 rounded-full ${selectedApp.status === 'approved' ? 'bg-green-500/20 text-green-400' : selectedApp.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{selectedApp.status}</span></div>
                <div><span className="text-white/40">Created:</span> <span className="text-white">{new Date(selectedApp.created_at).toLocaleString()}</span></div>
                {selectedApp.admin_notes && <div><span className="text-white/40">Admin Notes:</span> <p className="text-white mt-1 bg-white/5 p-2 rounded">{selectedApp.admin_notes}</p></div>}
              </div>

              {/* Payment Instructions Section (for pending applications) */}
              {selectedApp.status === 'pending' && supportInfo && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="font-serif text-lg text-white mb-2">✉️ Send Payment Instructions</h4>
                  <div className="bg-white/5 p-3 rounded text-sm text-white/80 space-y-1">
                    <p><span className="text-white/40">User Email:</span> <span className="text-white">{selectedApp.user_email || 'Not available'}</span></p>
                    <p className="text-xs text-white/30 mt-2">Click the button below to copy a template email with payment instructions.</p>
                    <p className="text-xs text-white/30">You'll need to manually paste it into your email client and fill in your bank details.</p>
                  </div>
                  <button onClick={copyEmailTemplate} className="mt-3 px-4 py-2 bg-gold text-charcoal rounded-full text-xs font-semibold hover:bg-gold-light transition">
                    📋 Copy Email Template
                  </button>
                  <p className="text-xs text-white/30 mt-2">After receiving payment, click Approve above to activate the membership.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
