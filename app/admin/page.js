'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async (adminKey) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin?key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) {
        setError('Invalid admin key');
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
    } catch {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchStats(key);
  };

  const refresh = () => fetchStats(key);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">NegotiateUp Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Playbook delivery tracking</p>
          </div>
          <button
            onClick={refresh}
            className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Playbooks</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.today}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">This Week</p>
                <p className="text-3xl font-bold">{stats.thisWeek}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Revenue (est.)</p>
                <p className="text-3xl font-bold">${stats.total * 39}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">By Type</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold text-green-700">{stats.byType.offer}</p>
                    <p className="text-sm text-gray-500">Offer Playbooks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{stats.byType.raise}</p>
                    <p className="text-sm text-gray-500">Raise Playbooks</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Conversion</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold">{stats.byType.offer + stats.byType.raise > 0 ? Math.round((stats.byType.offer / (stats.byType.offer + stats.byType.raise)) * 100) : 0}%</p>
                    <p className="text-sm text-gray-500">Offer</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.byType.offer + stats.byType.raise > 0 ? Math.round((stats.byType.raise / (stats.byType.offer + stats.byType.raise)) * 100) : 0}%</p>
                    <p className="text-sm text-gray-500">Raise</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold">Recent Deliveries</h2>
              </div>
              {stats.recentDeliveries.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>No deliveries yet. They'll show up here when playbooks are generated.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Time</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Type</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentDeliveries.map((d) => (
                        <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                            {new Date(d.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              d.type === 'offer'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {d.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-medium">{d.name}</td>
                          <td className="px-6 py-3 text-gray-500">{d.email}</td>
                          <td className="px-6 py-3 text-gray-500">{d.company || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
