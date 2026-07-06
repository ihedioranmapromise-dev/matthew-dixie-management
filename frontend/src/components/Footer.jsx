import { Link } from 'react-router-dom';

const Footer = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  return (
    <footer className="bg-charcoal-light border-t border-white/5 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-white/20 text-sm">
            &copy; {new Date().getFullYear()} Matthew Dixie. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/privacy" className="text-white/20 hover:text-gold transition">Privacy Policy</Link>
          <Link to="/terms" className="text-white/20 hover:text-gold transition">Terms of Service</Link>
          {isAdmin && (
            <Link to="/admin" className="text-gold hover:text-gold-light transition font-semibold">
              ⚙️ Admin Panel
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
