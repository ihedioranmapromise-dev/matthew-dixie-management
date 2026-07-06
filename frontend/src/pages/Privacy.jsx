import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-charcoal text-warm-sand pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-white mb-2">Privacy Policy</h1>
        <div className="w-16 h-0.5 bg-gold mb-6" />
        <p className="text-white/40 text-sm mb-8">Last updated: July 6, 2026</p>

        <div className="space-y-6 text-warm-sand-light opacity-80 leading-relaxed">
          <p>
            At Matthew Dixie, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our website and services.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong> When you register, apply for membership, or contact us, we collect your name, email address, phone number, and any other information you provide.
          </p>
          <p>
            <strong>Payment Information:</strong> We collect payment details for verification purposes only. We do not process payments directly. All financial transactions are handled manually after approval.
          </p>
          <p>
            <strong>Government ID:</strong> We collect government-issued identification for verification and security purposes. This is only accessible to authorized admin personnel.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process your membership application</li>
            <li>To communicate with you about your application</li>
            <li>To send updates about the Inner Circle community</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All sensitive data is encrypted.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">Contact Us</h2>
          <p>
            If you have any questions about this policy, please contact us at{' '}
            <a href="mailto:support@matthewdixie.com" className="text-gold hover:text-gold-light transition">
              support@matthewdixie.com
            </a>
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5">
          <Link to="/" className="text-gold hover:text-gold-light transition">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
