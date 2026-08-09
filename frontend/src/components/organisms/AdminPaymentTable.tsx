import React, { useState } from 'react';
import { Users, CheckCircle, Clock, XCircle, ShieldCheck, Trash2 } from 'lucide-react';
import api from '../../api';

interface Transaction {
  id: string;
  user: {
    id?: number;
    name: string;
    email: string;
  };
  courseId: string;
  amount: number;
  status: string;
  reference?: string;
  createdAt: string;
}

interface AdminPaymentTableProps {
  transactions: Transaction[];
  loading: boolean;
  onVerified: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  VERIFIED: {
    label: 'Verified',
    color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    icon: <CheckCircle size={11} className="inline mr-1" />
  },
  PENDING_VERIFICATION: {
    label: 'Awaiting Verify',
    color: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    icon: <Clock size={11} className="inline mr-1" />
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-slate-500/10 text-slate-400 border border-slate-500/25',
    icon: <Clock size={11} className="inline mr-1" />
  },
  FAILED: {
    label: 'Failed',
    color: 'bg-red-500/10 text-red-400 border border-red-500/25',
    icon: <XCircle size={11} className="inline mr-1" />
  },
  SUCCESS: {
    label: 'Success',
    color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    icon: <CheckCircle size={11} className="inline mr-1" />
  }
};

const AdminPaymentTable: React.FC<AdminPaymentTableProps> = ({ transactions, loading, onVerified }) => {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleVerify = async (paymentId: string, studentName: string) => {
    if (!window.confirm(`Verify payment for "${studentName}"? This will unlock their certificate.`)) return;

    setVerifyingId(paymentId);
    try {
      await api.post(`/payments/admin/verify/${paymentId}`);
      alert(`✅ Payment verified! ${studentName}'s certificate is now unlocked.`);
      onVerified();
    } catch (err: any) {
      console.error('Failed to verify payment:', err);
      alert(err.response?.data?.message || 'Failed to verify payment. Please try again.');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = async (paymentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE the payment record for "${studentName}"? This cannot be undone.`)) return;

    setDeletingId(paymentId);
    try {
      await api.delete(`/payments/admin/${paymentId}`);
      alert(`🗑️ Payment record for ${studentName} deleted.`);
      onVerified();
    } catch (err: any) {
      console.error('Failed to delete payment:', err);
      alert(err.response?.data?.message || 'Failed to delete payment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = transactions.filter(t => t.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
        <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users size={18} className="text-cyan-400" /> Student Payment Verification
        </h3>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="text-[11px] bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 font-bold animate-pulse">
              {pendingCount} Awaiting Verification
            </span>
          )}
          <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">
            {transactions.length} Total Records
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold text-sm">Fetching payment records...</div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">No payment records found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">UPI Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {transactions.map((t, idx) => {
                const cfg = statusConfig[t.status] || statusConfig['PENDING'];
                const isAwaitingVerify = t.status === 'PENDING_VERIFICATION';
                const isVerifying = verifyingId === t.id;
                const isDeleting = deletingId === t.id;

                return (
                  <tr key={idx} className={`hover:bg-slate-900/40 text-slate-300 transition ${isAwaitingVerify ? 'bg-amber-500/3' : ''}`}>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-400 max-w-[120px] truncate">{t.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{t.user?.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{t.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold uppercase">{t.courseId}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-black">₹{t.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${cfg.color}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-450 text-[11px]">{t.reference || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      {isAwaitingVerify ? (
                        <>
                          <button
                            onClick={() => handleVerify(t.id, t.user?.name)}
                            disabled={isVerifying || isDeleting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 hover:border-emerald-500/60 text-emerald-400 rounded-lg text-[11px] font-black uppercase transition active:scale-95 disabled:opacity-50"
                          >
                            <ShieldCheck size={12} />
                            {isVerifying ? 'Verifying...' : 'Verify Now'}
                          </button>
                          <button
                            onClick={() => handleDelete(t.id, t.user?.name)}
                            disabled={isVerifying || isDeleting}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 rounded-lg transition active:scale-95 disabled:opacity-50"
                            title="Delete Request"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : t.status === 'VERIFIED' || t.status === 'SUCCESS' ? (
                        t.user?.id ? (
                          <a
                            href={`/certificate?courseId=${encodeURIComponent(t.courseId)}&userId=${t.user.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-lg text-[11px] font-bold uppercase transition"
                          >
                            View Certificate
                          </a>
                        ) : (
                          <span className="text-slate-600 font-semibold">N/A</span>
                        )
                      ) : (
                        <button
                          onClick={() => handleDelete(t.id, t.user?.name)}
                          disabled={isVerifying || isDeleting}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 rounded-lg transition active:scale-95 disabled:opacity-50"
                          title="Delete Request"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentTable;
