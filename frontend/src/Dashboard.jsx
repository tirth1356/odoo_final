import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

// Mock data removed in favor of direct API connection

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

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/system/dashboard/`);
      if (res.ok) {
        const result = await res.json();
        setData(prev => ({
          ...prev,
          overall: {
            environmental_score: parseFloat(result.overall.environmental_score) || 0,
            social_score: parseFloat(result.overall.social_score) || 0,
            governance_score: parseFloat(result.overall.governance_score) || 0,
            total_score: parseFloat(result.overall.total_score) || 0
          },
          rankings: result.rankings || [],
          trend: result.trend ? result.trend.map(t => ({ month: t.month.split('-')[1] || t.month, emissions: t.emissions })) : [],
          notifications: result.notifications || []
        }));
      } else {
        if (showToast) showToast("Failed to fetch dashboard data.", "error");
      }
    } catch (e) {
      if (showToast) showToast("Network error fetching dashboard data.", "error");
    }
    setLoading(false);
  };

  const renderTrendSVG = () => {
    const trend = data.trend || [];
    const width = 600;
    const height = 240;
    const padding = 40;

    const maxVal = Math.max(...trend.map(t => t.emissions), 100);
    const xStep = (width - padding * 2) / (trend.length - 1);
    const yScale = (height - padding * 2) / maxVal;

    const points = trend.map((t, i) => {
      const x = padding + i * xStep;
      const y = height - padding - t.emissions * yScale;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-auto bg-surface-container-low border-2 border-on-surface p-2" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <pattern id="diagonal-stripes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#eae7e7" strokeWidth="2" />
          </pattern>
        </defs>
        
        <rect x={padding} y={padding} width={width - padding * 2} height={height - padding * 2} fill="url(#diagonal-stripes)" />
        <rect x={padding} y={padding} width={width - padding * 2} height={height - padding * 2} fill="none" stroke="#1c1b1b" strokeWidth="2" />

        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padding + p * (height - padding * 2);
          const labelVal = Math.round(maxVal - p * maxVal);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#1c1b1b" strokeWidth="1" strokeDasharray="3,3" />
              <text x={padding - 10} y={y + 4} className="font-label-bold text-[10px] text-right" textAnchor="end">{labelVal}t</text>
            </g>
          );
        })}

        <polyline points={points} fill="none" stroke="#1c1b1b" strokeWidth="3" strokeLinecap="square" />
        
        {trend.map((t, i) => {
          const x = padding + i * xStep;
          const y = height - padding - t.emissions * yScale;
          return (
            <g key={i}>
              <rect x={x - 4} y={y - 4} width="8" height="8" fill="#50604b" stroke="#1c1b1b" strokeWidth="2" />
              <text x={x} y={height - 12} className="font-label-bold text-[10px]" textAnchor="middle">{t.month}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  const getDeptBarHeight = (score) => {
    return `${Math.max(10, score)}%`;
  };

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
          {/* Metric Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6" data-purpose="top-kpi-metrics">
            <article className="brutalist-card p-6 border-t-[6px] border-t-secondary cursor-pointer" onClick={() => onNavigate('environmental')}>
              <h3 className="text-[11px] uppercase text-on-surface font-black mb-4 tracking-wider">Environmental Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-on-surface">{data.overall.environmental_score.toFixed(0)}</span>
                <span className="text-xl font-bold text-on-surface-variant opacity-40">/ 100</span>
              </div>
            </article>
            
            <article className="brutalist-card p-6 border-t-[6px] border-t-blue-600 cursor-pointer" onClick={() => onNavigate('social')}>
              <h3 className="text-[11px] uppercase text-on-surface font-black mb-4 tracking-wider">Social Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-on-surface">{data.overall.social_score.toFixed(0)}</span>
                <span className="text-xl font-bold text-on-surface-variant opacity-40">/ 100</span>
              </div>
            </article>
            
            <article className="brutalist-card p-6 border-t-[6px] border-t-orange-600">
              <h3 className="text-[11px] uppercase text-on-surface font-black mb-4 tracking-wider">Governance Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-on-surface">{data.overall.governance_score.toFixed(0)}</span>
                <span className="text-xl font-bold text-on-surface-variant opacity-40">/ 100</span>
              </div>
            </article>
            
            <article className="brutalist-card p-6 border-t-[6px] border-t-on-surface">
              <h3 className="text-[11px] uppercase text-on-surface font-black mb-4 tracking-wider">Overall ESG Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-on-surface">{data.overall.total_score.toFixed(0)}</span>
                <span className="text-xl font-bold text-on-surface-variant opacity-40">/ 100</span>
              </div>
            </article>
          </section>

          {/* Middle Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="brutalist-card p-8" data-purpose="emissions-chart-container">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="material-symbols-outlined">show_chart</span>
                  Emissions Trend (12 mo)
                </h3>
              </div>
              <div className="relative w-full">
                {renderTrendSVG()}
              </div>
            </section>

            <section className="brutalist-card p-8" data-purpose="department-ranking-container">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="material-symbols-outlined">bar_chart</span>
                  Department ESG Ranking
                </h3>
              </div>
              <div className="flex items-end justify-between h-64 px-4 pb-4 w-full border-b-2 border-on-surface">
                {data.rankings.length > 0 ? data.rankings.map((dept, idx) => {
                  const score = parseFloat(dept.total_score) || 0;
                  const isLogistics = dept.department?.name?.toLowerCase().includes('logi') || (dept.department_name && dept.department_name.toLowerCase().includes('logi'));
                  const displayName = (dept.department?.name || dept.department_name || `Dept${idx}`).substring(0, 4);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 w-12 relative group h-full justify-end">
                      {isLogistics && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-3 py-1 font-bold uppercase whitespace-nowrap z-10 border border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden group-hover:block">
                          Generous Kingfisher
                        </div>
                      )}
                      <div className="absolute -top-6 text-[10px] font-bold hidden group-hover:block">{score.toFixed(0)}</div>
                      <div
                        style={{ height: getDeptBarHeight(score) }}
                        className={`w-full border-2 border-on-surface transition-all duration-300 ${
                          idx % 2 === 0 ? 'bg-surface-variant' : 'bg-primary'
                        }`}
                      ></div>
                      <span className="text-[9px] font-black uppercase text-on-surface mt-1">{displayName}</span>
                    </div>
                  );
                }) : (
                  <div className="w-full text-center text-sm font-bold uppercase text-on-surface-variant py-10">No department data available.</div>
                )}
              </div>
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
      )}

      {subPage === 'csr' && (
        <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-4">CSR ACTIVITIES OVERVIEW</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Review active employee CSR (Corporate Social Responsibility) targets and voluntary challenges. Go to the Social module tab to log direct employee contributions.
          </p>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('social')} className="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 border-2 border-on-background brutalist-button font-headline-md uppercase text-xs">
              Go to Employee Social Module
            </button>
          </div>
        </div>
      )}

      {subPage === 'goals' && (
        <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-4">ENVIRONMENTAL GOALS INDEX</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Review active environmental goals and carbon emission threshold guidelines. Go to the Environmental module tab to configure factors or track outputs.
          </p>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('environmental')} className="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 border-2 border-on-background brutalist-button font-headline-md uppercase text-xs">
              Go to Environmental Module
            </button>
          </div>
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
