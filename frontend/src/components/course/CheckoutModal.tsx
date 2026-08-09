import React from 'react';
import { CreditCard, Clipboard, Check, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  currentPrice: number;
  discount: number;
  couponCode: string;
  onChangeCouponCode: (code: string) => void;
  onApplyCoupon: () => void;
  couponError: string;
  isCouponApplied: boolean;
  paymentMethod: 'card' | 'upi';
  onChangePaymentMethod: (method: 'card' | 'upi') => void;
  cardNumber: string;
  onChangeCardNumber: (num: string) => void;
  cardExpiry: string;
  onChangeCardExpiry: (exp: string) => void;
  cardCvv: string;
  onChangeCardCvv: (cvv: string) => void;
  processingCheckout: boolean;
  upiCopied: boolean;
  onCopyToClipboard: (text: string) => void;
  upiUtr: string;
  onChangeUpiUtr: (utr: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentPrice,
  discount,
  couponCode,
  onChangeCouponCode,
  onApplyCoupon,
  couponError,
  isCouponApplied,
  processingCheckout,
  upiCopied,
  onCopyToClipboard,
  upiUtr,
  onChangeUpiUtr
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950"
          >
            <button
              onClick={onClose}
              aria-label="Close checkout"
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-sm font-extrabold uppercase tracking-widest">
                <CreditCard size={18} /> Nexus Billing checkout
              </div>
              <h3 className="text-lg font-black text-white">Complete Certificate Payment</h3>
              <p className="text-xs text-slate-400">Mock Stripe-Razorpay Sandbox Payment Portal</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              
              {/* Amount Box */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Accreditation Fee</span>
                <div className="flex flex-col items-end">
                  {discount > 0 && (
                    <span className="text-slate-500 line-through text-[11px]">₹699.00</span>
                  )}
                  <span className="text-cyan-400 font-black text-sm">₹{currentPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] uppercase font-bold text-slate-400">Discount Coupon</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={couponCode}
                    onChange={(e) => onChangeCouponCode(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={onApplyCoupon}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-bold uppercase rounded-xl border border-slate-700 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500 font-bold ml-1">{couponError}</p>}
                {isCouponApplied && <p className="text-[11px] text-green-500 font-bold ml-1">Coupon Applied: {Math.round(discount * 100)}% OFF!</p>}
              </div>

              {currentPrice > 0 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                    <QRCodeSVG 
                      value={`upi://pay?pa=edunexuss@ptyes&pn=Anjali%20Singh&am=${currentPrice}&cu=INR`} 
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                    <p className="text-slate-900 text-[11px] font-black uppercase tracking-tighter mt-2">Scan to pay ₹{currentPrice} with UPI</p>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Payee Name</label>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold">
                      Anjali Singh
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[11px] uppercase font-bold text-slate-400">UPI ID</label>
                    <div className="relative">
                      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono">
                        edunexuss@ptyes
                      </div>
                      <button
                        type="button"
                        onClick={() => onCopyToClipboard('edunexuss@ptyes')}
                        aria-label="Copy UPI ID"
                        title="Copy UPI ID"
                        className="absolute right-2 top-1.5 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition"
                      >
                        {upiCopied ? <Check size={14} /> : <Clipboard size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* UTR Input Field */}
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] uppercase font-bold text-slate-400">12-Digit UTR / Transaction Reference Number</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      pattern="\d{12}"
                      placeholder="e.g. 612345678901"
                      value={upiUtr}
                      onChange={(e) => onChangeUpiUtr(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition font-mono"
                    />
                    <p className="text-[11px] text-slate-500">Please enter the 12-digit number from your UPI payment receipt to speed up verification.</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex flex-col items-center justify-center space-y-3 animate-in zoom-in-95 duration-300">
                  <Sparkles className="text-cyan-400 animate-pulse" size={32} />
                  <div className="text-center">
                    <p className="text-white font-black uppercase text-sm">Full Discount Applied!</p>
                    <p className="text-slate-400 text-[11px] font-bold uppercase mt-1">Your certificate is now completely free.</p>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={processingCheckout}
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-500/10 transition duration-200 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {processingCheckout ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{currentPrice === 0 ? 'Applying Free Clearance...' : 'Verifying UPI Transaction...'}</span>
                  </>
                ) : (
                  <>
                    <span>{currentPrice === 0 ? 'Claim Free Certificate' : 'I have completed the payment'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-wider pt-2 border-t border-slate-900">
              🔒 Secured with 256-bit TLS Webhook Verification
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CheckoutModal;
