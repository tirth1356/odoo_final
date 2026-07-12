import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

const MOCK_DEPARTMENTS = [
  { id: 1, name: "Manufacturing", code: "MFG", head: "S. Nair", parent: "—", employees: 132, status: "Active" },
  { id: 2, name: "Logistics", code: "LOG", head: "R. Iyer", parent: "Manufacturing", employees: 58, status: "Active" },
  { id: 3, name: "Corporate", code: "COR", head: "A. Mehta", parent: "—", employees: 41, status: "Active" },
  { id: 4, name: "Research & Dev", code: "RND", head: "K. Jasoliya", parent: "Corporate", employees: 24, status: "Inactive" }
];

export default function Settings({
  isOpen,
  onClose,
  autoEmission,
  setAutoEmission,
  evidenceReq,
  setEvidenceReq,
  badgeAuto,
  setBadgeAuto,
  notifSettings,
  setNotifSettings,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('departments'); // departments, categories, esg, notifications
  const [departmentsList, setDepartmentsList] = useState(MOCK_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for toggles to prevent immediate saving without clicking "Save"
  const [localAutoEmission, setLocalAutoEmission] = useState(autoEmission);
  const [localEvidenceReq, setLocalEvidenceReq] = useState(evidenceReq);
  const [localBadgeAuto, setLocalBadgeAuto] = useState(badgeAuto);
  const [localNotifSettings, setLocalNotifSettings] = useState(notifSettings);

  useEffect(() => {
    if (isOpen) {
      setLocalAutoEmission(autoEmission);
      setLocalEvidenceReq(evidenceReq);
      setLocalBadgeAuto(badgeAuto);
      setLocalNotifSettings(notifSettings);
    }
  }, [isOpen, autoEmission, evidenceReq, badgeAuto, notifSettings]);

  if (!isOpen) return null;

  const safeToast = (msg, type = 'info') => {
    if (showToast) {
      showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const handleNewDepartment = () => {
    const name = prompt("Enter Department Name:");
    if (!name) return;
    const code = prompt("Enter Code:");
    if (!code) return;
    const head = prompt("Enter Manager Name:");
    if (!head) return;

    const newDept = {
      id: Date.now(),
      name,
      code,
      head,
      parent: "—",
      employees: 1,
      status: "Active"
    };

    setDepartmentsList(prev => [...prev, newDept]);
    safeToast(`Created Department: ${name}`, 'success');
  };

  const handleSaveSettings = async () => {
    try {
      const payload = {
        auto_emission_calculation: localAutoEmission,
        evidence_requirement: localEvidenceReq,
        badge_auto_award: localBadgeAuto,
        notify_new_compliance: localNotifSettings.compliance,
        notify_csr_approval: localNotifSettings.csr,
        notify_policy_reminders: localNotifSettings.reminders,
        notify_badge_unlocks: localNotifSettings.badges
      };
      
      const res = await axios.patch(`${API_BASE}/system/config/`, payload);
      const cfg = res.data;

      // Update parent states
      setAutoEmission(cfg.auto_emission_calculation);
      setEvidenceReq(cfg.evidence_requirement);
      setBadgeAuto(cfg.badge_auto_award);
      setNotifSettings({
        compliance: cfg.notify_new_compliance,
        csr: cfg.notify_csr_approval,
        reminders: cfg.notify_policy_reminders,
        badges: cfg.notify_badge_unlocks
      });

      safeToast('Configuration Settings Saved!', 'success');
      onClose();
    } catch (e) {
      console.error(e);
      safeToast('Failed to save settings.', 'error');
    }
  };

  const filteredDepts = departmentsList.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-on-background/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
      {/* Settings Modal Panel */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-surface-container-lowest border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <header className="h-20 border-b-2 border-on-surface flex items-center justify-between px-8 bg-surface shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 border-2 border-on-surface flex items-center justify-center bg-surface hover:bg-surface-container-high brutalist-button-active active:shadow-none transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <span className="material-symbols-outlined font-bold">arrow_back</span>
            </button>
            <h1 className="font-headline-lg text-headline-lg uppercase tracking-tighter">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-on-surface bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined">settings</span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex border-b-2 border-on-surface bg-surface-container overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-8 py-4 font-label-bold text-label-bold uppercase border-r-2 border-on-surface transition-colors relative ${
              activeTab === 'departments' 
                ? 'bg-secondary-container text-on-secondary-container after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-on-surface'
                : 'hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => {
              setActiveTab('categories');
              safeToast('Loading ESG Category Mapping...', 'info');
            }}
            className={`px-8 py-4 font-label-bold text-label-bold uppercase border-r-2 border-on-surface transition-colors relative ${
              activeTab === 'categories'
                ? 'bg-secondary-container text-on-secondary-container after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-on-surface'
                : 'hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('esg')}
            className={`px-8 py-4 font-label-bold text-label-bold uppercase border-r-2 border-on-surface transition-colors relative ${
              activeTab === 'esg'
                ? 'bg-secondary-container text-on-secondary-container after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-on-surface'
                : 'hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            ESG Configuration
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-8 py-4 font-label-bold text-label-bold uppercase border-r-2 border-on-surface transition-colors relative ${
              activeTab === 'notifications'
                ? 'bg-secondary-container text-on-secondary-container after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-on-surface'
                : 'hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Notification Settings
          </button>
        </nav>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {activeTab === 'departments' && (
            <div className="space-y-8">
              {/* Action Buttons & Search */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleNewDepartment}
                    className="px-6 py-3 bg-primary text-on-primary border-2 border-on-surface font-label-bold text-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    + New Department
                  </button>
                  <button
                    onClick={() => safeToast('Modify existing department selected', 'info')}
                    className="px-6 py-3 bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface font-label-bold text-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => safeToast('Deletion lock active. Select record first.', 'error')}
                    className="px-6 py-3 bg-error-container text-on-error-container border-2 border-on-surface font-label-bold text-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                  </button>
                </div>
                <div className="relative w-64">
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-on-surface bg-surface font-body-md focus:ring-2 focus:ring-secondary focus:outline-none placeholder:text-on-surface-variant uppercase text-xs"
                    placeholder="Search departments..."
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant">search</span>
                </div>
              </div>

              {/* Departments Table */}
              <div className="border-2 border-on-surface bg-surface overflow-hidden shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b-2 border-on-surface">
                      <th className="p-4 font-label-bold text-label-bold uppercase">Name</th>
                      <th className="p-4 font-label-bold text-label-bold uppercase">Code</th>
                      <th className="p-4 font-label-bold text-label-bold uppercase">Head</th>
                      <th className="p-4 font-label-bold text-label-bold uppercase">Parent Dept</th>
                      <th className="p-4 font-label-bold text-label-bold uppercase">Employees</th>
                      <th className="p-4 font-label-bold text-label-bold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md">
                    {filteredDepts.map(dept => (
                      <tr key={dept.id} className="border-b-2 border-on-surface hover:bg-surface-container-low transition-colors table-row-brutalist">
                        <td className="p-4 font-bold">{dept.name}</td>
                        <td className="p-4 font-label-bold text-on-surface-variant">{dept.code}</td>
                        <td className="p-4">{dept.head}</td>
                        <td className="p-4">{dept.parent}</td>
                        <td className="p-4 font-label-bold">{dept.employees}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 border border-on-surface text-[10px] font-bold uppercase tracking-wider ${
                            dept.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {dept.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-10 border-2 border-dashed border-on-surface text-center">
              <span className="material-symbols-outlined text-4xl block mb-2">inventory_2</span>
              <p className="font-label-bold uppercase text-sm">Category Hierarchy Configuration Coming Soon</p>
            </div>
          )}

          {activeTab === 'esg' && (
            <div className="space-y-10">
              <section className="space-y-6">
                <h2 className="font-headline-md text-headline-md uppercase border-b-2 border-on-surface pb-2 inline-block">
                  ESG Configuration Toggles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Enable auto emission calculation</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localAutoEmission}
                          onChange={e => setLocalAutoEmission(e.target.checked)}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localAutoEmission ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localAutoEmission ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Require evidence for all CSR activities</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localEvidenceReq}
                          onChange={e => setLocalEvidenceReq(e.target.checked)}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localEvidenceReq ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localEvidenceReq ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Auto-award badges on metrics matching</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localBadgeAuto}
                          onChange={e => setLocalBadgeAuto(e.target.checked)}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localBadgeAuto ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localBadgeAuto ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-10">
              <section className="space-y-6">
                <h2 className="font-headline-md text-headline-md uppercase border-b-2 border-on-surface pb-2 inline-block">
                  Notification Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Alerts for new compliance issues</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localNotifSettings.compliance}
                          onChange={e => setLocalNotifSettings(prev => ({ ...prev, compliance: e.target.checked }))}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localNotifSettings.compliance ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localNotifSettings.compliance ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Alerts for CSR / Challenge approval decisions</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localNotifSettings.csr}
                          onChange={e => setLocalNotifSettings(prev => ({ ...prev, csr: e.target.checked }))}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localNotifSettings.csr ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localNotifSettings.csr ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Policy acknowledgement reminders</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localNotifSettings.reminders}
                          onChange={e => setLocalNotifSettings(prev => ({ ...prev, reminders: e.target.checked }))}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localNotifSettings.reminders ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localNotifSettings.reminders ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-on-surface bg-surface-container-lowest brutalist-card transition-all">
                      <span className="font-label-bold text-label-bold uppercase text-xs">Alerts for Badge unlocks</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          checked={localNotifSettings.badges}
                          onChange={e => setLocalNotifSettings(prev => ({ ...prev, badges: e.target.checked }))}
                          className="sr-only neo-toggle"
                          type="checkbox"
                        />
                        <div className={`neo-slider absolute inset-0 cursor-pointer border-2 border-on-surface transition-all ${
                          localNotifSettings.badges ? 'bg-[#38fe13]' : 'bg-surface-container-high'
                        } before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-on-surface before:transition-all ${
                          localNotifSettings.badges ? 'before:translate-x-5' : ''
                        }`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="h-24 border-t-2 border-on-surface bg-surface-container-low flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-on-surface-variant font-label-bold text-label-bold uppercase text-xs">
            <span className="material-symbols-outlined text-sm">info</span>
            Last configuration audit: 2024-05-20 14:30 UTC
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="font-label-bold text-label-bold uppercase hover:underline transition-all text-xs">
              Cancel changes
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-10 py-4 bg-secondary-fixed text-on-secondary-fixed border-2 border-on-surface font-headline-md text-headline-md uppercase shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all"
            >
              Save
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
