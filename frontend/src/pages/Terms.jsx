import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-charcoal text-warm-sand pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-white mb-2">Terms of Service</h1>
        <div className="w-16 h-0.5 bg-gold mb-6" />
        <p className="text-white/40 text-sm mb-8">Last updated: July 6, 2026</p>

        <div className="space-y-6 text-warm-sand-light opacity-80 leading-relaxed">

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Matthew Dixie website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">2. Membership Application</h2>
          <p>
            Membership is by application only. Submission does not guarantee approval. We reserve the right to accept or reject any application at our sole discretion.
          </p>
          <p>
            <strong>Government ID Verification:</strong> You agree to provide valid government-issued identification for verification purposes. False information may result in rejection or termination.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">3. Payment Terms</h2>
          <p>
            <strong>Manual Payment Process:</strong> After approval, payment instructions will be sent via email or WhatsApp. Payments are processed offline. We do not store your card details for future transactions.
          </p>
          <p>
            <strong>Billing Cycle:</strong> Memberships are billed monthly or yearly depending on your selected tier. You may cancel at any time, but no refunds are provided for partial periods.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">4. Investment Plans</h2>
          <p>
            Investment plans are separate from membership tiers. They represent funding for specific projects and initiatives. Past performance does not guarantee future results.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">5. Code of Conduct</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect all members and staff</li>
            <li>Do not share confidential community information</li>
            <li>Do not engage in harassment or discriminatory behavior</li>
            <li>Comply with all applicable laws</li>
          </ul>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">6. Fan Card</h2>
          <p>
            The Fan Card is a digital and physical token of membership. It remains the property of Matthew Dixie and may be revoked if these terms are violated.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">7. Gift Kit</h2>
          <p>
            The Gift Kit is a welcome package for approved members. Shipping times vary by location. We are not responsible for lost or damaged packages.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your membership at any time for violation of these terms or for any other reason at our discretion.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">9. Limitation of Liability</h2>
          <p>
            Matthew Dixie is not liable for any indirect, incidental, or consequential damages arising from your use of our services.
          </p>

          <h2 className="font-serif text-xl text-white opacity-100 mt-8">10. Contact</h2>
          <p>
            Questions about these terms? Contact us at{' '}
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

export default Terms;
