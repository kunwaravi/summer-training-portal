import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api';
import { useUI } from '../../context/UIContext';
import Dialog from '../atoms/Dialog';
import Select from '../ui/Select';
import {
  Briefcase, Search, Plus, Edit3, Trash2, Eye, RefreshCw, Clock,
  CheckCircle2, Award, ShieldCheck, ShieldAlert, Link2, ChevronLeft,
  ChevronRight, ArrowUpDown, Activity, X,
} from 'lucide-react';

// ── Internship Management console (Task 9 / issue #102) ────────────────────
// Self-contained admin tab: full lifecycle CRUD for internship records plus
// certificate issue / verify / copy-link. Consumes the backend at
//   GET    /api/internships            (admin list + stats)
//   POST   /api/internships            (create)
//   PUT    /api/internships/:id        (update; confirm:true when cert issued)
//   POST   /api/internships/:id/complete
//   POST   /api/internships/:id/certificate
//   DELETE /api/internships/:id
//   POST   /api/certificate/admin/:recordId/verify | /unverify
// Styled to match AdminDashboard's dark slate + cyan admin consoles.

const LIMIT = 20;

const STATUS_STYLES: Record<string, string> = {
  APPLIED: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-500/25',
  SELECTED: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/25',
  ACTIVE: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/25',
  COMPLETED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25',
};

const CERT_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/25',
  VERIFIED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25',
};

// Fields which, once a certificate is issued, print on the certificate — the
// backend refuses silent edits to these (409 unless confirm:true is sent).
const SENSITIVE_AFTER_ISSUE = [
  'programTitle', 'domain', 'role', 'startDate', 'endDate', 'duration',
  'performanceGrade', 'projectTitle',
];

interface InternshipForm {
  userId: number | null;
  programTitle: string;
  domain: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
  institution: string;
  branch: string;
  session: string;
  mentorName: string;
  projectTitle: string;
  performanceGrade: string;
  status: string;
  certificateEligible: boolean;
}

const EMPTY_FORM: InternshipForm = {
  userId: null,
  programTitle: '',
  domain: '',
  role: '',
  startDate: '',
  endDate: '',
  duration: '',
  institution: '',
  branch: '',
  session: '',
  mentorName: '',
  projectTitle: '',
  performanceGrade: '',
  status: 'APPLIED',
  certificateEligible: false,
};

const toDateInput = (d: any) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const fmtDate = (d: any) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';
const initialsOf = (name?: string) =>
  (name || '?').split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?';

const inputCls =
  'w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition text-xs';
// Light/dark-adaptive field style for the filter toolbar (which sits on the
// adaptive white/slate-900 card, unlike the always-dark modal).
const toolbarFieldCls =
  'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 dark:focus:border-cyan-500 transition text-xs';
const labelCls = 'text-[11px] font-black uppercase tracking-wider text-slate-400';

