import React from 'react';
import { Users } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Payment {
  id: string;
  courseId: string;
  amount: number;
  status: string;
  reference?: string;
  createdAt: string;
  user?: User;
}

interface PaymentAuditTableProps {
  payments: Payment[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onVerifyPayment?: (paymentId: string) => void;
}

export const PaymentAuditTable: React.FC<PaymentAuditTableProps> = ({
  payments,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onVerifyPayment
}) => {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-800/80">
        <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users size={18} className="text-cyan-400" /> Student Verification & Checkout Registry
        </h3>
        <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold self-start sm:self-auto">
          {totalCount} Total Captured Events
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold text-sm">Fetching audit logs...</div>
      ) : payments.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">No transaction records captured in PostgreSQL.</div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course ID</th>
                  <th className="py-3 px-4">Fee Charged</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Gateway Reference</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {payments.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 text-slate-300 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-400">{t.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{t.user?.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{t.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold uppercase">{t.courseId}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-black">₹{t.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                        t.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          : t.status === 'VERIFICATION_PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse'
                          : 'bg-red-500/10 text-red-400 border border-red-500/25'
                      }`}>
                        {t.status === 'VERIFICATION_PENDING' ? 'PENDING' : t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-450 text-[11px]">{t.reference || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      {t.status === 'VERIFICATION_PENDING' && (
                        <button
                          onClick={() => onVerifyPayment && onVerifyPayment(t.id)}
                          className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-600 active:scale-[0.98] text-slate-950 text-[11px] font-black uppercase rounded-lg transition-all"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Premium Pagination Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 font-bold uppercase">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-lg disabled:opacity-30 disabled:hover:text-slate-400 transition"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-lg disabled:opacity-30 disabled:hover:text-slate-400 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PaymentAuditTable;
