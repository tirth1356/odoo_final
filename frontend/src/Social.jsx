import React, { useState, useEffect } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

// Mock data removed in favor of direct API connections

export default function Social({ subPage, setSubPage, onNavigate, showToast }) {
  const [currentUser, setCurrentUser] = useState({ username: "johngreen", points: 120, xp: 350 });
  const [csrActivities, setCsrActivities] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [diversity, setDiversity] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([
    { id: 1, employee: "Arjun Mehta", avatar: "https://i.pravatar.cc/150?img=1", activity: "Tree Plantation", proof: "plantation_photo.jpg", points: 50 },
    { id: 2, employee: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=2", activity: "Blood Donation", proof: "donation_receipt.pdf", points: 100 },
  ]);
  
  // Use fallbacks for UI lists that aren't populated from DB yet
  const [csrCards] = useState([
    { id: 1, code: "CSR-092", title: "Tree Plantation", joined: 24, type: "EVIDENCE REQUIRED", icon: "park", colorClass: "text-secondary", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClYDlsyPPadayBDD5S4C8s3PcWuknkW2QAOm08rK-WkmXo6Pl9VjBjEJPJso0kAlgfwxnEiX8tLr1-TW7US_lAjbYZUmYbDPJ2VRwUaGkkHWhIGJhUuYm0bmlp2u8sAy-uo62O7pHkvU01NL1Tv3xxAla-V91_ASi3QiWCfQfjWDBJAmukoeZT5dBJeLyUhX1oCjKpyzU7zGiBQ3lIOdxo4SSz9BLknC7-ZUzGJ9BUCbQBNNJZkh6EBA" },
    { id: 2, code: "CSR-105", title: "Blood Donation", joined: 18, type: "EVIDENCE REQUIRED", icon: "water_drop", colorClass: "text-error", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Oeb_Bj2L6i6-SW1OJFrlDC8kwZpP2qVi8PjocP13Wb5LNDLCKK-Eo85ty7hRb4yS_aeGuJCmDSTt81ZeTxDz-MENf1Ug2qCO__cb54DAunOdhi_MFUtXB04E7o3tgfjbYXIoeYm-oUD_zTMmj9UW3fclCIjDAOB6bunZTAvvqvTKgDVxLLmsg2yCcLUUnUoUDgLJWxRRp73h_sduJKVyrpWIAKMc-Cq-G_Frqy63MwAEsunwAtS0AA" }
  ]);
  const [csrRecords] = useState([
    { id: 1, name: "Solar Panel Installation", date: "OCT 12, 2023", participants: 12, impact: "8.4/10", percentage: 84, status: "COMPLETED" },
    { id: 2, name: "Community Kitchen", date: "NOV 05, 2023", participants: 45, impact: "9.1/10", percentage: 91, status: "COMPLETED" }
  ]);

  // CSR Form State
  const [csrForm, setCsrForm] = useState({ csr_activity: '1', proof_description: '', proof_file_url: 'http://uploads/csr.jpg' });

  useEffect(() => {
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      const [resActs, resPart, resDiv, resTrain] = await Promise.all([
        fetch(`${API_BASE}/csr-activities/`),
        fetch(`${API_BASE}/participations/`),
        fetch(`${API_BASE}/diversity/`),
        fetch(`${API_BASE}/trainings/`)
      ]);
      if (resActs.ok) setCsrActivities(await resActs.json());
      if (resPart.ok) {
        const pList = await resPart.json();
        if (pList.length) setParticipations(pList);
      }
      if (resDiv.ok) setDiversity(await resDiv.json());
      if (resTrain.ok) setTrainings(await resTrain.json());
    } catch (e) {
      if (showToast) showToast("Failed to fetch social datasets.", "error");
    }
  };

  const handleCSRSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/participations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csr_activity: csrForm.csr_activity,
          proof_description: csrForm.proof_description,
          proof_file_url: csrForm.proof_file_url
        })
      });
      if (res.ok) {
        if (showToast) showToast("Volunteering proof submitted successfully!", "success");
        fetchSocialData();
        setCsrForm({ csr_activity: '1', proof_description: '', proof_file_url: 'http://uploads/csr.jpg' });
      } else {
        let errMsg = "Error submitting proof.";
        try {
          const errData = await res.json();
          errMsg = errData.detail || errData.message || errMsg;
        } catch (_) {}
        if (showToast) showToast(errMsg, "error");
      }
    } catch (err) {
      if (showToast) showToast("Network error submitting proof.", "error");
    }
  };

  const handleJoinOpportunity = (activityId) => {
    setCsrForm(prev => ({ ...prev, csr_activity: String(activityId) }));
    setSubPage('csr');
  };

  const handleApproveQueueItem = (id, employeeName, activity, points) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    if (showToast) showToast(`Approved ${activity} for ${employeeName}. Allocated ${points} points.`, 'success');
  };

  const handleRejectQueueItem = (id, employeeName, activity) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    if (showToast) showToast(`Rejected participation of ${employeeName} for ${activity}.`, 'error');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-on-background pb-8 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg uppercase tracking-tighter leading-none mb-2">
            {subPage === 'overview' && "SOCIAL MODULE - EMPLOYEE PARTICIPATION"}
            {subPage === 'metrics' && "SOCIAL PORTAL - DIVERSITY METRICS"}
            {subPage === 'csr' && "VOLUNTEERING & CSR ACTIVITIES LOG"}
            {subPage === 'participation' && "ADMIN AUDIT: PENDING PARTICIPATIONS"}
            {subPage === 'audit' && "CSR ACTIVITIES ARCHIVE"}
          </h1>
          <p className="font-body-lg text-on-surface-variant border-l-4 border-secondary pl-4">
            Institutional data oversight on human capital and social impact.
          </p>
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO SUBPAGE */}
      {subPage === 'overview' && (
        <>
          {/* Diversity Metrics & Training Status Bento box */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Diversity Cards */}
            <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="brutalist-card p-6 flex flex-col justify-between min-h-[160px]">
                <div className="font-label-bold text-label-bold uppercase text-on-surface-variant">Gender Diversity</div>
                <div className="text-headline-lg font-bold">42% FEMALE</div>
                <div className="w-full h-2 bg-on-surface-variant/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed w-[42%]"></div>
                </div>
              </div>
              
              <div className="brutalist-card p-6 flex flex-col justify-between min-h-[160px]">
                <div className="font-label-bold text-label-bold uppercase text-on-surface-variant">Ethnicity Balance</div>
                <div className="flex items-end space-x-1 h-12">
                  <div className="w-4 bg-primary h-full"></div>
                  <div className="w-4 bg-primary h-3/4"></div>
                  <div className="w-4 bg-primary h-1/2"></div>
                  <div className="w-4 bg-primary h-5/6"></div>
                </div>
                <div className="font-label-bold text-[10px] uppercase">Representative Targets Met</div>
              </div>
              
              <div className="brutalist-card p-6 flex flex-col justify-between min-h-[160px]">
                <div className="font-label-bold text-label-bold uppercase text-on-surface-variant">Age Distribution</div>
                <div className="text-headline-md font-bold">MEDIAN 34.2</div>
                <div className="font-label-bold text-[10px] text-secondary uppercase">Stable Retention</div>
              </div>
            </section>

            {/* Training Status */}
            <section className="col-span-12 lg:col-span-4 brutalist-card p-6 bg-surface-container-high">
              <h2 className="font-headline-md text-headline-md uppercase mb-4">TRAINING STATUS</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-label-bold text-[11px] uppercase">Anti-Corruption 2023</span>
                    <span className="font-label-bold text-[11px]">90%</span>
                  </div>
                  <div className="progress-notched border-2 border-on-surface h-3 bg-surface-variant">
                    <div className="progress-fill h-full bg-secondary-fixed w-[90%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-label-bold text-[11px] uppercase">Diversity &amp; Inclusion</span>
                    <span className="font-label-bold text-[11px]">50%</span>
                  </div>
                  <div className="progress-notched border-2 border-on-surface h-3 bg-surface-variant">
                    <div className="progress-fill h-full bg-tertiary-container w-[50%]"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* CSR Opportunities */}
          <section className="pt-8">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline-md text-headline-md uppercase">ACTIVE CSR OPPORTUNITIES</h2>
              <button onClick={() => setSubPage('csr')} className="brutalist-button bg-primary text-on-primary px-4 py-2 text-label-bold uppercase text-[10px]">
                + New Volunteering Log
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {csrCards.map((card, idx) => (
                <div key={idx} className="brutalist-card bg-surface overflow-hidden group flex flex-col justify-between">
                  <div className="h-32 w-full border-b-2 border-on-surface relative">
                    <img className="w-full h-full object-cover" src={card.image} alt={card.title} />
                    <div className="absolute top-2 right-2 bg-on-surface text-surface px-2 py-1 font-label-bold text-[10px]">{card.code}</div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`material-symbols-outlined ${card.colorClass}`}>{card.icon}</span>
                        <h3 className="font-headline-md text-[20px] uppercase truncate">{card.title}</h3>
                      </div>
                      <div className="text-label-bold text-[11px] text-on-surface-variant uppercase">
                        {card.joined} Joined | {card.type}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleJoinOpportunity(card.id)} 
                      className="brutalist-button w-full bg-secondary-container py-2 hover:bg-secondary-fixed-dim"
                    >
                      JOIN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {subPage === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Diversity stats */}
          <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
            <h4 className="font-headline-md text-headline-md uppercase mb-4">DIVERSITY STATISTICS</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left custom-table border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-on-surface">
                    <th className="p-3 font-label-bold text-xs uppercase">Dept</th>
                    <th className="p-3 font-label-bold text-xs uppercase text-center">Female %</th>
                    <th className="p-3 font-label-bold text-xs uppercase text-center">Minority %</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {diversity.length > 0 ? diversity.map((d, i) => (
                    <tr key={i} className="border-b border-on-surface/10">
                      <td className="p-3 font-bold uppercase">{d.department_name}</td>
                      <td className="p-3 text-center font-mono">{parseFloat(d.female_percentage).toFixed(1)}%</td>
                      <td className="p-3 text-center font-mono">{parseFloat(d.minority_percentage).toFixed(1)}%</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="p-3 text-center text-sm font-bold uppercase text-on-surface-variant">No diversity data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trainings records */}
          <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
            <h4 className="font-headline-md text-headline-md uppercase mb-4">TRAINING RECORD HOURS</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left custom-table border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-on-surface">
                    <th className="p-3 font-label-bold text-xs uppercase">Employee</th>
                    <th className="p-3 font-label-bold text-xs uppercase">Course Name</th>
                    <th className="p-3 font-label-bold text-xs uppercase text-right">Hours</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {trainings.length > 0 ? trainings.map(t => (
                    <tr key={t.id} className="border-b border-on-surface/10">
                      <td className="p-3 font-bold">@{t.employee_username || t.employee?.username}</td>
                      <td className="p-3 text-on-surface-variant">{t.course_name}</td>
                      <td className="p-3 text-right font-bold text-secondary font-mono">{t.duration_hours} hrs</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="p-3 text-center text-sm font-bold uppercase text-on-surface-variant">No trainings recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subPage === 'csr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* volunteering proof forms */}
          <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
            <h3 className="font-headline-md text-headline-md uppercase mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">volunteer_activism</span>
              VOLUNTEER IN CSR
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 uppercase">Earn point balances by submitting proof of your community services</p>

            <form onSubmit={handleCSRSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-label-bold text-[10px] uppercase">Select CSR Activity</label>
                <select value={csrForm.csr_activity} onChange={e => setCsrForm({...csrForm, csr_activity: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required>
                  {csrActivities.map(c => (
                    <option key={c.id} value={c.id}>{c.title} (+{c.points_earned || 30} pts)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block font-label-bold text-[10px] uppercase">Proof / Work description</label>
                <textarea rows="4" placeholder="Detail the volunteer activities accomplished..." value={csrForm.proof_description} onChange={e => setCsrForm({...csrForm, proof_description: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required></textarea>
              </div>
              <button type="submit" className="w-full bg-secondary text-on-secondary font-headline-md py-4 border-2 border-on-surface brutalist-shadow brutalist-shadow-hover uppercase text-xs">
                SUBMIT VOLUNTEERING PROOF
              </button>
            </form>
          </div>

          {/* personal volunteering ledger */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
              <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">assignment_ind</span>
                CSR VOLUNTEERING LEDGER
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left custom-table border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-on-surface">
                      <th className="p-3 font-label-bold text-xs uppercase">Date</th>
                      <th className="p-3 font-label-bold text-xs uppercase">Employee</th>
                      <th className="p-3 font-label-bold text-xs uppercase">Activity</th>
                      <th className="p-3 font-label-bold text-xs uppercase">Proof Details</th>
                      <th className="p-3 font-label-bold text-xs uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {participations.length > 0 ? participations.map(p => (
                      <tr key={p.id} className="border-b border-on-surface/10 hover:bg-surface-container-low">
                        <td className="p-3 font-label-bold">{p.completion_date}</td>
                        <td className="p-3 font-bold">@{p.employee_username || p.employee?.username}</td>
                        <td className="p-3 text-on-surface">{p.csr_activity_title || p.csr_activity?.title}</td>
                        <td className="p-3 text-on-surface-variant italic">{p.proof_description}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 border border-on-surface text-[9px] font-bold ${
                            p.approval_status.toLowerCase() === 'approved' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          }`}>
                            {p.approval_status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-3 text-center text-sm font-bold uppercase text-on-surface-variant">No participations available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {subPage === 'participation' && (
        <div className="brutalist-card bg-surface p-0 overflow-hidden">
          <div className="p-6 table-header bg-surface-container flex justify-between items-center border-b-2 border-on-surface">
            <h2 className="font-headline-md text-headline-md uppercase">EMPLOYEE PARTICIPATION: APPROVAL QUEUE</h2>
            <span className="font-label-bold px-3 py-1 bg-on-surface text-surface text-xs">{approvalQueue.length} PENDING</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md border-collapse">
              <thead className="border-b-2 border-on-surface font-label-bold uppercase text-[12px]">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Activity / Challenge</th>
                  <th className="px-6 py-4">Proof</th>
                  <th className="px-6 py-4 text-center">Points</th>
                  <th className="px-6 py-4 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-on-surface-variant/10">
                {approvalQueue.length > 0 ? (
                  approvalQueue.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full border-2 border-on-surface overflow-hidden">
                          <img className="w-full h-full object-cover" src={item.avatar} alt={item.employee} />
                        </div>
                        <span className="font-bold">{item.employee}</span>
                      </td>
                      <td className="px-6 py-4 uppercase font-bold">{item.activity}</td>
                      <td className="px-6 py-4">
                        <a className="flex items-center space-x-1 text-primary underline font-bold" href="#">
                          <span className="material-symbols-outlined text-[16px]">
                            {item.proof.endsWith('.pdf') ? 'description' : 'image'}
                          </span>
                          <span>{item.proof}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center font-label-bold text-headline-md text-secondary font-mono">{item.points}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                          <button 
                            onClick={() => handleApproveQueueItem(item.id, item.employee, item.activity, item.points)}
                            className="px-4 py-1 bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-all font-bold uppercase text-[10px]"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectQueueItem(item.id, item.employee, item.activity)}
                            className="px-4 py-1 bg-error-container text-on-error-container hover:bg-error transition-all hover:text-on-error font-bold border-l-2 border-on-surface uppercase text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant font-label-bold uppercase">
                      No pending participations in approval queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subPage === 'audit' && (
        <div className="brutalist-card bg-surface p-0 overflow-hidden">
          <div className="p-6 table-header bg-surface-container flex justify-between items-center border-b-2 border-on-surface">
            <h2 className="font-headline-md text-headline-md uppercase">CSR ACTIVITIES RECORD</h2>
            <span className="font-label-bold text-[12px] uppercase">Historical Data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md border-collapse">
              <thead className="border-b-2 border-on-surface font-label-bold uppercase text-[12px]">
                <tr>
                  <th className="px-6 py-4">Activity Name</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Participants</th>
                  <th className="px-6 py-4">Impact Score</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-on-surface-variant/10">
                {csrRecords.map(rec => (
                  <tr key={rec.id}>
                    <td className="px-6 py-4 font-bold uppercase">{rec.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{rec.date}</td>
                    <td className="px-6 py-4 font-mono">{rec.participants}</td>
                    <td className="px-6 py-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-surface-container border border-on-surface">
                          <div className="h-full bg-secondary-fixed" style={{ width: `${rec.percentage}%` }}></div>
                        </div>
                        <span className="font-bold">{rec.impact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 border border-on-surface font-label-bold text-[10px] uppercase ${
                        rec.status === 'COMPLETED' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
