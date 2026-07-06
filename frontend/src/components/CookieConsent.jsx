import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-charcoal-light border-t border-gold/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-warm-sand-light opacity-80">
          We use cookies to improve your experience. By continuing, you agree to our 
          <Link to="/privacy" className="text-gold hover:text-gold-light transition ml-1">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-gold text-charcoal rounded-full text-sm font-semibold hover:bg-gold-light transition"
          >
            Accept
          </button>
          <Link
            to="/privacy"
            className="px-6 py-2 border border-white/20 text-white rounded-full text-sm hover:border-gold hover:text-gold transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
