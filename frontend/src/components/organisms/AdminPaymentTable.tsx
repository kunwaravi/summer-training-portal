import React from 'react';
import { Users } from 'lucide-react';

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
}

const AdminPaymentTable: React.FC<AdminPaymentTableProps> = ({ transactions, loading }) => {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
        <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users size={18} className="text-cyan-400" /> Student Verification & Checkout Registry
        </h3>
        <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">
          {transactions.length} Total Captured Events
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold text-sm">Fetching audit logs...</div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">No transaction records captured.</div>
      ) : (
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
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {transactions.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 text-slate-300 transition">
                  <td className="py-3.5 px-4 font-mono text-[10px] text-cyan-400">{t.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{t.user?.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.user?.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold uppercase">{t.courseId}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-black">₹{t.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      t.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : 'bg-red-500/10 text-red-400 border border-red-500/25'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-450 text-[10px]">{t.reference || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    {t.user?.id ? (
                      <a 
                        href={`/certificate?courseId=${t.courseId}&userId=${t.user.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-lg text-[10px] font-bold uppercase transition"
                      >
                        View / Issue
                      </a>
                    ) : (
                      <span className="text-slate-600 font-semibold">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentTable;
