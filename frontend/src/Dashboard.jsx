import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PolarRadiusAxis
} from 'recharts';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

// ── Custom brutalist tooltip ──────────────────────────────────────────────────
const BrutalTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2 text-xs font-black uppercase">
      {label && <p className="mb-1 text-on-surface-variant">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="text-on-surface">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span></p>
      ))}
    </div>
  );
};

export default function Dashboard({ subPage, onNavigate, showToast }) {
  const [data, setData] = useState({
    overall: { environmental_score: 0, social_score: 0, governance_score: 0, total_score: 0 },
    rankings: [],
    trend: [],
    notifications: [],
    benchmarks: [
      { indicator: "Carbon Intensity (tCO2e/$M)", baseline: 450.2, target: 380.0, status: "CRITICAL", class: "bg-error-container text-on-error-container" },
      { indicator: "Board Diversity (%)", baseline: 18.5, target: 30.0, status: "ON TRACK", class: "bg-secondary-container text-on-secondary-container" },
      { indicator: "Supply Chain Transparency", baseline: 45.0, target: 85.0, status: "IMPROVING", class: "bg-tertiary-fixed text-on-tertiary-fixed-variant" }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/system/dashboard/`);
      const result = res.data;
      setData(prev => ({
        ...prev,
        overall: {
          environmental_score: parseFloat(result.overall_score?.environmental_score || result.overall?.environmental_score) || 0,
          social_score: parseFloat(result.overall_score?.social_score || result.overall?.social_score) || 0,
          governance_score: parseFloat(result.overall_score?.governance_score || result.overall?.governance_score) || 0,
          total_score: parseFloat(result.overall_score?.total_score || result.overall?.total_score) || 0
        },
        rankings: result.rankings || result.dept_scores || [],
        trend: result.trend
          ? result.trend.map(t => ({ month: t.month.split('-')[1] || t.month, emissions: t.emissions }))
          : (result.emissions_trend || []),
        notifications: result.notifications || []
      }));
    } catch {
      if (showToast) showToast("Network error fetching dashboard data.", "error");
    }
    setLoading(false);
  };

  // Derived chart data
  const radarData = [
    { axis: 'Environmental', score: data.overall.environmental_score },
    { axis: 'Social', score: data.overall.social_score },
    { axis: 'Governance', score: data.overall.governance_score },
  ];

  const pieData = [
    { name: 'Environmental', value: data.overall.environmental_score || 1 },
    { name: 'Social', value: data.overall.social_score || 1 },
    { name: 'Governance', value: data.overall.governance_score || 1 },
  ];
  const PIE_COLORS = ['#50604b', '#2563eb', '#ea580c'];

  const deptBarData = data.rankings.map((d, i) => ({
    name: (d.department?.name || d.department_name || `Dept${i}`).substring(0, 6),
    score: parseFloat(d.total_score) || 0,
    env: parseFloat(d.environmental_score) || 0,
    soc: parseFloat(d.social_score) || 0,
    gov: parseFloat(d.governance_score) || 0,
  }));

  const trendData = data.trend.length > 0
    ? data.trend
    : [{ month: 'Jan', emissions: 0 }];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-on-background pb-8 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg uppercase tracking-tighter leading-none mb-2">
            {subPage === 'overview' && "ESG OVERVIEW DASHBOARD"}
            {subPage === 'metrics' && "QUARTERLY ESG BENCHMARKS"}
            {subPage === 'csr' && "CSR ACTIVITIES ENGAGEMENT"}
            {subPage === 'goals' && "ENVIRONMENTAL TARGETS TRACKER"}
            {subPage === 'audit' && "RECENT AUDIT LOG"}
          </h1>
          <p className="font-body-lg text-on-surface-variant border-l-4 border-secondary pl-4">
            System overview and cross-pillar ESG indicators.
          </p>
        </div>
      </div>

      {subPage === 'overview' && (
        <>
          {/* KPI Score Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Environmental Score', value: data.overall.environmental_score, color: 'border-t-secondary', nav: 'environmental' },
              { label: 'Social Score', value: data.overall.social_score, color: 'border-t-blue-600', nav: 'social' },
              { label: 'Governance Score', value: data.overall.governance_score, color: 'border-t-orange-600', nav: 'governance' },
              { label: 'Overall ESG Score', value: data.overall.total_score, color: 'border-t-on-surface', nav: null },
            ].map(({ label, value, color, nav }) => (
              <article
                key={label}
                className={`brutalist-card p-6 border-t-[6px] ${color} ${nav ? 'cursor-pointer' : ''}`}
                onClick={() => nav && onNavigate(nav)}
              >
                <h3 className="text-[11px] uppercase text-on-surface font-black mb-3 tracking-wider">{label}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-black text-on-surface">{value.toFixed(0)}</span>
                  <span className="text-xl font-bold text-on-surface-variant opacity-40">/ 100</span>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-2 bg-surface-variant border border-on-surface">
                  <div
                    className="h-full bg-on-surface transition-all duration-700"
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </article>
            ))}
          </section>

          {/* Charts Row 1: Emissions Trend + Dept Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Emissions Area Chart */}
            <section className="brutalist-card p-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined">show_chart</span>
                Emissions Trend (12 mo)
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="emissionsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#50604b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#50604b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip content={<BrutalTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    name="Emissions (t)"
                    stroke="#50604b"
                    strokeWidth={3}
                    fill="url(#emissionsGrad)"
                    dot={{ r: 4, fill: '#50604b', stroke: '#1c1b1b', strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#1c1b1b', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </section>

            {/* Department Stacked Bar Chart */}
            <section className="brutalist-card p-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined">bar_chart</span>
                Department ESG Ranking
              </h3>
              {deptBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={deptBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip content={<BrutalTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }} />
                    <Bar dataKey="env" name="Env" stackId="a" fill="#50604b" />
                    <Bar dataKey="soc" name="Social" stackId="a" fill="#2563eb" />
                    <Bar dataKey="gov" name="Gov" stackId="a" fill="#ea580c" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-60 flex items-center justify-center text-sm font-bold uppercase text-on-surface-variant">
                  No department data available.
                </div>
              )}
            </section>
          </div>

          {/* Charts Row 2: Radar + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ESG Radar Chart */}
            <section className="brutalist-card p-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined">radar</span>
                ESG Pillar Radar
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <PolarGrid stroke="#1c1b1b" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#50604b"
                    strokeWidth={2}
                    fill="#50604b"
                    fillOpacity={0.3}
                    dot={{ r: 4, fill: '#50604b', stroke: '#1c1b1b', strokeWidth: 2 }}
                  />
                  <Tooltip content={<BrutalTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </section>

            {/* ESG Pillar Pie Chart */}
            <section className="brutalist-card p-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined">donut_large</span>
                ESG Score Distribution
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#1c1b1b"
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<BrutalTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}: {entry.payload.value.toFixed(0)}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="brutalist-card p-8" data-purpose="recent-activity-list">
              <h3 className="text-sm font-black flex items-center gap-3 mb-8 uppercase tracking-widest">
                <span className="material-symbols-outlined">history</span>
                Recent Activity
              </h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 border-b border-on-surface/10 pb-4 last:border-0">
                  <span className="w-2 h-2 bg-secondary border border-on-surface"></span>
                  <span className="text-xs font-bold uppercase text-on-surface">Priya completed 'Zero Waste Week'</span>
                </li>
                <li className="flex items-center gap-4 border-b border-on-surface/10 pb-4 last:border-0">
                  <span className="w-2 h-2 bg-orange-600 border border-on-surface"></span>
                  <span className="text-xs font-bold uppercase text-on-surface">New compliance issue in Logistics</span>
                </li>
                <li className="flex items-center gap-4 border-b border-on-surface/10 pb-4 last:border-0">
                  <span className="w-2 h-2 bg-blue-600 border border-on-surface"></span>
                  <span className="text-xs font-bold uppercase text-on-surface">42 new Carbon Transactions logged</span>
                </li>
                <li className="flex items-center gap-4 pb-4 last:border-0">
                  <span className="w-2 h-2 bg-outline border border-on-surface"></span>
                  <span className="text-xs font-bold uppercase text-on-surface">R&D acknowledged Anti-Corruption Policy</span>
                </li>
              </ul>
            </section>

            <section className="brutalist-card p-8" data-purpose="quick-actions-buttons">
              <h3 className="text-sm font-black flex items-center gap-3 mb-8 uppercase tracking-widest">
                <span className="material-symbols-outlined">bolt</span>
                Quick Actions
              </h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => onNavigate('environmental')}
                  className="w-full py-4 px-6 bg-white border-2 border-on-surface hover:bg-secondary-fixed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-on-surface font-black uppercase tracking-widest text-left text-sm flex items-center gap-2"
                >
                  <span className="text-xl">+</span> Log Carbon Data
                </button>
                <button
                  onClick={() => onNavigate('gaming')}
                  className="w-full py-4 px-6 bg-tertiary-container border-2 border-on-surface hover:bg-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-white font-black uppercase tracking-widest text-left text-sm flex items-center gap-2"
                >
                  🏆 Start Challenge
                </button>
                <button
                  onClick={() => onNavigate('reports')}
                  className="w-full py-4 px-6 bg-on-surface border-2 border-on-surface hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-white font-black uppercase tracking-widest text-left text-sm flex items-center gap-2"
                >
                  📄 View Reports
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      {subPage === 'metrics' && (
        <div className="space-y-8">
          {/* Benchmark progress bars */}
          <section className="brutalist-card p-8">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Benchmark Progress</h3>
            <div className="space-y-6">
              {data.benchmarks.map((bm, i) => {
                const pct = Math.min(100, (bm.baseline / bm.target) * 100);
                const colors = ['#ef4444', '#50604b', '#2563eb'];
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black uppercase">{bm.indicator}</span>
                      <span className={`${bm.class} px-2 py-0.5 border border-on-surface text-[10px] font-black`}>{bm.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-4 bg-surface-variant border-2 border-on-surface">
                        <div
                          className="h-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: colors[i] }}
                        />
                      </div>
                      <span className="text-xs font-black w-24 text-right">{bm.baseline} / {bm.target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Benchmark table */}
          <div className="border-2 border-on-background bg-white brutalist-shadow">
            <div className="bg-primary-container text-on-primary-container p-6 border-b-2 border-on-background flex justify-between items-center">
              <h3 className="text-headline-md font-headline-md uppercase">QUARTERLY ESG BENCHMARKS</h3>
              <span className="font-label-bold text-label-bold uppercase">Sector: Heavy Industry</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-md border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b-2 border-on-background">
                    <th className="p-4 font-label-bold uppercase border-r-2 border-on-background">Indicator</th>
                    <th className="p-4 font-label-bold uppercase border-r-2 border-on-background text-center">Baseline</th>
                    <th className="p-4 font-label-bold uppercase border-r-2 border-on-background text-center">Target</th>
                    <th className="p-4 font-label-bold uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="font-label-bold">
                  {data.benchmarks.map((bm, index) => (
                    <tr key={index} className="border-b-2 border-on-background hover:bg-surface-container-low transition-colors">
                      <td className="p-4 border-r-2 border-on-background">{bm.indicator}</td>
                      <td className="p-4 border-r-2 border-on-background text-center font-mono">{bm.baseline}</td>
                      <td className="p-4 border-r-2 border-on-background text-center font-mono">{bm.target}</td>
                      <td className="p-4 text-center">
                        <span className={`${bm.class} px-2 py-1 border border-on-background text-[10px]`}>{bm.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subPage === 'csr' && (
        <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-4">CSR ACTIVITIES OVERVIEW</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Review active employee CSR targets and voluntary challenges. Go to the Social module tab to log direct employee contributions.
          </p>
          <button onClick={() => onNavigate('social')} className="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 border-2 border-on-background brutalist-button font-headline-md uppercase text-xs">
            Go to Employee Social Module
          </button>
        </div>
      )}

      {subPage === 'goals' && (
        <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-4">ENVIRONMENTAL GOALS INDEX</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Review active environmental goals and carbon emission threshold guidelines.
          </p>
          <button onClick={() => onNavigate('environmental')} className="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 border-2 border-on-background brutalist-button font-headline-md uppercase text-xs">
            Go to Environmental Module
          </button>
        </div>
      )}

      {subPage === 'audit' && (
        <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined">history</span>
            Full Audit Logs
          </h3>
          <ul className="space-y-4">
            {data.notifications.map((n, idx) => (
              <li key={idx} className="p-4 bg-error-container border-2 border-on-surface text-xs font-bold uppercase">
                {n.message} (Logged: {new Date(n.created_at).toLocaleDateString()})
              </li>
            ))}
            <li className="p-4 bg-surface-container border-2 border-on-surface text-xs font-bold uppercase">
              System Recalculation Event: Verified by user divy-mevada
            </li>
            <li className="p-4 bg-surface-container border-2 border-on-surface text-xs font-bold uppercase">
              Database connection verified: OK
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
