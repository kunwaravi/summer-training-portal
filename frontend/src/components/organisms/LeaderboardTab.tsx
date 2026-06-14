import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Award, Shield, Search, Flame, Zap, Trophy, Medal } from 'lucide-react';
import Spinner from '../atoms/Spinner';
import Card from '../atoms/Card';

interface LeaderboardUser {
  id: number;
  name: string;
  email: string;
  points: number;
  badges: string[];
  collegeName: string | null;
  avatarUrl: string | null;
  role: string;
}

interface LeaderboardTabProps {
  currentUserId: number | undefined;
}

const badgeMetadata: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  perfect_score: {
    label: 'Perfect Score',
    icon: '💯',
    color: 'bg-red-500/10 border-red-500/30 text-red-400',
    desc: 'Scored 100% on a quiz assessment'
  },
  week_1_master: {
    label: 'Week 1 Master',
    icon: '🎓',
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    desc: 'Successfully completed the Week 1 quiz'
  },
  bug_hunter: {
    label: 'Bug Hunter',
    icon: '🐛',
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    desc: 'Attempted and submitted a coding practice arena session'
  }
};

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ currentUserId }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/practice/leaderboard`, {
        params: {
          search,
          page,
          limit: 10
        }
      });
      setUsers(res.data.leaderboard);
      setTotalPages(res.data.meta.totalPages || 1);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy size={18} className="text-yellow-400 animate-bounce" />;
    if (rank === 2) return <Medal size={18} className="text-slate-350" />;
    if (rank === 3) return <Medal size={18} className="text-amber-600" />;
    return <span className="text-slate-500 font-mono text-xs">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            Global Hall of Fame
          </h2>
          <p className="text-slate-400 text-xs font-semibold">
            See where you rank against fellow students across all training modules.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="md" />
        </div>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          No candidates found. Start practicing to top the board!
        </Card>
      ) : (
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] text-slate-500 font-black uppercase tracking-wider bg-slate-950/20">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-4">Student Details</th>
                  <th className="py-4 px-4 hidden md:table-cell">College</th>
                  <th className="py-4 px-4">Achievements</th>
                  <th className="py-4 px-6 text-right w-32">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {users.map((item, idx) => {
                  const globalRank = (page - 1) * 10 + idx + 1;
                  const isCurrentUser = item.id === currentUserId;
                  const initials = item.name ? item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'EN';
                  
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-slate-900/20 ${
                        isCurrentUser ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center">
                          {getRankBadge(globalRank)}
                        </div>
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full font-black text-[10px] flex items-center justify-center shadow-md ${
                            globalRank === 1 ? 'bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950' : 
                            isCurrentUser ? 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white' : 
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                              {item.name}
                              {isCurrentUser && <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-black rounded uppercase tracking-wider">You</span>}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* College */}
                      <td className="py-4 px-4 hidden md:table-cell text-xs text-slate-400">
                        {item.collegeName || 'Polytechnic Institute'}
                      </td>

                      {/* Badges Column */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.badges && item.badges.length > 0 ? (
                            item.badges.map((b) => {
                              const meta = badgeMetadata[b];
                              if (!meta) return null;
                              return (
                                <span
                                  key={b}
                                  title={meta.desc}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${meta.color} cursor-help transition-all hover:scale-105`}
                                >
                                  <span>{meta.icon}</span>
                                  <span>{meta.label}</span>
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-slate-600 text-[10px] italic">No badges unlocked</span>
                          )}
                        </div>
                      </td>

                      {/* Points / XP */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Zap size={13} className="text-amber-400 fill-amber-400 animate-pulse" />
                          <span className="text-xs font-black text-white font-mono">{item.points} <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">XP</span></span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-slate-950/20 border-t border-slate-900/50 text-xs">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 rounded-lg text-slate-300 font-bold tracking-wider uppercase transition-colors"
              >
                Previous
              </button>
              <span className="text-slate-500 font-semibold">
                Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 rounded-lg text-slate-300 font-bold tracking-wider uppercase transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;
