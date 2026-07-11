import { Link } from 'react-router-dom';

const Pending = () => {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 rounded-2xl p-8 border border-white/5 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="font-serif text-3xl text-white mb-2">Account Pending</h2>
        <p className="text-warm-sand-light opacity-70">
          Your account is pending approval. You will receive a notification via email when your account is approved.
        </p>
        <p className="text-sm text-white/40 mt-4">
          If you have any questions, please contact support.
        </p>
        <Link to="/" className="inline-block mt-6 px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Pending;
