import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

// ── UPI config (overridable via Vite env — see frontend/.env.example) ──────────
const UPI_ID = (import.meta.env.VITE_UPI_ID as string) || 'edunexuss@ptyes';
const PAYEE_NAME = (import.meta.env.VITE_UPI_PAYEE as string) || 'EDUNEXUS PRO';
// ───────────────────────────────────────────────────────────────────────────────

const BASE_PRICE = 699;
const TAGLINE = 'Learn. Build. Innovate.';

const HOW_TO_PAY = [
  { step: '1', title: 'Open any UPI App', desc: 'PhonePe, GPay, Paytm, or your bank app' },
  { step: '2', title: 'Scan the QR or tap "Pay by Any UPI App"', desc: 'Enter the exact amount shown' },
  { step: '3', title: 'Pay the course fee', desc: 'Confirm once inside your UPI app' },
  { step: '4', title: 'Complete the payment', desc: 'Then tap "I’ve Completed Payment" below' },
];

/** Build the standard UPI deep-link payload for a given amount. */
const upiPayload = (amount: number) =>
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR`;

const PayPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useUI();

  const [isPaid, setIsPaid] = useState(false);
  const [checking, setChecking] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Referral reward (capped at 50% — issue #68)
  const referralCount = user?.referralCount || 0;
  const referralPaidCount = user?.referralPaidCount || 0;
  const referralSuccess = user?.referralSuccess || false;
  const referralDiscount = referralSuccess ? 0.5 : 0;

  const finalDiscount = Math.max(discount, referralDiscount);
  const currentPrice = Math.round(BASE_PRICE * (1 - finalDiscount));

  // If the course is already unlocked, bounce to the paid state.
  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      try {
        const res = await api.get(`/payments/status/${courseId}`);
        if (mounted) {
          setIsPaid(!!res.data.paid);
          // Resume "awaiting admin verification" if a proof is already pending.
          if (res.data.pending?.status === 'PENDING' || res.data.pending?.status === 'PENDING_VERIFICATION') {
            setSubmitted(true);
          }
        }
      } catch {
        /* ignore — the payment form handles errors on submit */
      } finally {
        if (mounted) setChecking(false);
      }
    };
    checkStatus();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (code === 'SAVI10') {
      setDiscount(0.1); // SECURITY (#100): was 100% off (free-cert exploit) → 10%
      setIsCouponApplied(true);
    } else if (code === 'AVI050') {
      setDiscount(0.5);
      setIsCouponApplied(true);
    } else if (code === 'AVI030') {
      setDiscount(0.3);
      setIsCouponApplied(true);
    } else if (code === 'NEXUS499' || code === 'EDU499' || code === 'SPECIAL499') {
      setDiscount(200 / BASE_PRICE);
      setIsCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code');
      setDiscount(0);
      setIsCouponApplied(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard
      .writeText(UPI_ID)
      .then(() => {
        setUpiCopied(true);
        addToast('UPI ID Copied ✓', 'success');
        setTimeout(() => setUpiCopied(false), 2000);
      })
      .catch(() => addToast('Could not copy UPI ID. Please copy it manually.', 'error'));
  };

  /**
   * Fire the UPI Intent deep link. Android (and iOS with a UPI app) launch the
   * OS app-picker for installed UPI apps — we do NOT fake an app-selection UI.
   * If the page never blurs (no app opened), show the graceful error.
   */
  // UPI deep links (upi://) can only be opened by a UPI app, which only exists
  // on phones. On desktop there is nothing to open, so we guide instead.
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const openUpiIntent = () => {
    setIntentError(null);
    if (!isMobileDevice) {
      setIntentError(
        'You are on a desktop — UPI apps only exist on phones. Scan the QR code above with your phone’s UPI app (PhonePe / GPay / Paytm), or copy the UPI ID and pay manually.'
      );
      return;
    }

    let appOpened = false;
    const onBlur = () => {
      appOpened = true;
    };
    const onVis = () => {
      if (document.hidden) {
        appOpened = true;
        document.removeEventListener('visibilitychange', onVis);
      }
    };
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVis);

    window.location.href = upiPayload(currentPrice);

    setTimeout(() => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVis);
      if (!appOpened) {
        setIntentError('No UPI app opened. If your phone has no UPI app, install one (PhonePe / GPay / Paytm) or scan the QR code and pay manually.');
      }
    }, 2000);
  };

  /**
   * "I've Completed Payment": create the order server-side, then submit for
   * admin verification. NEVER shows success from frontend state alone — the
   * backend decides (PENDING for manual verify, VERIFIED only for free/coupon).
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);
    try {
      const orderRes = await api.post('/payments/create-order', {
        courseId,
        amount: currentPrice,
        couponCode: isCouponApplied ? couponCode : undefined,
      });
      const { orderId } = orderRes.data;

      const suffix = Math.random().toString(36).substring(2, 9).toUpperCase();
      const gatewayRef = currentPrice === 0 ? `REF_COUPON_FREE_${suffix}` : `UPI_REF_${suffix}`;

      const verifyRes = await api.post('/payments/verify', { orderId, gatewayReference: gatewayRef });

      if (verifyRes.data.success) {
        if (verifyRes.data.payment?.status === 'VERIFIED') {
          // Backend confirmed free/coupon checkout — safe to unlock.
          addToast('Your certificate is unlocked!', 'success');
          navigate(`/certificate?courseId=${encodeURIComponent(courseId || '')}`);
        } else {
          // Backend says PENDING — awaiting admin verification. No false success.
          setSubmitted(true);
        }
      }
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || 'Payment submission failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Already unlocked → nothing to pay.
  if (isPaid) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
            <BadgeCheck size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-4">Already Unlocked 🎓</h1>
          <p className="text-sm text-slate-500 mt-2">
            Your payment is verified and your certificate is ready.
          </p>
          <button
            onClick={() => navigate(`/certificate?courseId=${encodeURIComponent(courseId || '')}`)}
            className="mt-6 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl transition"
          >
            Open High-Resolution Certificate
          </button>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="mt-3 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // Payment proof submitted — awaiting admin verification.
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto">
            <Clock size={32} className="text-amber-500" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-4">Payment Submitted!</h1>
          <p className="text-amber-600 text-xs font-bold uppercase tracking-wider mt-1">
            Awaiting Admin Verification
          </p>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            Your UPI payment has been recorded. Our team will verify the transaction and unlock your
            certificate shortly (usually within 24 hours).
          </p>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 text-left">
            <AlertCircle size={16} className="text-amber-500 shrink-0" />
            <p className="text-amber-700 text-xs font-semibold">
              Keep your UPI transaction screenshot handy in case verification needs it.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 pt-5 pb-6 text-white relative">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-bold uppercase tracking-wide transition"
              aria-label="Go back"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/25 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} /> Secure Payment
            </span>
          </div>
          <div className="mt-5 text-center">
            <h1 className="text-lg font-black tracking-tight">EDUNEXUS PRO</h1>
            <p className="text-[11px] text-white/80 font-semibold uppercase tracking-[0.2em]">{TAGLINE}</p>
          </div>
        </div>

        {/* ── Amount ─────────────────────────────────────────────── */}
        <div className="px-6 pt-6 pb-2 text-center">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Accreditation Fee</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            {finalDiscount > 0 && (
              <span className="text-slate-400 line-through text-lg font-semibold">₹{BASE_PRICE}</span>
            )}
            <span className="text-4xl font-black text-slate-900">₹{currentPrice}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">One-time payment | All Courses – One Price</p>
        </div>

        {paymentError && (
          <div className="mx-6 mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-left">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-xs font-semibold">{paymentError}</p>
          </div>
        )}

        {/* ── QR code ────────────────────────────────────────────── */}
        <div className="px-6 pt-6">
          <div className="bg-gradient-to-br from-sky-50 to-blue-100 border border-sky-100 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-2 text-sky-700">
              <QrCode size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Scan & Pay</h2>
            </div>
            <p className="text-center text-xs text-slate-500 mt-1 font-medium">
              Scan this QR code using any UPI app
            </p>
            <div className="mt-4 flex justify-center bg-white rounded-2xl p-4 shadow-sm w-fit mx-auto">
              <QRCodeSVG value={upiPayload(currentPrice)} size={190} level="H" includeMargin />
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-mono">
              Pay {PAYEE_NAME} • ₹{currentPrice} • {UPI_ID}
            </p>
          </div>
        </div>

        {/* ── Pay by any UPI app ─────────────────────────────────── */}
        <div className="px-6 pt-4">
          <button
            onClick={openUpiIntent}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Smartphone size={20} /> Pay by Any UPI App
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
            {isMobileDevice ? 'Tap to open your preferred UPI app' : 'Mobile-only — scan the QR or copy the UPI ID on your phone'}
          </p>

          {intentError && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs font-semibold">{intentError}</p>
            </div>
          )}
        </div>

        {/* ── UPI ID + copy ──────────────────────────────────────── */}
        <div className="px-6 pt-4">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">UPI ID</label>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-mono font-semibold truncate">
              {UPI_ID}
            </div>
            <button
              onClick={copyUpiId}
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wide rounded-xl transition"
              aria-label="Copy UPI ID"
            >
              {upiCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {upiCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── Coupon (optional) ──────────────────────────────────── */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Discount coupon (optional)"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono uppercase"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wide rounded-xl border border-slate-200 transition"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-[11px] text-red-600 font-bold mt-1">{couponError}</p>}
          {isCouponApplied && (
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {['NEXUS499', 'EDU499', 'SPECIAL499'].includes(couponCode.toUpperCase().trim())
                ? 'Coupon Applied: course price reduced to ₹499!'
                : `Coupon Applied: ${Math.round(discount * 100)}% OFF!`}
            </p>
          )}
          {referralSuccess ? (
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              Referral Reward: 50% OFF unlocked! ({referralCount}/15 registered, {referralPaidCount}/5 paid)
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Referral Progress: {referralCount}/15 registered, {referralPaidCount}/5 paid
            </p>
          )}
        </div>

        {/* ── How to pay ─────────────────────────────────────────── */}
        <div className="px-6 pt-5">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">How to Pay</h3>
          <ol className="mt-2 space-y-2">
            {HOW_TO_PAY.map((s) => (
              <li key={s.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{s.title}</p>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Submit ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition text-sm uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {processing ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white"></span>
                Processing…
              </span>
            ) : currentPrice === 0 ? (
              <>
                <Sparkles size={18} /> Claim Free Certificate
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> I’ve Completed Payment
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-3 leading-relaxed">
            We never ask for UPI PIN, bank password, OTP or card details. Your certificate unlocks only
            after our team verifies the payment.
          </p>
          <Link to="/refund" className="block text-center text-[11px] text-sky-600 font-bold hover:underline mt-1">
            Refund Policy
          </Link>
        </form>
      </div>
    </div>
  );
};

export default PayPage;
