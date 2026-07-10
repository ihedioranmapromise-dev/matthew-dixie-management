[import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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
  const [mediaForm, setMediaForm] = useState({
    title: '',
    type: 'image',
    url: '',
    thumbnail_url: '',
    category: '',
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

  // ... (rest of existing functions)

  // Media upload
  const handleMediaUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const res = await api.post('/admin/media', mediaForm, { headers });
      setMedia([res.data, ...media]);
      setMediaForm({ title: '', type: 'image', url: '', thumbnail_url: '', category: '', is_featured: false });
      alert('Media added successfully');
    } catch (error) {
      alert('Error adding media');
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

  // ... (rest of existing functions)

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

        {/* Existing tabs... */}

        {activeTab === 'media' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <h2 className="font-serif text-xl text-white mb-4">Media Library</h2>
            
            {/* Upload Form */}
            <form onSubmit={handleMediaUpload} className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Title</label>
                  <input type="text" value={mediaForm.title} onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Type</label>
                  <select value={mediaForm.type} onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs text-white/40 mb-1">File URL</label>
                <input type="text" value={mediaForm.url} onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" placeholder="https://..." />
              </div>
              <div className="mt-2">
                <label className="block text-xs text-white/40 mb-1">Category</label>
                <input type="text" value={mediaForm.category} onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm text-white/60">
                  <input type="checkbox" checked={mediaForm.is_featured} onChange={(e) => setMediaForm({ ...mediaForm, is_featured: e.target.checked })} className="accent-gold" />
                  Featured
                </label>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-gold text-charcoal rounded-full text-xs font-semibold hover:bg-gold-light transition disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Add Media'}
                </button>
              </div>
            </form>

            {/* Media List */}
            <div className="grid grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-3 border border-white/5 relative group">
                  {item.type === 'image' && <img src={item.url} alt={item.title} className="w-full h-32 object-cover rounded" />}
                  {item.type === 'video' && <div className="w-full h-32 bg-black/50 rounded flex items-center justify-center text-2xl">🎬</div>}
                  <div className="mt-2">
                    <div className="text-xs text-white/80 truncate">{item.title || 'Untitled'}</div>
                    <div className="text-xs text-white/30 truncate">{item.category || 'Uncategorized'}</div>
                    {item.is_featured && <span className="text-xs text-gold">⭐ Featured</span>}
                  </div>
                  <button onClick={() => deleteMedia(item.id)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                </div>
              ))}
              {media.length === 0 && <p className="text-white/30 text-sm col-span-4 text-center py-8">No media uploaded yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;FULL ADMIN.JSX WITH MEDIA TAB – I'll provide the complete code in the next message to avoid truncation]
