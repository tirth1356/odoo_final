import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

const MOCK_DEPARTMENTS = [
  { id: 1, name: "Logistics", target: "1,500 t", carbon: "1,245.00", status: "ACTIVE" },
  { id: 2, name: "Manufacturing", target: "5,000 t", carbon: "4,892.50", status: "ON TRACK" },
  { id: 3, name: "Corporate HQ", target: "1,000 t", carbon: "842.15", status: "ACTIVE" },
  { id: 4, name: "Data Center", target: "2,500 t", carbon: "2,105.80", status: "ON TRACK" }
];

const MOCK_FACTORS = [
  { name: "CO2 Grid Electricity", carbon_value: "0.478", unit: "kgCO2e/kWh" },
  { name: "Natural Gas", carbon_value: "2.021", unit: "kgCO2e/m3" },
  { name: "Diesel Fuel", carbon_value: "2.684", unit: "kgCO2e/liter" },
  { name: "Recycled Paper", carbon_value: "0.582", unit: "kgCO2e/kg" }
];

const MOCK_GOALS = [
  { id: 1, name: "Net Zero Ops", target_value: "300.0", current_value: "204.0", percentage: 68, badge: "Q3 TARGET", urgencyClass: "bg-secondary text-white" },
  { id: 2, name: "Water Reuse", target_value: "50.0", current_value: "12.0", percentage: 24, badge: "URGENT", urgencyClass: "bg-tertiary text-white" },
  { id: 3, name: "Renewable Mix", target_value: "4.5", current_value: "4.14", percentage: 92, badge: "ANNUAL", urgencyClass: "bg-primary text-white" }
];

