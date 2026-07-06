import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 border-2 border-gold rounded-full flex items-center justify-center text-gold text-sm font-serif">MD</span>
          <span className="text-white font-serif text-lg">Matthew Dixie</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/tiers" className="text-white/60 hover:text-gold transition">Tiers</Link>
          <Link to="/investments" className="text-white/60 hover:text-gold transition">Invest</Link>
          <Link to="/apply" className="text-white/60 hover:text-gold transition">Apply</Link>
          <Link to="/blog" className="text-white/60 hover:text-gold transition">Blog</Link>
        </div>

        <div className="flex items-center gap-3">
          {token && user ? (
            <>
              <Link to="/dashboard" className="text-white/60 hover:text-gold transition text-sm">Dashboard</Link>
              <button onClick={handleLogout} className="px-4 py-2 text-sm border border-white/20 text-white rounded-full hover:border-gold hover:text-gold transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/60 hover:text-gold transition text-sm">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-gold text-charcoal rounded-full text-sm font-semibold hover:bg-gold-light transition">Join Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