const InternshipAdmin = () => {
  const { confirmDialog, addToast } = useUI();

  // List state
  const [internships, setInternships] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, issued: 0, pending: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', domain: '', status: '', certificate: '' });
  const [knownDomains, setKnownDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // Create / edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<InternshipForm>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  // Existing-user picker (create only) — mirrors AdminDashboard's selector,
  // which loads every registered user from /auth/admin/users.
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/internships', {
        params: {
          search: filters.search || undefined,
          domain: filters.domain || undefined,
          status: filters.status || undefined,
          certificate: filters.certificate || undefined,
          page,
          limit: LIMIT,
          sort,
        },
      });
      const nextTotal = res.data.total || 0;
      // After a delete emptied the current page, drop back to the last valid page.
      if (page > 1 && nextTotal < (page - 1) * LIMIT + 1) {
        setPage(Math.max(1, Math.ceil(nextTotal / LIMIT)));
        setLoading(false);
        return;
      }
      setInternships(res.data.internships || []);
      setTotal(nextTotal);
      if (res.data.stats) setStats(res.data.stats);
      // Accumulate domains so the filter dropdown stays populated across pages.
      setKnownDomains((prev) => {
        const next = [...prev];
        (res.data.internships || []).forEach((it: any) => {
          if (it?.domain && !next.includes(it.domain)) next.push(it.domain);
        });
        return next;
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load internships.');
    } finally {
      setLoading(false);
    }
  }, [filters, page, sort]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    const pool = q
      ? users.filter(
          (u) =>
            (u.name || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q) ||
            String(u.id) === q
        )
      : users;
    return pool.slice(0, 50);
  }, [users, userQuery]);

  const applySearch = () => {
    setPage(1);
    setFilters((f) => ({ ...f, search: searchInput.trim() }));
  };

  const resetFilters = () => {
    setSearchInput('');
    setPage(1);
    setFilters({ search: '', domain: '', status: '', certificate: '' });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setUserQuery('');
    setModalOpen(true);
    setLoadingUsers(true);
    api
      .get('/auth/admin/users')
      .then((res) => setUsers(res.data || []))
      .catch(() => {
        setUsers([]);
        addToast('Failed to load the candidate list.', 'error');
      })
      .finally(() => setLoadingUsers(false));
  };

  const openEdit = (it: any) => {
    setEditing(it);
    setForm({
      userId: it.userId ?? null,
      programTitle: it.programTitle || '',
      domain: it.domain || '',
      role: it.role || '',
      startDate: toDateInput(it.startDate),
      endDate: toDateInput(it.endDate),
      duration: it.duration || '',
      institution: it.institution || '',
      branch: it.branch || '',
      session: it.session || '',
      mentorName: it.mentorName || '',
      projectTitle: it.projectTitle || '',
      performanceGrade: it.performanceGrade || '',
      status: it.status || 'APPLIED',
      certificateEligible: Boolean(it.certificateEligible),
    });
    setUserQuery('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !form.userId) {
      addToast('Please select an existing candidate first.', 'error');
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const common = {
        programTitle: form.programTitle.trim(),
        domain: form.domain.trim(),
        role: form.role.trim(),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        duration: form.duration || null,
        institution: form.institution || null,
        branch: form.branch || null,
        session: form.session || null,
        mentorName: form.mentorName || null,
        projectTitle: form.projectTitle || null,
        performanceGrade: form.performanceGrade || null,
        status: form.status,
      };

      if (editing) {
        // A certificate is already issued: display fields print on it, so the
        // backend requires confirm:true before any sensitive field is touched.
        const touchesSensitive = SENSITIVE_AFTER_ISSUE.some(
          (k) => (common as any)[k] !== undefined
        );
        if (editing.certificate && touchesSensitive) {
          const ok = await confirmDialog({
            title: 'Confirm edits to an issued certificate?',
            message:
              'A certificate has already been generated for this internship. Changing program, domain, role, dates, duration, grade, or project will alter what is printed on it. Confirm to proceed.',
            confirmLabel: 'Confirm Edit',
            danger: true,
          });
          if (!ok) {
            setSaving(false);
            return;
          }
          await api.put(`/internships/${editing.id}`, {
            ...common,
            certificateEligible: form.certificateEligible,
            confirm: true,
          });
        } else {
          await api.put(`/internships/${editing.id}`, {
            ...common,
            certificateEligible: form.certificateEligible,
          });
        }
        addToast('Internship record updated.', 'success');
      } else {
        await api.post('/internships', { ...common, userId: form.userId });
        addToast('Internship record created.', 'success');
      }
      setModalOpen(false);
      setEditing(null);
      fetchList();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to save internship.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async (it: any) => {
    if (busyId) return;
    setBusyId(it.id);
    try {
      await api.post(`/internships/${it.id}/complete`);
      addToast('Internship marked as completed — now certificate-eligible.', 'success');
      fetchList();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to mark internship complete.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleGenerateCert = async (it: any) => {
    if (busyId) return;
    setBusyId(it.id);
    try {
      await api.post(`/internships/${it.id}/certificate`);
      addToast(
        it.certificate
          ? 'Certificate regenerated (existing credential reused).'
          : 'Certificate generated — pending verification.',
        'success'
      );
      fetchList();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to generate certificate.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleVerify = async (it: any) => {
    const rec = it.certificate;
    if (!rec || busyId) return;
    const isVerified = rec.verificationStatus === 'VERIFIED';
    if (isVerified) {
      const ok = await confirmDialog({
        title: 'Un-verify this certificate?',
        message:
          'This will revert the credential to PENDING. Its public verification page will stop showing it as verified until you verify it again.',
        confirmLabel: 'Un-verify',
        danger: true,
      });
      if (!ok) return;
    }
    setBusyId(it.id);
    try {
      const action = isVerified ? 'unverify' : 'verify';
      const res = await api.post(`/certificate/admin/${rec.id}/${action}`);
      addToast(
        res.data?.message || (isVerified ? 'Certificate un-verified.' : 'Certificate verified.'),
        'success'
      );
      fetchList();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update verification status.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleCopyLink = async (it: any) => {
    const rec = it.certificate;
    if (!rec) return;
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(rec.verificationCode)}`;
    try {
      await navigator.clipboard.writeText(url);
      addToast('Public verification link copied to clipboard.', 'success');
    } catch {
      addToast('Could not access the clipboard — copy manually? ' + url, 'error');
    }
  };

  const handleDelete = async (it: any) => {
    if (it.certificate) {
      addToast('Cannot delete: a certificate is issued. Void/delete the certificate first.', 'error');
      return;
    }
    if (busyId) return;
    const ok = await confirmDialog({
      title: 'Delete internship record?',
      message: `Are you sure you want to permanently delete the ${it.domain || ''} internship for "${
        it.user?.name || `#${it.userId}`
      }"? This cannot be undone.`,
      confirmLabel: 'Delete Record',
      danger: true,
    });
    if (!ok) return;
    setBusyId(it.id);
    try {
      await api.delete(`/internships/${it.id}`);
      addToast('Internship record deleted.', 'success');
      fetchList();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to delete internship.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleView = (it: any) => {
    window.open(`/internship-certificate?internshipId=${it.id}`, '_blank');
  };

  const summaryCards = [
    { label: 'Total Internships', value: stats.total, icon: <Briefcase size={14} className="text-cyan-500 dark:text-cyan-400" /> },
    { label: 'Active', value: stats.active, icon: <Activity size={14} className="text-amber-500 dark:text-amber-400" /> },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" /> },
    { label: 'Certificates Issued', value: stats.issued, icon: <Award size={14} className="text-indigo-500 dark:text-indigo-400" /> },
    { label: 'Pending Verification', value: stats.pending, icon: <Clock size={14} className="text-rose-500 dark:text-rose-400" /> },
  ];

  const showList = loading && internships.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase size={20} className="text-cyan-500 dark:text-cyan-400" /> Internship Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create internship records, drive them through completion, and issue / verify certificates.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchList()}
            disabled={loading}
            className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition disabled:opacity-50"
            title="Refresh"
            aria-label="Refresh internships"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow flex items-center gap-1.5 active:scale-95"
          >
            <Plus size={15} /> New Internship
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              {c.icon} {c.label}
            </p>
            <p className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{c.value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_180px_auto] gap-3 items-end">
          <div className="space-y-1.5">
            <label className={labelCls + ' text-slate-400 dark:text-slate-500'}>Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="Name, email or program…"
                className={`${toolbarFieldCls} pl-8`}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls + ' text-slate-400 dark:text-slate-500'}>Domain</label>
            <select
              value={filters.domain}
              onChange={(e) => {
                setPage(1);
                setFilters((f) => ({ ...f, domain: e.target.value }));
              }}
              className={toolbarFieldCls}
            >
              <option value="">All domains</option>
              {knownDomains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls + ' text-slate-400 dark:text-slate-500'}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setPage(1);
                setFilters((f) => ({ ...f, status: e.target.value }));
              }}
              className={toolbarFieldCls}
            >
              <option value="">All statuses</option>
              {Object.keys(STATUS_STYLES).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls + ' text-slate-400 dark:text-slate-500'}>Certificate</label>
            <select
              value={filters.certificate}
              onChange={(e) => {
                setPage(1);
                setFilters((f) => ({ ...f, certificate: e.target.value }));
              }}
              className={toolbarFieldCls}
            >
              <option value="">All</option>
              <option value="ISSUED">Issued</option>
              <option value="PENDING">Pending verification</option>
              <option value="NONE">Not issued</option>
            </select>
          </div>
          <div className="flex gap-2 items-end">
            <button
              onClick={() => {
                setSort((s) => (s === 'desc' ? 'asc' : 'desc'));
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[11px] font-black uppercase flex items-center gap-1.5 transition"
              title={sort === 'desc' ? 'Newest first — click for oldest' : 'Oldest first — click for newest'}
            >
              <ArrowUpDown size={13} /> {sort === 'desc' ? 'Newest' : 'Oldest'}
            </button>
            <button
              onClick={applySearch}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-wider transition hover:bg-slate-700 dark:hover:bg-slate-200"
            >
              Apply
            </button>
            {(filters.search || filters.domain || filters.status || filters.certificate) && (
              <button
                onClick={resetFilters}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition"
                title="Clear all filters"
                aria-label="Clear filters"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {error && (
          <div className="px-5 py-3 bg-rose-50 dark:bg-rose-500/10 border-b border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between gap-3">
            <span>{error}</span>
            <button onClick={() => fetchList()} className="underline font-bold shrink-0">
              Retry
            </button>
          </div>
        )}
        {showList ? (
          <div className="py-16 text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Loading internships…</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Briefcase size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No internship records found</p>
            <p className="text-xs text-slate-500">
              {filters.search || filters.domain || filters.status || filters.certificate
                ? 'Try clearing the filters, or create a new record.'
                : 'Create your first internship record to get started.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1080px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Program / Domain</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Start</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Certificate</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {internships.map((it) => {
                    const cert = it.certificate || null;
                    const rowBusy = busyId === it.id;
                    const canGenerate =
                      it.status === 'COMPLETED' && Boolean(it.certificateEligible);
                    const certChip = cert
                      ? cert.verificationStatus === 'VERIFIED'
                        ? { label: 'Verified', cls: CERT_STYLES.VERIFIED, icon: <ShieldCheck size={11} /> }
                        : { label: 'Pending', cls: CERT_STYLES.PENDING, icon: <ShieldAlert size={11} /> }
                      : null;
                    return (
                      <tr
                        key={it.id}
                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                              {initialsOf(it.user?.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{it.user?.name || `User #${it.userId}`}</p>
                              <p className="text-[11px] text-slate-400 truncate font-mono">{it.user?.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 max-w-[180px] truncate" title={it.programTitle}>
                            {it.programTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">{it.domain || '—'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{it.role || '—'}</td>
                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{fmtDate(it.startDate)}</td>
                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{fmtDate(it.endDate)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${STATUS_STYLES[it.status] || STATUS_STYLES.APPLIED}`}>
                            {it.status || 'APPLIED'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {certChip ? (
                            <div className="flex flex-col items-start gap-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${certChip.cls}`}>
                                {certChip.icon} {certChip.label}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 max-w-[130px] truncate" title={cert.verificationCode}>
                                {cert.verificationCode}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              {it.status === 'COMPLETED'
                                ? it.certificateEligible
                                  ? 'Not issued'
                                  : 'Not eligible'
                                : 'Not issued'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <button
                              onClick={() => openEdit(it)}
                              disabled={rowBusy}
                              className="p-1.5 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/25 hover:border-blue-400 dark:hover:border-blue-500/40 text-blue-600 dark:text-blue-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Edit record"
                              aria-label={`Edit internship ${it.programTitle}`}
                            >
                              <Edit3 size={14} />
                            </button>
                            {it.status !== 'COMPLETED' && (
                              <button
                                onClick={() => handleMarkComplete(it)}
                                disabled={rowBusy}
                                className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/25 hover:border-emerald-400 dark:hover:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Mark completed + certificate-eligible"
                                aria-label={`Mark ${it.programTitle} completed`}
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleGenerateCert(it)}
                              disabled={rowBusy || !canGenerate}
                              className="p-1.5 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 border border-violet-200 dark:border-violet-500/25 hover:border-violet-400 dark:hover:border-violet-500/40 text-violet-600 dark:text-violet-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                              title={
                                canGenerate
                                  ? cert
                                    ? 'Regenerate certificate (reuses existing credential)'
                                    : 'Generate certificate'
                                  : it.status === 'COMPLETED'
                                  ? 'Certificate not enabled — toggle "Certificate eligible" via Edit'
                                  : 'Mark completed & eligible to generate'
                              }
                              aria-label="Generate or regenerate certificate"
                            >
                              <Award size={14} />
                            </button>
                            {cert && (
                              <>
                                <button
                                  onClick={() => handleView(it)}
                                  disabled={rowBusy}
                                  className="p-1.5 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/25 hover:border-cyan-400 dark:hover:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="View certificate page"
                                  aria-label="View certificate"
                                >
                                  <Eye size={14} />
                                </button>
                                {cert.verificationStatus === 'VERIFIED' ? (
                                  <button
                                    onClick={() => handleToggleVerify(it)}
                                    disabled={rowBusy}
                                    className="p-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/25 hover:border-rose-400 dark:hover:border-rose-500/40 text-rose-600 dark:text-rose-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Un-verify certificate"
                                    aria-label="Un-verify certificate"
                                  >
                                    <ShieldAlert size={14} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleVerify(it)}
                                    disabled={rowBusy}
                                    className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/25 hover:border-emerald-400 dark:hover:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Verify certificate"
                                    aria-label="Verify certificate"
                                  >
                                    <ShieldCheck size={14} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleCopyLink(it)}
                                  disabled={rowBusy}
                                  className="p-1.5 bg-slate-100 dark:bg-slate-500/10 hover:bg-slate-200 dark:hover:bg-slate-500/20 border border-slate-200 dark:border-slate-500/25 hover:border-slate-400 dark:hover:border-slate-500/40 text-slate-600 dark:text-slate-300 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Copy public verify link"
                                  aria-label="Copy verification link"
                                >
                                  <Link2 size={14} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(it)}
                              disabled={rowBusy || Boolean(cert)}
                              className="p-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/25 hover:border-red-400 dark:hover:border-red-500/40 text-red-600 dark:text-red-400 rounded-lg transition active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                              title={
                                cert
                                  ? 'Delete is disabled while a certificate is issued — void the certificate first.'
                                  : 'Delete internship'
                              }
                              aria-label="Delete internship"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Footer / pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {loading && internships.length > 0 ? 'Refreshing…' : `Showing ${internships.length} of ${total} record${total === 1 ? '' : 's'}`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit modal */}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        closeOnBackdrop={false}
        title={editing ? 'Edit Internship Record' : 'New Internship Record'}
        size="xl"
        backdropClassName="bg-slate-950/80 backdrop-blur-sm"
        className="bg-slate-900 border-slate-800 rounded-2xl p-6 space-y-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              {editing ? <Edit3 size={18} className="text-cyan-400" /> : <Plus size={18} className="text-cyan-400" />}
              {editing ? 'Edit Internship Record' : 'New Internship Record'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {editing
                ? `Editing #${editing.id} — ${editing.user?.name || ''}`
                : 'Associate this internship with an existing candidate (users are never auto-created).'}
            </p>
          </div>
          <button
            onClick={closeModal}
            disabled={saving}
            aria-label="Close dialog"
            className="text-slate-500 hover:text-white p-1 rounded-lg text-lg disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Candidate picker / read-only candidate */}
          {editing ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-black flex items-center justify-center shrink-0">
                {initialsOf(editing.user?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-200 truncate">{editing.user?.name || `User #${editing.userId}`}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{editing.user?.email || '—'}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-2">
              <label className={labelCls}>Candidate (existing user)</label>
              {loadingUsers ? (
                <p className="text-[11px] text-slate-400">Loading candidates…</p>
              ) : form.userId ? (
                (() => {
                  const picked = users.find((u) => u.id === form.userId);
                  return (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          {initialsOf(picked?.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-200 truncate">{picked?.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{picked?.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, userId: null }))}
                        className="text-[10px] uppercase font-black text-cyan-400 hover:text-cyan-300 shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  );
                })()
              ) : (
                <>
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Search name, email or user id…"
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                  <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-800 divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <p className="px-3 py-4 text-center text-[11px] text-slate-500">
                        {users.length === 0 ? 'No candidates available.' : 'No matching candidates.'}
                      </p>
                    ) : (
                      filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, userId: u.id }))}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-800/60 transition"
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                            {initialsOf(u.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-200 truncate text-xs">{u.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{u.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{users.length} candidate(s) loaded.</p>
                </>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className={labelCls}>Program Title *</label>
            <input
              type="text"
              required
              data-dialog-autofocus
              value={form.programTitle}
              onChange={(e) => setForm((f) => ({ ...f, programTitle: e.target.value }))}
              placeholder="e.g. Embedded Systems Internship"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Domain *</label>
              <input
                type="text"
                required
                value={form.domain}
                onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                placeholder="e.g. Electronics / IoT / Web"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Role *</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Intern / Trainee Engineer"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 6 weeks / 45 days"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Institution</label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                placeholder="e.g. EduNexus Pro"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Branch</label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                placeholder="e.g. ECE / CSE"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Session</label>
              <input
                type="text"
                value={form.session}
                onChange={(e) => setForm((f) => ({ ...f, session: e.target.value }))}
                placeholder="e.g. 2026 Summer"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Mentor Name</label>
              <input
                type="text"
                value={form.mentorName}
                onChange={(e) => setForm((f) => ({ ...f, mentorName: e.target.value }))}
                placeholder="e.g. Er. Gaurav Singh"
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Performance Grade</label>
              <input
                type="text"
                value={form.performanceGrade}
                onChange={(e) => setForm((f) => ({ ...f, performanceGrade: e.target.value }))}
                placeholder="e.g. A / B+"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Project Title</label>
            <input
              type="text"
              value={form.projectTitle}
              onChange={(e) => setForm((f) => ({ ...f, projectTitle: e.target.value }))}
              placeholder="Capstone / project completed during the internship"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 text-xs"
              >
                {Object.keys(STATUS_STYLES).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            {editing ? (
              <label className="flex items-start gap-2 pt-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.certificateEligible}
                  onChange={(e) => setForm((f) => ({ ...f, certificateEligible: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-[11px] text-slate-300 font-semibold leading-snug">
                  Certificate eligible
                  <span className="block text-[10px] text-slate-500 font-normal">
                    Allows a certificate to be generated for this record.
                  </span>
                </span>
              </label>
            ) : (
              <p className="text-[11px] text-slate-500 pt-5 leading-relaxed">
                New records start <strong className="text-slate-300">APPLIED</strong> and are not yet
                certificate-eligible. Use <strong className="text-slate-300">Mark Completed</strong> on the row
                to complete + enable certificates.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default InternshipAdmin;
