import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/public/blog-posts');
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-charcoal text-white pt-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl text-white mb-4">Blog</h1>
        <p className="text-warm-sand-light opacity-70 mb-8">Latest updates and stories from the Inner Circle.</p>
        <div className="grid gap-6">
          {posts.length === 0 ? (
            <p className="text-white/40 text-center py-8">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-gold/20 transition">
                <h3 className="font-serif text-2xl text-white">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-white/40 mt-2">
                  <span>{post.category || 'General'}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                {post.excerpt && <p className="text-warm-sand-light opacity-70 mt-2">{post.excerpt}</p>}
                {post.image_url && <img src={post.image_url} alt={post.title} className="mt-4 rounded-xl max-h-60 w-full object-cover" />}
                {post.content && <p className="text-white/60 mt-4 text-sm whitespace-pre-line">{post.content}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
