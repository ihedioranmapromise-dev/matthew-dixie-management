import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Apply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: '',
    email: '',
    phone: '',
    address: '',
    government_id_file: null,
    // Step 2: Tier
    tier: '',
    investmentPlan: '',
    // Step 3: Questions
    referralCode: '',
    answers: '',
    // Step 4: Payment Details
    bank_name: '',
    account_number: '',
    card_type: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    billing_cycle: 'monthly'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, government_id_file: e.target.files[0] });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Upload file to Supabase Storage first, then submit application with URL
      // For now, we'll just submit the form data
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/user/application',
        {
          ...formData,
          // Send file URL placeholder for now
          government_id_url: '',
          government_id_filename: formData.government_id_file ? formData.government_id_file.name : ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      setSubmitted(true);
      // Show confirmation
      setStep(5);
    } catch (error) {
      console.error(error);
      alert('Error submitting application: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-warm-sand py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-2">
          Apply for <span className="text-gold">Membership</span>
        </h2>
        <p className="text-center text-warm-sand-light opacity-70 mb-8">
          Complete your application. Each submission is reviewed personally.
        </p>

        {/* Step indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                s === step ? 'bg-gold text-charcoal' : s < step ? 'bg-gold/30 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 ${s < step ? 'bg-gold' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/5">
          {step === 1 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Government ID (Passport, Driver's License, National ID) *</label>
                  <input type="file" name="government_id" onChange={handleFileChange} accept="image/*,.pdf" required
                    className="w-full p-2 rounded bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gold file:text-charcoal file:font-semibold hover:file:bg-gold-light cursor-pointer" />
                  <p className="text-xs text-white/40 mt-1">Upload a clear photo or scan of your government-issued ID.</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Select Your Tier</h3>
              <p className="text-sm text-warm-sand-light opacity-70 mb-4">Choose the membership tier that fits your goals.</p>
              <div className="space-y-3">
                {['explorer', 'builder', 'master'].map((t) => (
                  <label key={t} className={`flex items-center p-4 rounded-lg border cursor-pointer transition ${
                    formData.tier === t ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}>
                    <input type="radio" name="tier" value={t} checked={formData.tier === t} onChange={handleChange} className="mr-3 accent-gold" />
                    <div>
                      <div className="font-semibold text-white capitalize">{t}</div>
                      <div className="text-sm text-white/40">{t === 'explorer' ? '$49/mo' : t === 'builder' ? '$149/mo' : '$349/mo'}</div>
                    </div>
                  </label>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">Investment Plan (optional)</label>
                  <select name="investmentPlan" value={formData.investmentPlan} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none">
                    <option value="">None – Just membership</option>
                    <option value="catalyst">Project Catalyst – $500+</option>
                    <option value="venture_builder">Venture Builder – $2,500+</option>
                    <option value="legacy">Legacy Partner – $10,000+</option>
                    <option value="community">Community Fund – Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                  <select name="billing_cycle" value={formData.billing_cycle} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly (save ~20%)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 border border-white/20 text-white rounded-full hover:border-gold hover:text-gold transition">
                  ← Back
                </button>
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Application Questions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Referral Code (optional)</label>
                  <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Why do you want to join the Inner Circle? *</label>
                  <textarea name="answers" rows="4" value={formData.answers} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none"
                    placeholder="Tell us about your journey, what you're building, and why this community matters to you..." />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 border border-white/20 text-white rounded-full hover:border-gold hover:text-gold transition">
                  ← Back
                </button>
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Payment Details</h3>
              <p className="text-sm text-warm-sand-light opacity-70 mb-4">We'll use these details to verify your identity. No charges will be made at this time.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Name</label>
                  <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <input type="text" name="account_number" value={formData.account_number} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Card Type</label>
                  <select name="card_type" value={formData.card_type} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none">
                    <option value="">Select card type</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input type="text" name="card_number" value={formData.card_number} onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                    <input type="text" name="card_expiry" value={formData.card_expiry} onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input type="password" name="card_cvv" value={formData.card_cvv} onChange={handleChange}
                      placeholder="***"
                      className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 border border-white/20 text-white rounded-full hover:border-gold hover:text-gold transition">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="font-serif text-2xl text-white mb-2">Application Submitted</h3>
              <p className="text-warm-sand-light opacity-80">Your application is now under review. We'll notify you via your preferred channel once approved.</p>
              <p className="text-sm text-white/40 mt-4">You'll receive a notification when your request is processed.</p>
              <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
                Go to Dashboard
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Apply;
