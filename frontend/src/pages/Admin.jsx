import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import api from '../api';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Slot configuration
const SLOTS = [
  { key: 'hero_background', label: 'Hero Background', siteKey: 'hero_background_image' },
  { key: 'profile_image', label: 'Profile Image (Press)', siteKey: 'profile_image_url' },
  { key: 'press_image_1', label: 'Press Image 1', siteKey: 'press_image_1_url' },
  { key: 'press_image_2', label: 'Press Image 2', siteKey: 'press_image_2_url' },
  { key: 'press_image_3', label: 'Press Image 3', siteKey: 'press_image_3_url' },
  { key: 'about_image', label: 'About Image', siteKey: 'about_image_url' },
];

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [users, setUsers] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [supportInfo, setSupportInfo] = useState(null);
  const [pressContent, setPressContent] = useState({});
  const [editingPressKey, setEditingPressKey] = useState(null);
  const [pressForm, setPressForm] = useState({ key: '', value: '' });
  const [uploading, setUploading] = useState(false);
  // User modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    title: '',
    type: 'image',
    category: '',
    file: null,
    is_featured: false
  });
  const [tierForm, setTierForm] = useState({
    name: '',
    price_monthly: 0,
    price_yearly: 0,
    benefits: [],
    is_active: true
  });

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSupportInfo = async () => {
    try {
      const res = await api.get('/admin/support-info', { headers });
      setSupportInfo(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/applications', { headers });
      setApplications(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchTiers = async () => {
    try {
      const res = await api.get('/admin/tiers', { headers });
      setTiers(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', { headers });
      setUsers(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchMedia = async () => {
    try {
      const res = await api.get('/admin/media', { headers });
      setMedia(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchPressContent = async () => {
    try {
      const res = await api.get('/admin/site-content', { headers });
      setPressContent(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchApplications(), fetchTiers(), fetchUsers(), fetchSupportInfo(), fetchPressContent(), fetchMedia()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // --- Application functions ---
  const updateStatus = async (id, status) => {
    setProcessing({ ...processing, [id]: true });
    try {
      await api.put(`/admin/applications/${id}`, { status }, { headers });
      await fetchApplications();
    } catch (error) { alert('Error updating application'); }
    finally { setProcessing({ ...processing, [id]: false }); }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  // --- Tier functions ---
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
  const cancelEdit = () => setEditingTier(null);
  const saveTier = async (id) => {
    try {
      await api.put(`/admin/tiers/${id}`, tierForm, { headers });
      await fetchTiers();
      setEditingTier(null);
    } catch (error) { alert('Error saving tier'); }
  };
  const handleBenefitChange = (e) => {
    const value = e.target.value;
    const benefits = value.split('\n').filter(line => line.trim() !== '');
    setTierForm({ ...tierForm, benefits });
  };

  // --- Press content functions ---
  const startEditPress = (key, value) => {
    setEditingPressKey(key);
    setPressForm({ key, value: value || '' });
  };
  const cancelPressEdit = () => {
    setEditingPressKey(null);
    setPressForm({ key: '', value: '' });
  };
  const savePressContent = async () => {
    try {
      await api.put(`/admin/site-content/${pressForm.key}`, { value: pressForm.value }, { headers });
      await fetchPressContent();
      setEditingPressKey(null);
      setPressForm({ key: '', value: '' });
    } catch (error) { alert('Error saving press content'); }
  };

  // --- Email template copy ---
  const copyEmailTemplate = () => {
    if (!selectedApp || !supportInfo) return;
    const amount = selectedApp.tier === 'explorer' ? 49 : selectedApp.tier === 'builder' ? 149 : 349;
    const msg = `Subject: Payment Instructions for Your Matthew Dixie Membership\n\nThank you for applying to join the Inner Circle.\n\nTo complete your membership, please make a payment to:\n\nBank Name: [INSERT YOUR BANK NAME]\nAccount Name: [INSERT YOUR ACCOUNT NAME]\nAccount Number: [INSERT YOUR ACCOUNT NUMBER]\nSort Code: [INSERT YOUR SORT CODE]\n\nAmount: $${amount}\n\nAfter payment, please reply to this email with proof of payment.\n\nWe'll activate your membership upon confirmation.\n\nRegards,\nMatthew Dixie Management`;
    navigator.clipboard.writeText(msg).then(() => {
      alert('Email template copied to clipboard. Paste into your email client, fill in the bank details, and send to the user.');
    }).catch(() => { prompt('Copy this template manually:', msg); });
  };

  // --- User functions ---
  const updateUserTier = async (userId, tier) => {
    try {
      await api.put(`/admin/users/${userId}/tier`, { tier }, { headers });
      await fetchUsers();
      alert('User tier updated successfully');
    } catch (error) { alert('Error updating user tier'); }
  };

  const approveUser = async (userId) => {
    if (!confirm('Approve this user? They will be able to log in and access the dashboard.')) return;
    try {
      await api.put(`/admin/users/${userId}/approve`, {}, { headers });
      await fetchUsers();
      setSelectedUser(null);
      setShowUserModal(false);
      alert('User approved successfully!');
    } catch (error) {
      alert('Error approving user: ' + error.message);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };
  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // --- Media functions ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaForm({ ...mediaForm, file });
    }
  };

  const handleMediaUpload = async (e) => {
    e.preventDefault();
    if (!mediaForm.file) {
      alert('Please select a file');
      return;
    }
    if (!mediaForm.category) {
      alert('Please select a slot');
      return;
    }
    setUploading(true);
    try {
      const file = mediaForm.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const mediaData = {
        title: mediaForm.title || file.name,
        type: mediaForm.type,
        url: publicUrl,
        category: mediaForm.category,
        is_featured: mediaForm.is_featured
      };

      const res = await api.post('/admin/media', mediaData, { headers });
      setMedia([res.data, ...media]);

      // Update site content if slot matches
      const slot = SLOTS.find(s => s.key === mediaForm.category);
      if (slot) {
        try {
          await api.put(`/admin/site-content/${slot.siteKey}`, { value: publicUrl }, { headers });
          await fetchPressContent();
        } catch (updateErr) {
          console.warn('Media saved but failed to update site_content:', updateErr);
          alert('Media uploaded, but the corresponding slot was not updated automatically. You can set it manually in the Press tab.');
        }
      }

      setMediaForm({ title: '', type: 'image', category: '', file: null, is_featured: false });
      document.querySelector('input[type="file"]').value = '';
      alert('Media uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Error uploading media: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id) => {
    if (!confirm('Delete this media?')) return;
    try {
      await api.delete(`/admin/media/${id}`, { headers });
      setMedia(media.filter(m => m.id !== id));
    } catch (error) {
      alert('Error deleting media');
    }
  };

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl text-white mb-2">Admin Panel</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Manage applications, tiers, users, media, and content</p>

        <div className="flex flex-wrap gap-4 mb-6 border-b border-white/10">
          <button onClick={() => setActiveTab('applications')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'applications' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Applications</button>
          <button onClick={() => setActiveTab('tiers')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'tiers' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Tiers</button>
          <button onClick={() => setActiveTab('users')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'users' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Users</button>
          <button onClick={() => setActiveTab('press')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'press' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Press</button>
          <button onClick={() => setActiveTab('media')} className={`pb-2 px-1 text-sm font-semibold border-b-2 transition ${activeTab === 'media' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>Media</button>
        </div>

        {/* Applications Tab */}
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

        {/* Tiers Tab */}
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

        {/* Users Tab (Clickable) */}
        {activeTab === 'users' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-white">Users</h2>
              <span className="text-sm text-white/40">{users.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-4 text-white/40">ID</th>
                    <th className="text-left py-2 px-4 text-white/40">Name</th>
                    <th className="text-left py-2 px-4 text-white/40">Email</th>
                    <th className="text-left py-2 px-4 text-white/40">Role</th>
                    <th className="text-left py-2 px-4 text-white/40">Status</th>
                    <th className="text-left py-2 px-4 text-white/40">Tier</th>
                    <th className="text-left py-2 px-4 text-white/40">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-8 text-white/30">No users found</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition" onClick={() => openUserDetails(user)}>
                        <td className="py-2 px-4 text-white/60">{user.id}</td>
                        <td className="py-2 px-4 text-white/60">{user.name}</td>
                        <td className="py-2 px-4 text-white/60">{user.email}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-gold/20 text-gold' :
                            user.role === 'support' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-white/10 text-white/60'
                          }`}>{user.role}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                            'bg-white/10 text-white/40'
                          }`}>{user.status || 'pending'}</span>
                        </td>
                        <td className="py-2 px-4 text-white/60 capitalize">{user.membership_tier || 'None'}</td>
                        <td className="py-2 px-4 text-white/40">{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Press Tab */}
        {activeTab === 'press' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-white">Press Content</h2>
              <span className="text-sm text-white/40">Manage press kit content</span>
            </div>
            <div className="space-y-4">
              {Object.entries(pressContent).filter(([key]) => key.startsWith('press_') || key.startsWith('hero_') || key.startsWith('about_')).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/5">
                  {editingPressKey === key ? (
                    <div className="space-y-2">
                      <label className="block text-xs text-white/40">{key}</label>
                      <textarea
                        value={pressForm.value}
                        onChange={(e) => setPressForm({ ...pressForm, value: e.target.value })}
                        rows={4}
                        className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={savePressContent} className="px-4 py-1 bg-gold text-charcoal rounded-full text-xs font-semibold hover:bg-gold-light transition">Save</button>
                        <button onClick={cancelPressEdit} className="px-4 py-1 border border-white/20 text-white/60 rounded-full text-xs hover:border-white/40 transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-white/40">{key}</div>
                        <div className="text-white/80 text-sm whitespace-pre-line">{value || '(empty)'}</div>
                      </div>
                      <button onClick={() => startEditPress(key, value)} className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs hover:bg-gold/30 transition ml-4 flex-shrink-0">Edit</button>
                    </div>
                  )}
                </div>
              ))}
              {Object.keys(pressContent).filter(k => k.startsWith('press_') || k.startsWith('hero_') || k.startsWith('about_')).length === 0 && (
                <p className="text-white/30 text-sm">No content found. Add keys like hero_background_image, press_image_1, etc.</p>
              )}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <h2 className="font-serif text-xl text-white mb-4">Media Library (Slot‑Based Upload)</h2>
            
            <form onSubmit={handleMediaUpload} className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={mediaForm.title} 
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })} 
                    className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" 
                    placeholder="Image title"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Type</label>
                  <select 
                    value={mediaForm.type} 
                    onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })} 
                    className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-2">
                <label className="block text-xs text-white/40 mb-1">Slot (where to place this media)</label>
                <select 
                  value={mediaForm.category} 
                  onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })} 
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm"
                >
                  <option value="">Select a slot...</option>
                  {SLOTS.map((slot) => (
                    <option key={slot.key} value={slot.key}>{slot.label}</option>
                  ))}
                </select>
                <p className="text-xs text-white/30 mt-1">The media will automatically be placed in the selected slot.</p>
              </div>
              
              <div className="mt-2">
                <label className="block text-xs text-white/40 mb-1">Upload File</label>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleFileSelect} 
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gold file:text-charcoal file:font-semibold hover:file:bg-gold-light cursor-pointer"
                />
                <p className="text-xs text-white/30 mt-1">Supported: JPG, PNG, GIF, MP4, WebM</p>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm text-white/60">
                  <input 
                    type="checkbox" 
                    checked={mediaForm.is_featured} 
                    onChange={(e) => setMediaForm({ ...mediaForm, is_featured: e.target.checked })} 
                    className="accent-gold" 
                  />
                  Featured
                </label>
                <button 
                  type="submit" 
                  disabled={uploading || !mediaForm.file} 
                  className="px-4 py-2 bg-gold text-charcoal rounded-full text-xs font-semibold hover:bg-gold-light transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Media'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-4 gap-4">
              {media.map((item) => {
                const slot = SLOTS.find(s => s.key === item.category);
                return (
                  <div key={item.id} className="bg-white/5 rounded-xl p-3 border border-white/5 relative group">
                    {item.type === 'image' && <img src={item.url} alt={item.title} className="w-full h-32 object-cover rounded" />}
                    {item.type === 'video' && <div className="w-full h-32 bg-black/50 rounded flex items-center justify-center text-2xl">🎬</div>}
                    <div className="mt-2">
                      <div className="text-xs text-white/80 truncate">{item.title || 'Untitled'}</div>
                      <div className="text-xs text-white/30 truncate">{slot ? slot.label : item.category || 'No slot'}</div>
                      {item.is_featured && <span className="text-xs text-gold">⭐ Featured</span>}
                    </div>
                    <button onClick={() => deleteMedia(item.id)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                );
              })}
              {media.length === 0 && <p className="text-white/30 text-sm col-span-4 text-center py-8">No media uploaded yet.</p>}
            </div>
          </div>
        )}

        {/* --- Application Details Modal --- */}
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
              {selectedApp.status === 'pending' && supportInfo && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="font-serif text-lg text-white mb-2">✉️ Send Payment Instructions</h4>
                  <div className="bg-white/5 p-3 rounded text-sm text-white/80 space-y-1">
                    <p><span className="text-white/40">User Email:</span> <span className="text-white">{selectedApp.user_email || 'Not available'}</span></p>
                    <p className="text-xs text-white/30 mt-2">Click the button below to copy a template email with payment instructions.</p>
                  </div>
                  <button onClick={copyEmailTemplate} className="mt-3 px-4 py-2 bg-gold text-charcoal rounded-full text-xs font-semibold hover:bg-gold-light transition">
                    📋 Copy Email Template
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- User Details Modal (Clickable) --- */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={closeUserModal}>
            <div className="bg-charcoal-light rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-white/5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl text-white">User Details</h3>
                <button onClick={closeUserModal} className="text-white/40 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-white/40">ID:</span> <span className="text-white">{selectedUser.id}</span></div>
                <div><span className="text-white/40">Name:</span> <span className="text-white">{selectedUser.name}</span></div>
                <div><span className="text-white/40">Email:</span> <span className="text-white">{selectedUser.email}</span></div>
                <div><span className="text-white/40">Role:</span> <span className="text-white">{selectedUser.role}</span></div>
                <div><span className="text-white/40">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedUser.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    selectedUser.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    selectedUser.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                    'bg-white/10 text-white/40'
                  }`}>{selectedUser.status || 'pending'}</span>
                </div>
                <div><span className="text-white/40">Tier:</span> <span className="text-white capitalize">{selectedUser.membership_tier || 'None'}</span></div>
                <div><span className="text-white/40">Joined:</span> <span className="text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span></div>
                <div><span className="text-white/40">Phone:</span> <span className="text-white">{selectedUser.phone || 'Not provided'}</span></div>
                <hr className="border-white/10" />
                {selectedUser.status === 'pending' && (
                  <div className="mt-2">
                    <button 
                      onClick={() => approveUser(selectedUser.id)}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold hover:bg-green-500/30 transition"
                    >
                      ✅ Approve User
                    </button>
                    <p className="text-xs text-white/30 mt-1">Approving this user will allow them to log in and access the dashboard.</p>
                  </div>
                )}
                {selectedUser.status === 'active' && (
                  <div className="mt-2">
                    <span className="text-green-400 text-sm">✓ User is active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
