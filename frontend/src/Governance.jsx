import React, { useState } from 'react';

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

const MOCK_DEPARTMENTS = [
  { name: "Manufacturing Div.", percentage: "100% COMPLIANT", badgeClass: "bg-secondary-fixed-dim text-on-secondary-fixed" },
  { name: "Logistics & Supply", percentage: "91% COMPLIANT", badgeClass: "bg-secondary-fixed-dim text-on-secondary-fixed" },
  { name: "Admin & Corporate", percentage: "82% COMPLIANT", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant" }
];

export default function Governance({ subPage, setSubPage, onNavigate, showToast }) {
  const [audits, setAudits] = useState(MOCK_AUDITS);
  const [complianceTrack, setComplianceTrack] = useState(MOCK_COMPLIANCE_TRACK);

  const safeToast = (msg, type = 'info') => {
    if (showToast) {
      showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const handleDownload = (policyTitle) => {
    safeToast(`Downloading latest PDF copy of: ${policyTitle}`, 'info');
  };

  const handleHistory = (policyTitle) => {
    safeToast(`Loading historical changelog audit events for: ${policyTitle}`, 'info');
  };

  const handleSendReminders = () => {
    safeToast("Compliance reminders dispatched to Logistics and Admin.", 'success');
  };

  const handlePrepareDocs = (auditTitle) => {
    safeToast(`Preparing compliance dossiers and auto-generating reports for: ${auditTitle}`, 'info');
  };

  const handleNewAudit = () => {
    const title = prompt("Enter New Audit Title:");
    if (!title) return;
    const department = prompt("Enter Target Department:");
    if (!department) return;
    const auditor = prompt("Enter Assigned Auditor:");
    if (!auditor) return;

    const newAudit = {
      id: Date.now(),
      title,
      department,
      auditor,
      date: new Date().toISOString().split('T')[0],
      status: "Upcoming",
      statusClass: "bg-surface-container-highest text-on-surface-variant"
    };

    setAudits(prev => [newAudit, ...prev]);
    safeToast("New compliance audit scheduled successfully.", 'success');
  };

  return (
    <div className="space-y-8">
      {/* Module Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-on-surface pb-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg uppercase tracking-tighter leading-none mb-2">
            {subPage === 'overview' && "GOVERNANCE MODULE"}
            {subPage === 'metrics' && "GOVERNANCE METRICS - GENERAL STATUS"}
            {subPage === 'risk' && "GOVERNANCE MODULE - RISK ASSESSMENT"}
            {subPage === 'audit' && "GOVERNANCE COMPLIANCE AUDITS"}
            {subPage === 'documents' && "GOVERNANCE - COMPLIANCE REGULATED POLICIES"}
          </h1>
          <p className="font-body-lg text-outline mt-2 uppercase font-bold tracking-widest">
            Structural Integrity &amp; Compliance Framework
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleNewAudit}
            className="neo-brutalist-btn bg-secondary-fixed-dim text-on-secondary-fixed px-6 py-3 font-headline-md text-xs font-bold uppercase"
          >
            + NEW AUDIT
          </button>
          <button 
            onClick={() => safeToast('Exporting data sheets...', 'info')}
            className="neo-brutalist-btn bg-white px-6 py-3 font-headline-md text-xs font-bold uppercase flex items-center gap-2"
          >
            EXPORT <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDER ACCORDING TO SUBPAGE */}
      {subPage === 'overview' && (
        <div className="grid grid-cols-12 gap-8">
          {/* ESG Policies Section */}
          <section className="col-span-12 lg:col-span-8">
            <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-primary inline-block"></span> ESG POLICIES
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
                    <p className="font-body-md text-on-surface-variant mb-6 h-12 overflow-hidden">
                      {policy.desc}
                    </p>
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

          {/* Compliance Levels summary card */}
          <section className="col-span-12 lg:col-span-4">
            <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-secondary inline-block"></span> COMPLIANCE LEVELS
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
                      style={{ width: "94.2%" }}
                    ></div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {MOCK_DEPARTMENTS.map((dept, idx) => (
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
      )}

      {subPage === 'metrics' && (
        <section className="max-w-xl mx-auto">
          <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-4 bg-secondary inline-block"></span> COMPLIANCE LEVELS
          </h3>
          <div className="neo-brutalist-card p-6 bg-white">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-label-bold text-xs uppercase">Policy Adoption Rate</span>
                <span className="font-label-bold text-xs">94.2%</span>
              </div>
              <div className="h-6 border-2 border-on-surface bg-surface-container overflow-hidden">
                <div 
                  className="h-full bg-secondary-container border-r-2 border-on-surface"
                  style={{ width: "94.2%" }}
                ></div>
              </div>
            </div>
            <ul className="space-y-4">
              {MOCK_DEPARTMENTS.map((dept, idx) => (
                <li key={idx} className="flex items-center justify-between border-b-2 border-outline-variant pb-2">
                  <span className="text-xs font-bold uppercase">{dept.name}</span>
                  <span className={`${dept.badgeClass} text-[10px] px-2 font-bold border border-on-surface`}>
                    {dept.percentage}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSendReminders}
              className="w-full mt-6 neo-brutalist-btn bg-on-surface text-surface py-3 text-xs font-bold tracking-widest uppercase"
            >
              SEND REMINDERS
            </button>
          </div>
        </section>
      )}

      {subPage === 'risk' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-error inline-block"></span> COMPLIANCE TRACK
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
                  <tr key={item.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors">
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
      )}

      {subPage === 'audit' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-tertiary inline-block"></span> GOVERNANCE AUDITS
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
                  <tr key={audit.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors">
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
      )}

      {subPage === 'documents' && (
        <section className="space-y-4">
          <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-4 bg-primary inline-block"></span> REGULATED POLICIES & CODE DOCUMENTATION
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
                  <p className="font-body-md text-on-surface-variant mb-6 h-12 overflow-hidden">
                    {policy.desc}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(policy.title)}
                    className="neo-brutalist-btn bg-primary-fixed text-on-primary-fixed text-[10px] px-3 py-2 flex items-center gap-1 font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">download</span> DOWNLOAD PDF
                  </button>
                  <button
                    onClick={() => handleHistory(policy.title)}
                    className="neo-brutalist-btn bg-white text-on-surface text-[10px] px-3 py-2 flex items-center gap-1 font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">history</span> ACCESS REVISIONS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
