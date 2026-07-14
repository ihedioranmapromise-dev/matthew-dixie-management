import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import TierModal from '../components/TierModal';

const Apply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tiers, setTiers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [tierPrices, setTierPrices] = useState([]);
  const [cryptoWallets, setCryptoWallets] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [giftCardFile, setGiftCardFile] = useState(null);
  const [cryptoProofFile, setCryptoProofFile] = useState(null);
  const [giftCardPreview, setGiftCardPreview] = useState('');
  const [cryptoProofPreview, setCryptoProofPreview] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    government_id_file: null,
    password: '',
    confirmPassword: '',
    tier: '',
    investmentPlan: '',
    referralCode: '',
    answers: '',
    bank_name: '',
    account_number: '',
    billing_cycle: 'monthly',
    payment_type: '',
    gift_card_image_url: '',
    crypto_proof_image_url: '',
    crypto_currency_selected: '',
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiersRes, investmentsRes, cryptoRes] = await Promise.all([
          api.get('/public/tiers'),
          api.get('/public/investments'),
          api.get('/public/crypto-wallets')
        ]);
        setTiers(tiersRes.data || []);
        setInvestments(investmentsRes.data || []);
        setCryptoWallets(cryptoRes.data || []);
        setDataError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setDataError('Failed to load data. Please refresh the page.');
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch tier prices when investment plan changes
  useEffect(() => {
    if (formData.investmentPlan) {
      const fetchPrices = async () => {
        try {
          const res = await api.get(`/public/investment-tier-prices/${formData.investmentPlan}`);
          setTierPrices(res.data || []);
          if (!res.data.some(p => p.tier_id.toString() === formData.tier)) {
            setFormData(prev => ({ ...prev, tier: '' }));
          }
        } catch (err) {
          console.error('Error fetching tier prices:', err);
          setTierPrices([]);
        }
      };
      fetchPrices();
    } else {
      setTierPrices([]);
    }
  }, [formData.investmentPlan]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, government_id_file: file });
    }
  };

  const handleGiftCardFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGiftCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setGiftCardPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCryptoProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCryptoProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCryptoProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const openTierModal = (investmentId) => {
    setSelectedInvestmentId(investmentId);
    setShowTierModal(true);
  };

  const uploadFile = async (file, folder) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials missing');
    }
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        setLoading(false);
        return;
      }

      let token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        const registerResponse = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        token = registerResponse.data.token;
        const user = registerResponse.data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      let govIdUrl = '';
      let govIdFilename = '';
      if (formData.government_id_file) {
        govIdUrl = await uploadFile(formData.government_id_file, 'government-ids');
        govIdFilename = formData.government_id_file.name;
      }

      let giftCardUrl = '';
      let cryptoProofUrl = '';
      if (paymentMethod === 'gift_card' && giftCardFile) {
        giftCardUrl = await uploadFile(giftCardFile, 'gift-cards');
      }
      if (paymentMethod === 'crypto' && cryptoProofFile) {
        cryptoProofUrl = await uploadFile(cryptoProofFile, 'crypto-proofs');
      }

      const payload = {
        tier: formData.tier,
        investmentPlan: formData.investmentPlan,
        referralCode: formData.referralCode,
        answers: formData.answers,
        address: formData.address,
        government_id_url: govIdUrl,
        government_id_filename: govIdFilename,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        billing_cycle: formData.billing_cycle,
        payment_type: paymentMethod,
        gift_card_image_url: giftCardUrl,
        crypto_proof_image_url: cryptoProofUrl,
        crypto_currency_selected: formData.crypto_currency_selected
      };

      await api.post('/user/application', payload);

      if (paymentMethod === 'gift_card' || paymentMethod === 'crypto') {
        navigate('/pending');
      } else {
        setStep(5);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting application: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while data is being fetched
  if (isDataLoading) {
    return <LoadingSpinner />;
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-warm-sand py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-2">
          Apply for <span className="text-gold">Membership</span>
        </h2>
        <p className="text-center text-warm-sand-light opacity-70 mb-8">
          Complete your details to become part of the movement.
        </p>

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
          {/* Stage 1: Personal Info */}
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
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pr-12 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pr-12 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Government ID *</label>
                  <input type="file" name="government_id" onChange={handleFileChange} accept="image/*,.pdf" required
                    className="w-full p-2 rounded bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gold file:text-charcoal file:font-semibold hover:file:bg-gold-light cursor-pointer" />
                  <p className="text-xs text-white/30 mt-1">Upload a clear photo or scan.</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Investment Plan + Referral + Why */}
          {step === 2 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Investment Plan & Questions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Investment Plan *</label>
                  <select name="investmentPlan" value={formData.investmentPlan} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none">
                    <option value="" className="bg-charcoal text-white/60">Select an investment plan</option>
                    {investments.map((inv) => (
                      <option key={inv.id} value={inv.id} className="bg-charcoal text-white">{inv.name}</option>
                    ))}
                  </select>
                  {formData.investmentPlan && (
                    <button
                      type="button"
                      onClick={() => openTierModal(formData.investmentPlan)}
                      className="mt-2 text-gold text-sm hover:underline"
                    >
                      View Tiers
                    </button>
                  )}
                </div>
                {tierPrices.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Your Tier *</label>
                    {tierPrices.map((price) => (
                      <label key={price.id} className={`flex items-center p-4 rounded-lg border cursor-pointer transition ${
                        formData.tier === price.tier_id.toString() ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                      }`}>
                        <input type="radio" name="tier" value={price.tier_id} checked={formData.tier === price.tier_id.toString()} onChange={handleChange} className="mr-3 accent-gold" />
                        <div>
                          <div className="font-semibold text-white capitalize">{price.tier_name}</div>
                          <div className="text-sm text-white/40">${price.price_monthly}/mo</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Referral Code (optional)</label>
                  <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Why do you want to join? *</label>
                  <textarea name="answers" rows="4" value={formData.answers} onChange={handleChange} required
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                  <select name="billing_cycle" value={formData.billing_cycle} onChange={handleChange}
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none">
                    <option value="monthly" className="bg-charcoal text-white">Monthly</option>
                    <option value="yearly" className="bg-charcoal text-white">Yearly (save ~20%)</option>
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

          {/* Stage 3: Bank Details */}
          {step === 3 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Bank Details</h3>
              <p className="text-sm text-warm-sand-light opacity-70 mb-4">Provide your bank information for verification.</p>
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

          {/* Stage 4: Payment Options */}
          {step === 4 && (
            <div>
              <h3 className="font-serif text-xl text-white mb-4">Payment Options</h3>
              <p className="text-sm text-warm-sand-light opacity-70 mb-4">Choose your preferred payment method.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'gift_card' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setPaymentMethod('gift_card')}
                >
                  <div className="font-semibold text-white">Gift Card</div>
                  <div className="text-xs text-gold">Recommended • Easy</div>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'crypto' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <div className="font-semibold text-white">Crypto</div>
                  <div className="text-xs text-gold">Optional • Fast Approval</div>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'bank_transfer' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <div className="font-semibold text-white">Bank Transfer</div>
                  <div className="text-xs text-warm-sand-light">Slower to approve</div>
                </div>
              </div>

              {paymentMethod === 'gift_card' && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-white/80 mb-2">Upload your gift card image:</p>
                  <input type="file" accept="image/*" onChange={handleGiftCardFileChange} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gold file:text-charcoal file:font-semibold hover:file:bg-gold-light cursor-pointer" />
                  {giftCardPreview && <img src={giftCardPreview} alt="Gift Card" className="mt-2 max-h-40 rounded" />}
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-white/80 mb-2">Select your currency:</p>
                  <div className="flex gap-4 mb-4">
                    {cryptoWallets.map((wallet) => (
                      <button
                        key={wallet.currency}
                        type="button"
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                          formData.crypto_currency_selected === wallet.currency
                            ? 'bg-gold text-charcoal'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => setFormData({ ...formData, crypto_currency_selected: wallet.currency })}
                      >
                        {wallet.currency}
                      </button>
                    ))}
                  </div>
                  {formData.crypto_currency_selected && (
                    <div>
                      <p className="text-sm text-white/60">Wallet address:</p>
                      <div className="flex items-center gap-2 bg-white/5 p-3 rounded">
                        <code className="text-xs text-white break-all">
                          {cryptoWallets.find(w => w.currency === formData.crypto_currency_selected)?.address}
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            const addr = cryptoWallets.find(w => w.currency === formData.crypto_currency_selected)?.address;
                            if (addr) {
                              navigator.clipboard.writeText(addr);
                              alert('Address copied!');
                            }
                          }}
                          className="px-2 py-1 bg-gold/20 text-gold rounded text-xs hover:bg-gold/30"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-white/30 mt-2">After sending payment, upload your proof:</p>
                      <input type="file" accept="image/*" onChange={handleCryptoProofChange} className="w-full p-2 rounded bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gold file:text-charcoal file:font-semibold hover:file:bg-gold-light cursor-pointer mt-2" />
                      {cryptoProofPreview && <img src={cryptoProofPreview} alt="Crypto Proof" className="mt-2 max-h-40 rounded" />}
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-white/80">Check your email for manual payment instructions.</p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 border border-white/20 text-white rounded-full hover:border-gold hover:text-gold transition">
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !paymentMethod}
                  className="px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}

          {/* Bank transfer confirmation step (step 5) */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="font-serif text-2xl text-white mb-2">Check Your Email</h3>
              <p className="text-warm-sand-light opacity-80">
                We have sent you an email with payment instructions. Please complete the payment to finalize your application.
              </p>
              <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-gold text-charcoal rounded-full font-semibold hover:bg-gold-light transition">
                Return Home
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Tier Modal */}
      <TierModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        investmentPlanId={selectedInvestmentId}
      />
    </div>
  );
};

export default Apply;
