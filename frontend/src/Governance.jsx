import React, { useState, useEffect, useRef } from 'react';

const MOCK_AUDITS = [
  { id: 1, title: "Internal Fiscal Audit Q3", department: "Finance", auditor: "S. Nair", date: "2024-09-12", status: "Completed", statusClass: "bg-secondary-container text-on-secondary-container" },
  { id: 2, title: "Global ESG Compliance", department: "Corporate", auditor: "R. Iyer", date: "2024-10-01", status: "Under Review", statusClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  { id: 3, title: "Vendor Compliance Check", department: "Procurement", auditor: "M. Thompson", date: "2024-11-15", status: "Upcoming", statusClass: "bg-surface-container-highest text-on-surface-variant" }
];

const MOCK_COMPLIANCE_TRACK = [
  { id: 1, description: "Missing MSDS sheets in Warehouse B", severity: "High", severityClass: "bg-error-container text-error", owner: "L. Martinez (Operations)", date: "2024-08-20", status: "Overdue", statusClass: "bg-error text-surface" },
  { id: 2, description: "Late vendor carbon disclosure reports", severity: "Medium", severityClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant", owner: "J. Wu (Procurement)", date: "2024-09-05", status: "In Progress", statusClass: "bg-primary-fixed text-on-primary-fixed" },
  { id: 3, description: "Annual Board of Directors diversity audit", severity: "Low", severityClass: "bg-surface-container-highest text-on-surface-variant", owner: "K. Smith (Governance)", date: "2024-12-10", status: "Completed", statusClass: "bg-secondary-container text-on-secondary-container" }
];

const MOCK_POLICIES = [
  { id: 1, title: "Code of Conduct", version: "v4.2 ACTIVE", desc: "Primary framework for ethical operations, labor standards, and anti-corruption protocols across all departments.", icon: "gavel" },
  { id: 2, title: "Data Privacy Protocol", version: "v1.8 ACTIVE", desc: "GDPR and CCPA compliant handling of stakeholder data and proprietary environmental reporting metrics.", icon: "lock" }
];

const MOCK_DEPT_COMPLIANCE = [
  { name: "Manufacturing Div.", percentage: "100% COMPLIANT", badgeClass: "bg-secondary-fixed-dim text-on-secondary-fixed" },
  { name: "Logistics & Supply", percentage: "91% COMPLIANT", badgeClass: "bg-secondary-fixed-dim text-on-secondary-fixed" },
  { name: "Admin & Corporate", percentage: "82% COMPLIANT", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant" }
];

const DEPARTMENT_OPTIONS = ["Finance", "Corporate", "Procurement", "Logistics", "Operations", "HR", "Legal", "IT"];

const NewAuditModalField = ({ name, label, children, errors }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {label}
      {errors?.[name] && (
        <span className="ml-2 text-error normal-case tracking-normal">— {errors[name]}</span>
      )}
    </label>
    {children}
  </div>
);

const getNewAuditModalInputClass = (name, errors) =>
  `w-full h-11 px-4 border-2 ${errors?.[name] ? 'border-error' : 'border-on-surface'} bg-white text-sm text-black focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 placeholder:text-[11px] placeholder:uppercase`;

/* ─────────────────────────────────────────────
   New Audit Modal  – styled Neo-Brutalist form
───────────────────────────────────────────── */
function NewAuditModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', department: '', auditor: '', dueDate: '', scope: 'Internal', priority: 'Standard' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({ title: '', department: '', auditor: '', dueDate: '', scope: 'Internal', priority: 'Standard' });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())      e.title      = 'Audit title is required';
    if (!form.department.trim()) e.department  = 'Department is required';
    if (!form.auditor.trim())    e.auditor     = 'Auditor name is required';
    if (!form.dueDate)           e.dueDate     = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(28,27,27,0.80)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-audit-title"
    >
      <div
        className="relative w-full max-w-xl bg-white border-4 border-on-surface flex flex-col"
        style={{ boxShadow: '12px 12px 0px 0px rgba(28,27,27,1)', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ───────────────────────────────── */}
        <div className="flex items-center justify-between px-7 py-5 border-b-2 border-on-surface bg-on-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-surface flex items-center justify-center bg-secondary-container">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                fact_check
              </span>
            </div>
            <div>
              <h3
                id="new-audit-title"
                className="uppercase text-surface tracking-tighter leading-none"
                style={{ fontFamily: 'Archivo Narrow, sans-serif', fontSize: '20px', fontWeight: 700 }}
              >
                Schedule New Audit
              </h3>
              <p className="text-surface-variant text-[10px] uppercase tracking-widest mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Governance Compliance Module
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border-2 border-surface bg-transparent hover:bg-surface/10 transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-surface" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* ── BODY ─────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7">
          <div className="space-y-5">

            {/* Audit Title */}
            <NewAuditModalField name="title" label="Audit Title *" errors={errors}>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Annual ESG Compliance Review"
                className={getNewAuditModalInputClass('title', errors)}
              />
            </NewAuditModalField>

            {/* Department + Auditor row */}
            <div className="grid grid-cols-2 gap-4">
              <NewAuditModalField name="department" label="Target Department *" errors={errors}>
                <select
                  value={form.department}
                  onChange={(e) => update('department', e.target.value)}
                  className={`${getNewAuditModalInputClass('department', errors)} cursor-pointer`}
                >
                  <option value="">Select dept...</option>
                  {DEPARTMENT_OPTIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </NewAuditModalField>

              <NewAuditModalField name="auditor" label="Assigned Auditor *" errors={errors}>
                <input
                  type="text"
                  value={form.auditor}
                  onChange={(e) => update('auditor', e.target.value)}
                  placeholder="e.g. S. Nair"
                  className={getNewAuditModalInputClass('auditor', errors)}
                />
              </NewAuditModalField>
            </div>

            {/* Due Date + Scope row */}
            <div className="grid grid-cols-2 gap-4">
              <NewAuditModalField name="dueDate" label="Target Due Date *" errors={errors}>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update('dueDate', e.target.value)}
                  className={getNewAuditModalInputClass('dueDate', errors)}
                />
              </NewAuditModalField>

              <NewAuditModalField name="scope" label="Audit Scope" errors={errors}>
                <select
                  value={form.scope}
                  onChange={(e) => update('scope', e.target.value)}
                  className={`${getNewAuditModalInputClass('scope', errors)} cursor-pointer`}
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Third-Party">Third-Party</option>
                  <option value="Regulatory">Regulatory</option>
                </select>
              </NewAuditModalField>
            </div>

            {/* Priority toggle chips */}
            <NewAuditModalField name="priority" label="Priority Level" errors={errors}>
              <div className="flex gap-3 pt-1">
                {['Standard', 'High', 'Critical'].map((level) => {
                  const active = form.priority === level;
                  const colourMap = {
                    Standard: active ? 'bg-secondary-container text-on-secondary-container' : 'bg-white',
                    High:     active ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-white',
                    Critical: active ? 'bg-error-container text-error' : 'bg-white',
                  };
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => update('priority', level)}
                      className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest border-2 border-on-surface transition-all ${colourMap[level]}`}
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        boxShadow: active ? '3px 3px 0px 0px rgba(28,27,27,1)' : 'none',
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </NewAuditModalField>

            {/* Info strip */}
            <div className="flex items-start gap-3 p-4 border-2 border-on-surface bg-primary-fixed">
              <span className="material-symbols-outlined text-on-surface shrink-0 mt-0.5" style={{ fontSize: '16px' }}>info</span>
              <p className="text-[11px] text-on-surface uppercase leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                New audits default to <strong>Upcoming</strong> status. The assigned auditor will receive an in-app notification once submitted.
              </p>
            </div>
          </div>

          {/* ── FOOTER ──────────────────────────────── */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors tracking-widest"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 border-2 border-on-surface text-sm font-bold uppercase transition-all"
              style={{
                fontFamily: 'Archivo Narrow, sans-serif',
                backgroundColor: '#38fe13',
                color: '#022100',
                boxShadow: '5px 5px 0px 0px rgba(28,27,27,1)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>add_task</span>
              SCHEDULE AUDIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Governance Component
───────────────────────────────────────────── */
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

export default function Governance({ subPage, setSubPage, onNavigate, showToast, onExport }) {
  const [audits, setAudits] = useState([]);
  const [complianceTrack] = useState(MOCK_COMPLIANCE_TRACK);
  const [newAuditOpen, setNewAuditOpen] = useState(false);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const res = await fetch(`${API_BASE}/audits/`);
      if (res.ok) {
        const data = await res.json();
        // Map API data to UI format
        const mapped = data.map(audit => ({
          id: audit.id,
          title: audit.title,
          department: 'Corporate',
          auditor: audit.auditor,
          date: audit.date,
          status: audit.status,
          statusClass: (
            audit.status === 'Completed' ?
              'bg-secondary-container text-on-secondary-container' :
            audit.status === 'In Progress' ?
              'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
              'bg-surface-container-highest text-on-surface-variant'
          )
        }));
        // Fallback to mock data if no data
        setAudits(mapped.length > 0 ? mapped : MOCK_AUDITS);
      } else {
        setAudits(MOCK_AUDITS);
      }
    } catch (e) {
      setAudits(MOCK_AUDITS);
    }
  };

  const safeToast = (msg, type = 'info') => {
    if (showToast) showToast(msg, type);
  };

  const handleNewAuditSubmit = async (form) => {
    try {
      // Make API call to create audit
      const res = await fetch(`${API_BASE}/audits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          date: form.dueDate,
          scope: form.scope,
          auditor: form.auditor,
          status: 'In Progress'
        })
      });
      if (res.ok) {
        const createdAudit = await res.json();
        // Add to local state with mock UI fields
        const newAudit = {
          id: createdAudit.id,
          title: createdAudit.title,
          department: form.department,
          auditor: createdAudit.auditor,
          date: createdAudit.date,
          status: 'In Progress',
          statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
        };
        setAudits(prev => [newAudit, ...prev]);
        safeToast(`Audit "${form.title}" scheduled for ${form.department} · ${form.priority} priority`, 'success');
      } else {
        safeToast('Failed to create audit!', 'error');
      }
    } catch (e) {
      safeToast('Network error creating audit!', 'error');
    }
  };

  const handleDownload = (policyTitle) => safeToast(`Downloading latest PDF: ${policyTitle}`, 'info');
  const handleHistory  = (policyTitle) => safeToast(`Loading changelog for: ${policyTitle}`, 'info');
  const handleSendReminders = async () => {
    try {
      const res = await fetch(`${API_BASE}/system/send-reminders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        safeToast('Compliance reminders dispatched successfully!', 'success');
      } else {
        safeToast('Failed to send reminders.', 'error');
      }
    } catch (e) {
      safeToast('Failed to send reminders (network error).', 'error');
    }
  };
  const handlePrepareDocs = (auditTitle) => safeToast(`Preparing compliance dossier for: ${auditTitle}`, 'info');
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      safeToast('Exporting governance data sheets…', 'info');
    }
  };

  return (
    <>
      {/* ── NEW AUDIT MODAL ───────────────────── */}
      <NewAuditModal
        isOpen={newAuditOpen}
        onClose={() => setNewAuditOpen(false)}
        onSubmit={handleNewAuditSubmit}
      />

      <div className="space-y-8">
        {/* ── MODULE HEADER ─────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-on-surface pb-4 mb-6">
          <div>
            <h2 className="font-display-lg text-display-lg uppercase tracking-tighter leading-none mb-2">
              GOVERNANCE MODULE
            </h2>
            <p className="font-body-lg text-outline mt-2 uppercase font-bold tracking-widest">
              Structural Integrity &amp; Compliance Framework
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setNewAuditOpen(true)}
              className="neo-brutalist-btn bg-secondary-fixed-dim text-on-secondary-fixed px-6 py-2 font-headline-md text-sm font-bold uppercase flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              NEW AUDIT
            </button>
            <button
              onClick={handleExport}
              className="neo-brutalist-btn bg-white px-6 py-2 font-headline-md text-sm font-bold uppercase flex items-center gap-2"
            >
              EXPORT <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>

        {/* ── ESG POLICIES + COMPLIANCE LEVELS GRID ─── */}
        <div className="grid grid-cols-12 gap-8">
          {/* ESG Policies */}
          <section className="col-span-12 lg:col-span-8">
            <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-primary inline-block" /> ESG POLICIES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_POLICIES.map((policy) => (
                <div key={policy.id} className="neo-brutalist-card p-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-8xl">{policy.icon}</span>
                  </div>
                  <div>
                    <div className="bg-on-surface text-surface w-fit px-2 py-0.5 text-[10px] font-label-bold mb-4 uppercase">
                      {policy.version}
                    </div>
                    <h4 className="font-headline-md text-xl uppercase mb-2">{policy.title}</h4>
                    <p className="font-body-md text-on-surface-variant mb-6 h-12 overflow-hidden">{policy.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(policy.title)}
                      className="neo-brutalist-btn bg-primary-fixed text-on-primary-fixed text-[10px] px-3 py-2 flex items-center gap-1 font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">download</span> DOWNLOAD
                    </button>
                    <button
                      onClick={() => handleHistory(policy.title)}
                      className="neo-brutalist-btn bg-white text-on-surface text-[10px] px-3 py-2 flex items-center gap-1 font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">history</span> HISTORY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance Levels */}
          <section className="col-span-12 lg:col-span-4">
            <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-secondary inline-block" /> COMPLIANCE LEVELS
            </h3>
            <div className="neo-brutalist-card p-6 bg-white flex flex-col justify-between h-[calc(100%-40px)]">
              <div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-label-bold text-xs uppercase">Policy Adoption Rate</span>
                    <span className="font-label-bold text-xs">94.2%</span>
                  </div>
                  <div className="h-6 border-2 border-on-surface bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-secondary-container border-r-2 border-on-surface transition-all duration-300"
                      style={{ width: '94.2%' }}
                    />
                  </div>
                </div>
                <ul className="space-y-4">
                  {MOCK_DEPT_COMPLIANCE.map((dept, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b-2 border-outline-variant pb-2">
                      <span className="text-xs font-bold uppercase">{dept.name}</span>
                      <span className={`${dept.badgeClass} text-[10px] px-2 font-bold border border-on-surface`}>
                        {dept.percentage}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleSendReminders}
                className="w-full mt-6 neo-brutalist-btn bg-on-surface text-surface py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                SEND REMINDERS
              </button>
            </div>
          </section>
        </div>

        {/* ── GOVERNANCE AUDITS TABLE ─────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-tertiary inline-block" /> GOVERNANCE AUDITS
            </h3>
            <span className="font-label-bold text-[10px] uppercase text-outline">Sorted by: Most Recent</span>
          </div>
          <div className="neo-brutalist-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-on-surface text-surface font-label-bold text-xs uppercase">
                  <th className="p-4 border-r border-surface-variant">Audit Title</th>
                  <th className="p-4 border-r border-surface-variant">Department</th>
                  <th className="p-4 border-r border-surface-variant">Auditor</th>
                  <th className="p-4 border-r border-surface-variant">Date</th>
                  <th className="p-4 border-r border-surface-variant text-center">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {audits.map(audit => (
                  <tr key={audit.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors table-row-brutalist">
                    <td className="p-4 font-headline-md text-lg uppercase">{audit.title}</td>
                    <td className="p-4 font-body-md text-outline uppercase font-bold">{audit.department}</td>
                    <td className="p-4 font-body-md">{audit.auditor}</td>
                    <td className="p-4 font-label-bold font-mono">{audit.date}</td>
                    <td className="p-4 text-center">
                      <span className={`border-2 border-on-surface ${audit.statusClass} text-[10px] px-3 py-1 font-bold uppercase`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handlePrepareDocs(audit.title)}
                        className="neo-brutalist-btn bg-white text-[10px] px-3 py-1 font-bold"
                      >
                        PREPARE DOCS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── COMPLIANCE TRACK TABLE ─────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-error inline-block" /> COMPLIANCE TRACK
            </h3>
            <span className="font-label-bold text-[10px] uppercase text-outline">Severity-tagged, resolution tracked</span>
          </div>
          <div className="neo-brutalist-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-outline text-surface font-label-bold text-xs uppercase">
                  <th className="p-4 border-r border-outline-variant">Issue Description</th>
                  <th className="p-4 border-r border-outline-variant">Severity</th>
                  <th className="p-4 border-r border-outline-variant">Owner</th>
                  <th className="p-4 border-r border-outline-variant">Due Date</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {complianceTrack.map(item => (
                  <tr key={item.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors table-row-brutalist">
                    <td className="p-4 font-body-md font-bold">{item.description}</td>
                    <td className="p-4">
                      <span className={`border-2 border-on-surface ${item.severityClass} text-[10px] px-2 font-black uppercase`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="p-4 font-label-bold text-[11px] uppercase">{item.owner}</td>
                    <td className="p-4 font-label-bold font-mono text-error">{item.date}</td>
                    <td className="p-4 text-center">
                      <span className={`border-2 border-on-surface ${item.statusClass} text-[10px] px-3 py-1 font-bold uppercase`}>
                        {item.status}
                      </span>
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
