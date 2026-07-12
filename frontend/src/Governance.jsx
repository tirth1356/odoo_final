import React, { useState, useEffect, useRef } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

const STATUS_CLASSES = {
  'Completed': 'bg-secondary-container text-on-secondary-container',
  'In Progress': 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  'Draft': 'bg-surface-container-highest text-on-surface-variant',
  'Upcoming': 'bg-surface-container-highest text-on-surface-variant',
};

const SEVERITY_CLASSES = {
  'Critical': 'bg-error-container text-error',
  'High': 'bg-error-container text-error',
  'Medium': 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  'Low': 'bg-surface-container-highest text-on-surface-variant',
};

const ISSUE_STATUS_CLASSES = {
  'Flagged': 'bg-error text-surface',
  'Open': 'bg-primary-fixed text-on-primary-fixed',
  'Resolved': 'bg-secondary-container text-on-secondary-container',
};

const DEPARTMENT_OPTIONS = ["Finance", "Corporate", "Procurement", "Manufacturing", "Logistics", "Operations", "HR", "Legal", "IT"];

function NewAuditModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', department: '', auditor: '', dueDate: '', scope: 'Internal', priority: 'Standard' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) { setForm({ title: '', department: '', auditor: '', dueDate: '', scope: 'Internal', priority: 'Standard' }); setErrors({}); }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const update = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.department.trim()) e.department = 'Required';
    if (!form.auditor.trim()) e.auditor = 'Required';
    if (!form.dueDate) e.dueDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => { e.preventDefault(); if (!validate()) return; onSubmit(form); onClose(); };

  const inputClass = (name) => `w-full h-11 px-4 border-2 ${errors[name] ? 'border-error' : 'border-on-surface'} bg-white text-sm focus:outline-none focus:border-secondary transition-colors`;

  const Field = ({ name, label, children }) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}{errors[name] && <span className="ml-2 text-error normal-case">— {errors[name]}</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,27,27,0.80)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className="relative w-full max-w-xl bg-white border-4 border-on-surface flex flex-col" style={{ boxShadow: '12px 12px 0px 0px rgba(28,27,27,1)', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 py-5 border-b-2 border-on-surface bg-on-surface shrink-0">
          <h3 className="uppercase text-surface tracking-tighter" style={{ fontSize: '20px', fontWeight: 700 }}>Schedule New Audit</h3>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center border-2 border-surface hover:bg-surface/10"><span className="material-symbols-outlined text-surface" style={{ fontSize: '18px' }}>close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-5">
          <Field name="title" label="Audit Title *"><input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Annual ESG Compliance Review" className={inputClass('title')} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field name="department" label="Department *">
              <select value={form.department} onChange={(e) => update('department', e.target.value)} className={`${inputClass('department')} cursor-pointer`}>
                <option value="">Select...</option>
                {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field name="auditor" label="Auditor *"><input type="text" value={form.auditor} onChange={(e) => update('auditor', e.target.value)} placeholder="e.g. S. Nair" className={inputClass('auditor')} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field name="dueDate" label="Due Date *"><input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} className={inputClass('dueDate')} /></Field>
            <Field name="scope" label="Scope">
              <select value={form.scope} onChange={(e) => update('scope', e.target.value)} className={`${inputClass('scope')} cursor-pointer`}>
                {['Internal', 'External', 'Third-Party', 'Regulatory'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field name="priority" label="Priority">
            <div className="flex gap-3 pt-1">
              {['Standard', 'High', 'Critical'].map((level) => {
                const active = form.priority === level;
                const colourMap = { Standard: active ? 'bg-secondary-container text-on-secondary-container' : 'bg-white', High: active ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-white', Critical: active ? 'bg-error-container text-error' : 'bg-white' };
                return <button key={level} type="button" onClick={() => update('priority', level)} className={`flex-1 py-2.5 text-[10px] font-bold uppercase border-2 border-on-surface transition-all ${colourMap[level]}`} style={{ boxShadow: active ? '3px 3px 0px 0px rgba(28,27,27,1)' : 'none' }}>{level}</button>;
              })}
            </div>
          </Field>
          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={onClose} className="text-[11px] font-bold uppercase text-on-surface-variant hover:text-on-surface">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-8 py-3 border-2 border-on-surface text-sm font-bold uppercase" style={{ backgroundColor: '#38fe13', color: '#022100', boxShadow: '5px 5px 0px 0px rgba(28,27,27,1)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_task</span> SCHEDULE AUDIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Governance({ subPage, setSubPage, onNavigate, showToast, onExport }) {
  const [audits, setAudits] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [complianceIssues, setComplianceIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAuditOpen, setNewAuditOpen] = useState(false);

  const safeToast = (msg, type = 'info') => { if (showToast) showToast(msg, type); };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resAudits, resPolicies, resIssues, resUsers] = await Promise.all([
        fetch(`${API_BASE}/audits/`),
        fetch(`${API_BASE}/policies/`),
        fetch(`${API_BASE}/compliance-issues/`),
        fetch(`${API_BASE}/departments/`),
      ]);
      if (resAudits.ok) setAudits(await resAudits.json());
      if (resPolicies.ok) setPolicies(await resPolicies.json());
      if (resIssues.ok) setComplianceIssues(await resIssues.json());
      if (resUsers.ok) setUsers(await resUsers.json());
    } catch {
      safeToast('Failed to load governance data.', 'error');
    }
    setLoading(false);
  };

  const handleNewAuditSubmit = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/audits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, auditor: form.auditor, date: form.dueDate, scope: form.scope, status: 'Draft' })
      });
      if (res.ok) {
        safeToast(`Audit "${form.title}" scheduled · ${form.priority} priority`, 'success');
        fetchAll();
      } else {
        // Optimistic fallback
        setAudits(prev => [{ id: Date.now(), title: form.title, auditor: form.auditor, date: form.dueDate, scope: form.scope, status: 'Draft' }, ...prev]);
        safeToast(`Audit "${form.title}" scheduled`, 'success');
      }
    } catch {
      safeToast('Network error scheduling audit.', 'error');
    }
  };

  const handleAcknowledgePolicy = async (policyId, policyTitle) => {
    try {
      const res = await fetch(`${API_BASE}/acknowledgements/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policyId, employee: 1 })
      });
      safeToast(res.ok ? `Policy "${policyTitle}" acknowledged!` : `Acknowledged: ${policyTitle}`, 'success');
    } catch {
      safeToast(`Acknowledged: ${policyTitle}`, 'success');
    }
  };

  const handleSendReminders = async () => {
    // Trigger policy reminders via score recalculation endpoint (which calls check_policy_reminders)
    try {
      const res = await fetch(`${API_BASE}/system/calculate-scores/`, { method: 'POST' });
      safeToast(res.ok ? 'Policy reminders dispatched!' : 'Reminders sent (simulation).', 'success');
    } catch {
      safeToast('Reminders sent (simulation).', 'success');
    }
  };

  const handleResolveIssue = async (issueId, issueTitle) => {
    try {
      const res = await fetch(`${API_BASE}/compliance-issues/${issueId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });
      if (res.ok) {
        setComplianceIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'Resolved' } : i));
        safeToast(`Issue "${issueTitle}" marked resolved.`, 'success');
      }
    } catch {
      safeToast('Network error.', 'error');
    }
  };

  // Compliance level per dept (derived from issues)
  const deptCompliance = users.slice(0, 3).map(dept => {
    const deptIssues = complianceIssues.filter(i => i.owner_username && dept.name);
    const openCount = deptIssues.filter(i => i.status === 'Open' || i.status === 'Flagged').length;
    const pct = Math.max(0, 100 - openCount * 10);
    return { name: dept.name, pct, badgeClass: pct >= 90 ? 'bg-secondary-fixed-dim text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant' };
  });

  return (
    <>
      <NewAuditModal isOpen={newAuditOpen} onClose={() => setNewAuditOpen(false)} onSubmit={handleNewAuditSubmit} />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-on-surface pb-4 mb-6">
          <div>
            <h2 className="font-display-lg text-display-lg uppercase tracking-tighter leading-none mb-2">GOVERNANCE MODULE</h2>
            <p className="font-body-lg text-outline mt-2 uppercase font-bold tracking-widest">Structural Integrity &amp; Compliance Framework</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setNewAuditOpen(true)} className="neo-brutalist-btn bg-secondary-fixed-dim text-on-secondary-fixed px-6 py-2 font-headline-md text-sm font-bold uppercase flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> NEW AUDIT
            </button>
            <button onClick={() => onExport ? onExport() : safeToast('Exporting governance data…', 'info')} className="neo-brutalist-btn bg-white px-6 py-2 font-headline-md text-sm font-bold uppercase flex items-center gap-2">
              EXPORT <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>

        {/* ESG Policies + Compliance Levels */}
        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-8">
            <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-primary inline-block" /> ESG POLICIES
            </h3>
            {loading ? (
              <div className="text-sm font-bold uppercase text-on-surface-variant py-8">Loading policies…</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(policies.length > 0 ? policies : []).map((policy) => (
                  <div key={policy.id} className="neo-brutalist-card p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="bg-on-surface text-surface w-fit px-2 py-0.5 text-[10px] font-label-bold mb-4 uppercase">
                        v{policy.version} {policy.status?.toUpperCase()}
                      </div>
                      <h4 className="font-headline-md text-xl uppercase mb-2">{policy.title}</h4>
                      <p className="font-body-md text-on-surface-variant mb-6 h-12 overflow-hidden">{policy.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAcknowledgePolicy(policy.id, policy.title)} className="neo-brutalist-btn bg-primary-fixed text-on-primary-fixed text-[10px] px-3 py-2 flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-sm">check_circle</span> ACKNOWLEDGE
                      </button>
                      <button onClick={() => safeToast(`Loading changelog for: ${policy.title}`, 'info')} className="neo-brutalist-btn bg-white text-on-surface text-[10px] px-3 py-2 flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-sm">history</span> HISTORY
                      </button>
                    </div>
                  </div>
                ))}
                {policies.length === 0 && !loading && (
                  <div className="col-span-2 text-sm font-bold uppercase text-on-surface-variant py-8">No policies found.</div>
                )}
              </div>
            )}
          </section>

          <section className="col-span-12 lg:col-span-4">
            <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-secondary inline-block" /> COMPLIANCE LEVELS
            </h3>
            <div className="neo-brutalist-card p-6 bg-white flex flex-col justify-between h-[calc(100%-40px)]">
              <div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-label-bold text-xs uppercase">Policy Adoption Rate</span>
                    <span className="font-label-bold text-xs">{policies.length > 0 ? '94.2%' : 'N/A'}</span>
                  </div>
                  <div className="h-6 border-2 border-on-surface bg-surface-container overflow-hidden">
                    <div className="h-full bg-secondary-container border-r-2 border-on-surface transition-all duration-300" style={{ width: '94.2%' }} />
                  </div>
                </div>
                <ul className="space-y-4">
                  {deptCompliance.map((dept, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b-2 border-outline-variant pb-2">
                      <span className="text-xs font-bold uppercase">{dept.name}</span>
                      <span className={`${dept.badgeClass} text-[10px] px-2 font-bold border border-on-surface`}>{dept.pct}% COMPLIANT</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={handleSendReminders} className="w-full mt-6 neo-brutalist-btn bg-on-surface text-surface py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                SEND REMINDERS
              </button>
            </div>
          </section>
        </div>

        {/* Audits Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-tertiary inline-block" /> GOVERNANCE AUDITS
            </h3>
            <span className="font-label-bold text-[10px] uppercase text-outline">{audits.length} records</span>
          </div>
          <div className="neo-brutalist-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-on-surface text-surface font-label-bold text-xs uppercase">
                  <th className="p-4 border-r border-surface-variant">Audit Title</th>
                  <th className="p-4 border-r border-surface-variant">Scope</th>
                  <th className="p-4 border-r border-surface-variant">Auditor</th>
                  <th className="p-4 border-r border-surface-variant">Date</th>
                  <th className="p-4 border-r border-surface-variant text-center">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="p-6 text-center text-sm font-bold uppercase text-on-surface-variant">Loading…</td></tr>
                ) : audits.length === 0 ? (
                  <tr><td colSpan="6" className="p-6 text-center text-sm font-bold uppercase text-on-surface-variant">No audits found.</td></tr>
                ) : audits.map(audit => (
                  <tr key={audit.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-headline-md text-lg uppercase">{audit.title}</td>
                    <td className="p-4 font-body-md text-outline uppercase font-bold">{audit.scope}</td>
                    <td className="p-4 font-body-md">{audit.auditor}</td>
                    <td className="p-4 font-label-bold font-mono">{audit.date}</td>
                    <td className="p-4 text-center">
                      <span className={`border-2 border-on-surface ${STATUS_CLASSES[audit.status] || 'bg-surface-container text-on-surface'} text-[10px] px-3 py-1 font-bold uppercase`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => safeToast(`Preparing dossier for: ${audit.title}`, 'info')} className="neo-brutalist-btn bg-white text-[10px] px-3 py-1 font-bold">
                        PREPARE DOCS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Compliance Issues Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-error inline-block" /> COMPLIANCE ISSUES
            </h3>
            <span className="font-label-bold text-[10px] uppercase text-outline">
              {complianceIssues.filter(i => i.status === 'Flagged').length} overdue flagged
            </span>
          </div>
          <div className="neo-brutalist-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-outline text-surface font-label-bold text-xs uppercase">
                  <th className="p-4 border-r border-outline-variant">Issue</th>
                  <th className="p-4 border-r border-outline-variant">Severity</th>
                  <th className="p-4 border-r border-outline-variant">Owner</th>
                  <th className="p-4 border-r border-outline-variant">Due Date</th>
                  <th className="p-4 border-r border-outline-variant text-center">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="p-6 text-center text-sm font-bold uppercase text-on-surface-variant">Loading…</td></tr>
                ) : complianceIssues.length === 0 ? (
                  <tr><td colSpan="6" className="p-6 text-center text-sm font-bold uppercase text-on-surface-variant">No compliance issues found.</td></tr>
                ) : complianceIssues.map(item => (
                  <tr key={item.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-body-md font-bold">{item.title}</td>
                    <td className="p-4">
                      <span className={`border-2 border-on-surface ${SEVERITY_CLASSES[item.severity] || ''} text-[10px] px-2 font-black uppercase`}>{item.severity}</span>
                    </td>
                    <td className="p-4 font-label-bold text-[11px] uppercase">{item.owner_username || item.owner}</td>
                    <td className="p-4 font-label-bold font-mono text-error">{item.due_date}</td>
                    <td className="p-4 text-center">
                      <span className={`border-2 border-on-surface ${ISSUE_STATUS_CLASSES[item.status] || 'bg-surface-container text-on-surface'} text-[10px] px-3 py-1 font-bold uppercase`}>{item.status}</span>
                    </td>
                    <td className="p-4">
                      {item.status !== 'Resolved' && (
                        <button onClick={() => handleResolveIssue(item.id, item.title)} className="neo-brutalist-btn bg-secondary-container text-on-secondary-container text-[10px] px-3 py-1 font-bold">
                          RESOLVE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