const MOCK_PRODUCTS = [
  { id: 1, name: "Quantum X-1 Laptop", code: "ESG-9920-X", score: "A", scoreClass: "bg-secondary text-white", icon: "laptop_mac" },
  { id: 2, name: "Omni Audio Base", code: "ESG-5580-O", score: "D", scoreClass: "bg-error text-white", icon: "speaker" },
  { id: 3, name: "Nexus Router Pro", code: "ESG-4105-N", score: "C", scoreClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant", icon: "router" },
  { id: 4, name: "E-Slate Core 10", code: "ESG-1122-T", score: "B+", scoreClass: "bg-secondary-fixed text-on-secondary-fixed", icon: "tablet_android" }
];

export default function Environmental({ subPage, setSubPage, onNavigate }) {
  const [departments, setDepartments] = useState([]);
  const [factors, setFactors] = useState([]);
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-07-12", department_name: "Logistics", record_type: "Fleet", item_details: "LOG-001 (Truck) - 1500 km", calculated_emission: "4020.00" },
    { id: 2, date: "2026-07-10", department_name: "Operations", record_type: "Purchase", item_details: "Office Recycled Paper Cartons", calculated_emission: "16.50" },
    { id: 3, date: "2026-07-08", department_name: "R&D", record_type: "Expense", item_details: "Lab Electricity - 1750 kWh", calculated_emission: "1443.75" }
  ]);
  const [goals, setGoals] = useState([]);

  // Form States
  const [logType, setLogType] = useState('purchase');
  const [purchaseForm, setPurchaseForm] = useState({ department: '', item_name: '', amount: '', emission_factor: '', quantity: '', date: '' });
  const [fleetForm, setFleetForm] = useState({ department: '', vehicle_id: '', distance_traveled: '', fuel_type: '', emission_factor: '', date: '' });

  useEffect(() => {
    fetchMetadata();
    fetchTransactionsAndGoals();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [resDepts, resEF] = await Promise.all([
        fetch(`${API_BASE}/departments/`),
        fetch(`${API_BASE}/emission-factors/`)
      ]);
      if (resDepts.ok) setDepartments(await resDepts.json());
      if (resEF.ok) setFactors(await resEF.json());
    } catch (e) {
      console.warn("Using mock metadata.");
    }
  };

  const fetchTransactionsAndGoals = async () => {
    try {
      const [resTx, resGoals] = await Promise.all([
        fetch(`${API_BASE}/carbon-transactions/`),
        fetch(`${API_BASE}/environmental-goals/`)
      ]);
      if (resTx.ok) {
        const txList = await resTx.json();
        const formatted = txList.map(t => ({
          id: t.id,
          date: t.date,
          department_name: t.department_name,
          record_type: t.record_type,
          item_details: `${t.record_type} log (EF: ${t.emission_factor_name || 'N/A'}) - Qty: ${t.quantity}`,
          calculated_emission: t.calculated_emission
        }));
        if (formatted.length) setTransactions(formatted);
      }
      if (resGoals.ok) {
        const goalList = await resGoals.json();
        if (goalList.length) setGoals(goalList);
      }
    } catch (e) {
      console.warn("Using mock transactional values.");
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    const endpoint = logType === 'purchase' ? 'purchases' : 'fleet';
    const body = logType === 'purchase' ? purchaseForm : fleetForm;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert("Operation logged and carbon calculated!");
        fetchTransactionsAndGoals();
        setPurchaseForm({ department: '', item_name: '', amount: '', emission_factor: '', quantity: '', date: '' });
        setFleetForm({ department: '', vehicle_id: '', distance_traveled: '', fuel_type: '', emission_factor: '', date: '' });
      }
    } catch (err) {
      // simulate post local
      const resolvedFactors = factors.length ? factors : MOCK_FACTORS.map((f, i) => ({ id: i + 1, name: f.name, carbon_value: f.carbon_value }));
      const mockEF = resolvedFactors.find(f => f.id === parseInt(body.emission_factor)) || { name: 'Diesel', carbon_value: '2.68' };
      const qty = parseFloat(body.quantity || body.distance_traveled || 10);
      const calcEm = (qty * parseFloat(mockEF.carbon_value)).toFixed(2);
      
      const deptList = departments.length ? departments : [{ id: 1, name: 'Logistics' }, { id: 2, name: 'Manufacturing' }];
      const deptName = deptList.find(d => d.id === parseInt(body.department))?.name || 'Operations';
      
      const newTx = {
        id: Date.now(),
        date: body.date || new Date().toISOString().split('T')[0],
        department_name: deptName,
        record_type: logType === 'purchase' ? 'Purchase' : 'Fleet',
        item_details: logType === 'purchase' ? body.item_name : `Fleet ID: ${body.vehicle_id}`,
        calculated_emission: calcEm
      };

      setTransactions(prev => [newTx, ...prev]);
      alert(`Simulation: Carbon emissions of ${calcEm} kg CO2 calculated & logged!`);
      setPurchaseForm({ department: '', item_name: '', amount: '', emission_factor: '', quantity: '', date: '' });
      setFleetForm({ department: '', vehicle_id: '', distance_traveled: '', fuel_type: '', emission_factor: '', date: '' });
    }
  };

  const getFormDepartments = () => {
    return departments.length ? departments : [{ id: 1, name: 'Operations' }, { id: 2, name: 'Research & Development' }, { id: 3, name: 'Logistics' }];
  };

  const getFormFactors = () => {
    return factors.length ? factors : MOCK_FACTORS.map((f, i) => ({ id: i + 1, name: f.name, carbon_value: f.carbon_value }));
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-on-background pb-8 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg uppercase tracking-tighter leading-none mb-2">
            {subPage === 'overview' && "ENVIRONMENTAL HUB - OVERVIEW"}
            {subPage === 'factors' && "ENVIRONMENTAL PILLAR - EMISSION FACTORS"}
            {subPage === 'tracking' && "ENVIRONMENTAL PILLAR - CARBON TRACKING"}
            {subPage === 'goals' && "ENVIRONMENTAL LOGS - SUBMIT DISCHARGES"}
            {subPage === 'profiles' && "CARBON AUDIT LEDGER"}
          </h1>
          <p className="font-body-lg text-on-surface-variant border-l-4 border-secondary pl-4">Climate Impact and Carbon Footprint Analysis</p>
        </div>
      </div>

      {subPage === 'overview' && (
        <>
          {/* Sustainability Goals Section */}
          <section className="space-y-gutter">
            <div className="flex items-center justify-between border-b-2 border-on-background pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">track_changes</span>
                <h3 className="font-headline-md uppercase tracking-tight">Sustainability Goals</h3>
              </div>
              <button onClick={() => setSubPage('goals')} className="brutalist-button bg-secondary-fixed text-on-secondary-fixed px-4 py-1 text-[10px]">Add Goal</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {MOCK_GOALS.map((goal, idx) => (
                <div key={idx} className="brutalist-card p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-headline-md uppercase text-base leading-tight">{goal.name}</h4>
                    <span className={`${goal.urgencyClass} px-2 py-0.5 text-[9px] font-bold border border-on-background`}>{goal.badge}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-label-bold uppercase">
                      <span>Progress</span>
                      <span>{goal.percentage}%</span>
                    </div>
                    <div className="h-4 border-2 border-on-background bg-background overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${goal.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-label-bold opacity-60 uppercase">
                    <span>Cur: {goal.current_value}</span>
                    <span>Tar: {goal.target_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Product ESG Profiles */}
          <section className="space-y-gutter pt-8">
            <div className="flex items-center gap-2 border-b-2 border-on-background pb-2">
              <span className="material-symbols-outlined">inventory_2</span>
              <h3 className="font-headline-md uppercase tracking-tight">Product ESG Profiles</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {MOCK_PRODUCTS.map((prod, idx) => (
                <div key={idx} className="brutalist-card p-6 flex flex-col items-center text-center gap-4 hover:bg-secondary-fixed/5 transition-colors">
                  <div className="w-20 h-20 border-2 border-on-background flex items-center justify-center bg-surface-container-low shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl">{prod.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-headline-md text-base uppercase">{prod.name}</h5>
                    <p className="text-[10px] font-label-bold opacity-60">{prod.code}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full border-2 border-on-background ${prod.scoreClass} flex items-center justify-center font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    {prod.score}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">ESG SCORE</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {subPage === 'factors' && (
        <div className="grid grid-cols-12 gap-gutter">
          <section className="col-span-12 lg:col-span-8 space-y-gutter">
            <div className="brutalist-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b-2 border-on-background">
                    <th className="p-3 font-label-bold uppercase text-[10px]">Factor Name</th>
                    <th className="p-3 font-label-bold uppercase text-[10px]">Value</th>
                    <th className="p-3 font-label-bold uppercase text-[10px]">Unit</th>
                  </tr>
                </thead>
                <tbody className="font-headline-md text-sm">
                  {MOCK_FACTORS.map((factor, idx) => (
                    <tr key={idx} className="border-b border-on-background/10 hover:bg-secondary-fixed/10 transition-colors">
                      <td className="p-3">{factor.name}</td>
                      <td className="p-3 font-mono font-bold">{factor.carbon_value}</td>
                      <td className="p-3 text-on-surface-variant font-label-bold">{factor.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          <section className="col-span-12 lg:col-span-4">
            <div className="brutalist-card bg-secondary/10 p-6 flex flex-col justify-between border-dashed border-2 h-full">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-3xl">memory</span>
                <div>
                  <p className="font-headline-md uppercase text-sm leading-tight">Auto Emission Calculation</p>
                  <p className="text-[10px] font-label-bold opacity-70 mt-1">REAL-TIME LOGIC SYNC ENABLED</p>
                </div>
              </div>
              <span className="bg-secondary text-white px-3 py-1.5 text-xs font-bold border-2 border-on-background mt-4 inline-block text-center w-28 animate-pulse">ACTIVE</span>
            </div>
          </section>
        </div>
      )}

      {subPage === 'tracking' && (
        <section className="space-y-gutter">
          <div className="brutalist-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b-2 border-on-background">
                  <th className="p-3 font-label-bold uppercase text-[10px]">Department</th>
                  <th className="p-3 font-label-bold uppercase text-[10px]">Target CO2</th>
                  <th className="p-3 font-label-bold uppercase text-[10px]">Carbon (kg)</th>
                  <th className="p-3 font-label-bold uppercase text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="font-headline-md text-sm">
                {MOCK_DEPARTMENTS.map((dept, idx) => (
                  <tr key={idx} className="border-b border-on-background/10">
                    <td className="p-3 font-bold uppercase">{dept.name}</td>
                    <td className="p-3 font-mono">{dept.target}</td>
                    <td className="p-3 font-mono text-error font-bold">{dept.carbon}</td>
                    <td className="p-3">
                      <span className="bg-secondary/20 text-on-secondary-fixed border border-secondary px-2 py-0.5 text-[10px] font-bold">
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-background border-t border-on-background/10 text-[10px] font-label-bold italic opacity-60">
              Carbon Transactions auto-generated from Purchase/Manufacturing/Fleet/Expenses
            </div>
          </div>
        </section>
      )}

      {subPage === 'goals' && (
        <div className="max-w-xl bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-2 flex items-center gap-2 border-b-2 border-on-surface pb-3">
            <span className="material-symbols-outlined text-secondary">add_circle</span>
            LOG OPERATIONS
          </h3>
          <div className="flex gap-4 border-b-2 border-on-surface pb-4 mb-6 mt-4">
            <button onClick={() => setLogType('purchase')} className={`px-3 py-1.5 border border-on-surface font-label-bold text-[10px] uppercase ${logType === 'purchase' ? 'bg-secondary text-white' : 'bg-white'}`}>Purchase Logs</button>
            <button onClick={() => setLogType('fleet')} className={`px-3 py-1.5 border border-on-surface font-label-bold text-[10px] uppercase ${logType === 'fleet' ? 'bg-secondary text-white' : 'bg-white'}`}>Fleet Logs</button>
          </div>

          <form onSubmit={handleLogSubmit} className="space-y-4">
            {logType === 'purchase' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-label-bold text-[10px] uppercase">Department</label>
                  <select value={purchaseForm.department} onChange={e => setPurchaseForm({...purchaseForm, department: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required>
                    <option value="">SELECT</option>
                    {getFormDepartments().map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Date</label>
                    <input type="date" value={purchaseForm.date} onChange={e => setPurchaseForm({...purchaseForm, date: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Cost ($)</label>
                    <input type="number" placeholder="Financial Cost" value={purchaseForm.amount} onChange={e => setPurchaseForm({...purchaseForm, amount: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block font-label-bold text-[10px] uppercase">Item Name</label>
                  <input type="text" placeholder="e.g. Printer Paper Boxes" value={purchaseForm.item_name} onChange={e => setPurchaseForm({...purchaseForm, item_name: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Emission factor</label>
                    <select value={purchaseForm.emission_factor} onChange={e => setPurchaseForm({...purchaseForm, emission_factor: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required>
                      <option value="">SELECT</option>
                      {getFormFactors().map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Quantity</label>
                    <input type="number" placeholder="Units consumed" value={purchaseForm.quantity} onChange={e => setPurchaseForm({...purchaseForm, quantity: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-label-bold text-[10px] uppercase">Department</label>
                  <select value={fleetForm.department} onChange={e => setFleetForm({...fleetForm, department: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required>
                    <option value="">SELECT</option>
                    {getFormDepartments().map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Vehicle ID</label>
                    <input type="text" placeholder="LOG-004 (Van)" value={fleetForm.vehicle_id} onChange={e => setFleetForm({...fleetForm, vehicle_id: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Date</label>
                    <input type="date" value={fleetForm.date} onChange={e => setFleetForm({...fleetForm, date: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Distance (km)</label>
                    <input type="number" placeholder="Total distance" value={fleetForm.distance_traveled} onChange={e => setFleetForm({...fleetForm, distance_traveled: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-bold text-[10px] uppercase">Fuel factor</label>
                    <select value={fleetForm.emission_factor} onChange={e => setFleetForm({...fleetForm, emission_factor: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required>
                      <option value="">SELECT</option>
                      {getFormFactors().map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
            <button type="submit" className="w-full bg-secondary text-on-secondary font-headline-md py-4 border-2 border-on-surface brutalist-shadow brutalist-shadow-hover uppercase text-xs mt-4">
              SUBMIT OPERATIONS LOG
            </button>
          </form>
        </div>
      )}

      {subPage === 'profiles' && (
        <div className="bg-white border-2 border-on-surface p-6 brutalist-shadow">
          <h3 className="font-headline-md text-headline-md uppercase mb-4 flex items-center gap-2 border-b-2 border-on-surface pb-3">
            <span className="material-symbols-outlined text-secondary">assignment</span>
            CARBON TRANSACTIONS LEDGER
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left custom-table border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-on-surface">
                  <th className="p-3 font-label-bold text-xs uppercase">Date</th>
                  <th className="p-3 font-label-bold text-xs uppercase">Dept</th>
                  <th className="p-3 font-label-bold text-xs uppercase">Type</th>
                  <th className="p-3 font-label-bold text-xs uppercase">Details</th>
                  <th className="p-3 font-label-bold text-xs uppercase text-right">Emissions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-on-surface/10 hover:bg-surface-container-low">
                    <td className="p-3 font-label-bold">{t.date}</td>
                    <td className="p-3 font-bold uppercase">{t.department_name}</td>
                    <td className="p-3">
                      <span className="bg-secondary-container text-on-secondary-container border border-on-surface px-1.5 py-0.5 text-[9px] font-bold uppercase">{t.record_type}</span>
                    </td>
                    <td className="p-3 text-on-surface-variant">{t.item_details}</td>
                    <td className="p-3 font-bold text-right text-secondary font-mono">{parseFloat(t.calculated_emission).toFixed(2)} kg CO2</td>
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
