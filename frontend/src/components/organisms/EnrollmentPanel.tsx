import React, { useState } from 'react';
import { Award, Check, ShieldAlert, Sparkles, QrCode, Clipboard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api';

// ── Payment constants ────────────────────────────────────────────────────────
const UPI_ID = 'avinashkunwar07@ptyes';
const PAYEE_NAME = 'Gaurav Singh';
// ─────────────────────────────────────────────────────────────────────────────

interface EnrollmentPanelProps {
  courseId: string | undefined;
  user: any;
  isPaid: boolean;
  onPaymentSuccess: () => void;
  navigate: (path: string) => void;
}

const EnrollmentPanel: React.FC<EnrollmentPanelProps> = ({
  courseId,
  user,
  isPaid,
  onPaymentSuccess,
  navigate
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  // After submit: show pending confirmation instead of closing modal
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const BASE_PRICE = 499;
  const currentPrice = Math.round(BASE_PRICE * (1 - discount));

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase();

    if (code === 'SAVI10') {
      setDiscount(1);
      setIsCouponApplied(true);
    } else if (code === 'AVI050') {
      setDiscount(0.5);
      setIsCouponApplied(true);
    } else if (code === 'AVI030') {
      setDiscount(0.3);
      setIsCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code');
      setDiscount(0);
      setIsCouponApplied(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingCheckout(true);
    try {
      const orderRes = await api.post('/payments/create-order', {
        courseId: courseId,
        amount: currentPrice
      });

      const { orderId, mockSignature } = orderRes.data;
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
      const gatewayRef = currentPrice === 0
        ? `REF_COUPON_FREE_${randomSuffix}`
        : `UPI_REF_${randomSuffix}`;

      const verifyRes = await api.post('/payments/verify', {
        orderId,
        mockSignature,
        gatewayReference: gatewayRef
      });

      if (verifyRes.data.success) {
        if (currentPrice === 0) {
          // Free via coupon — treat as immediately verified for UX continuity
          onPaymentSuccess();
          setShowCheckoutModal(false);
        } else {
          // Paid via UPI — goes to pending verification
          setPaymentSubmitted(true);
        }
      }
    } catch (err: any) {
      console.error('Payment submission failed:', err);
      alert(err.response?.data?.message || 'Payment submission failed. Please try again.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const upiPaymentString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${currentPrice}&cu=INR`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-10 p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-yellow-500/30 shadow-xl shadow-yellow-500/5"
    >
      <div className="absolute top-3 left-4 text-yellow-500/5 text-7xl select-none font-serif">★</div>
      <div className="absolute bottom-3 right-4 text-yellow-500/5 text-7xl select-none font-serif">★</div>

      {!isPaid ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="relative group/cert select-none">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-xl blur-lg opacity-60 group-hover/cert:opacity-90 transition duration-500"></div>
            <div className="relative border-4 border-yellow-500/40 p-4 rounded-xl bg-slate-900 aspect-[1.41/1] overflow-hidden flex flex-col justify-between items-center text-center filter blur-[4px] contrast-75 brightness-75 select-none pointer-events-none">
              <div className="text-[7px] tracking-widest text-slate-500 font-extrabold uppercase">Nexus Academic Credentials</div>
              <div className="my-auto space-y-1">
                <h3 className="text-yellow-500/60 font-serif font-black text-sm uppercase tracking-wide">Certificate of Accomplishment</h3>
                <p className="text-[8px] text-slate-400">Awarded to the candidate</p>
                <p className="text-xs font-bold text-white tracking-tight underline underline-offset-4">{user?.name || "STUDENT NAME"}</p>
                <p className="text-[6px] text-slate-500 max-w-[200px] leading-tight mx-auto">for completing the intensive training curriculum in C & Embedded Systems Hardware tracks.</p>
              </div>
              <div className="w-full flex justify-between items-center text-[5px] text-slate-650 px-2 font-mono">
                <div>DATE: 2026-05-29</div>
                <div>GRADE: A+</div>
              </div>
            </div>
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded text-[9px] font-black tracking-widest uppercase rotate-[-12deg] shadow-lg shadow-black/80">
                Provisional Preview - Locked 🔒
              </span>
            </div>
          </div>

          <div className="space-y-5 text-left">
            <div className="flex items-center gap-2 text-yellow-400">
              <Award size={24} className="animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Unlock Your Verified Certificate 🎓</h2>
            </div>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Congratulations! You have completed all course curriculum modules and passed the final examinations. Your credential is ready to be authorized and published.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300 font-bold bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              {[
                "ISO 9001:2015 Accredited Standards",
                "Verifiable Online Registry Entry",
                "One-Click Shareable to LinkedIn",
                "Durable High-Res Printable Format"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => { setShowCheckoutModal(true); setPaymentSubmitted(false); }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-widest"
              >
                Unlock Official Credentials (₹{BASE_PRICE})
              </button>
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <ShieldAlert size={14} /> UPI Payment
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center relative z-10 space-y-6 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Sparkles size={32} className="animate-spin-slow" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 tracking-tight">Credentials Verified & Active! 🎓</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Your payment was verified by our team and your secure certification credentials have been generated. You can now download, print, or share your ISO-compliant certificate.
          </p>
          <button
            onClick={() => navigate(`/certificate?courseId=${courseId}`)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            Open High-Resolution Certificate
          </button>
        </div>
      )}

      {/* UPI Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white transition"
              >
                ✕
              </button>

              {paymentSubmitted ? (
                /* ── Pending Confirmation Screen ─────────────────────────────── */
                <div className="text-center space-y-5 py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto">
                    <Clock size={32} className="text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Payment Submitted!</h3>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mt-1">Awaiting Admin Verification</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Your UPI payment has been recorded. Our team will verify your transaction and unlock your certificate shortly. You will see the download button once approved.
                  </p>
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <AlertCircle size={16} className="text-amber-400 shrink-0" />
                    <p className="text-amber-300 text-[10px] font-bold text-left">
                      Please keep your UPI transaction screenshot handy. Verification usually takes less than 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* ── Payment Form ─────────────────────────────────────────────── */
                <>
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-sm font-extrabold uppercase tracking-widest">
                      <QrCode size={18} /> UPI Payment
                    </div>
                    <h3 className="text-lg font-black text-white">Complete Certificate Payment</h3>
                    <p className="text-xs text-slate-400">Scan QR or use UPI ID to pay</p>
                  </div>

                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    {/* Price display */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase">Accreditation Fee</span>
                      <div className="flex flex-col items-end">
                        {discount > 0 && (
                          <span className="text-slate-500 line-through text-[10px]">₹499.00</span>
                        )}
                        <span className="text-cyan-400 font-black text-sm">₹{currentPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Coupon */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Discount Coupon</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-bold uppercase rounded-xl border border-slate-700 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[9px] text-red-500 font-bold ml-1">{couponError}</p>}
                      {isCouponApplied && <p className="text-[9px] text-green-500 font-bold ml-1">Coupon Applied: {Math.round(discount * 100)}% OFF!</p>}
                    </div>

                    {currentPrice > 0 ? (
                      /* ── QR / UPI Section ─────────────────────────────────── */
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                          <QRCodeSVG
                            value={upiPaymentString}
                            size={170}
                            level="H"
                            includeMargin={true}
                          />
                          <p className="text-slate-900 text-[10px] font-black uppercase tracking-tighter mt-2">
                            Scan to pay ₹{currentPrice} via UPI
                          </p>
                        </div>

                        {/* UPI ID copy row */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">UPI ID</label>
                          <div className="relative">
                            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono">
                              {UPI_ID}
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(UPI_ID)}
                              className="absolute right-2 top-1.5 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition"
                              title="Copy UPI ID"
                            >
                              {upiCopied ? <CheckCircle2 size={14} className="text-green-400" /> : <Clipboard size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Payee name */}
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
                          <span className="text-slate-500 font-bold uppercase">Pay to</span>
                          <span className="text-white font-black">{PAYEE_NAME}</span>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-1.5">
                          <p className="text-blue-300 text-[10px] font-black uppercase tracking-wide">How to pay:</p>
                          <ol className="text-slate-400 text-[10px] space-y-1 list-decimal list-inside">
                            <li>Open any UPI app (PhonePe, GPay, Paytm, etc.)</li>
                            <li>Scan the QR code above or enter the UPI ID</li>
                            <li>Pay ₹{currentPrice} and note your transaction ID</li>
                            <li>Click "Confirm Payment Submitted" below</li>
                          </ol>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex flex-col items-center justify-center space-y-3">
                        <Sparkles className="text-cyan-400 animate-pulse" size={32} />
                        <p className="text-white font-black uppercase text-sm">Full Discount Applied!</p>
                        <p className="text-slate-400 text-[10px]">No payment required — click below to claim your free certificate.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={processingCheckout}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-800 text-white font-extrabold rounded-xl shadow-lg transition duration-200 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {processingCheckout
                        ? 'Processing...'
                        : currentPrice === 0
                          ? 'Claim Free Certificate'
                          : 'Confirm Payment Submitted ✓'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnrollmentPanel;
