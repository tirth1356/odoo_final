import React, { useState, useEffect } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Arjun Mehta", department: "Operations", points: "4,820", bgClass: "bg-primary-fixed" },
  { rank: 2, name: "Sarah Chen", department: "Logistics", points: "4,215", bgClass: "bg-surface" },
  { rank: 3, name: "Elena Rossi", department: "R&D", points: "3,910", bgClass: "bg-surface" },
  { rank: 4, name: "Divy (You)", department: "Engineering", points: "2,450", bgClass: "bg-secondary-container border-secondary ring-2 ring-on-surface" },
  { rank: 5, name: "Marcus Weber", department: "Finance", points: "2,105", bgClass: "bg-surface" }
];

const MOCK_ACTIVE_CHALLENGES = [
  {
    id: 1,
    title: "No Single-Use Plastics Week",
    desc: "Commit to zero-waste lunches for 5 consecutive days. Documentation required via portal.",
    participants: 45,
    participantsAvatars: ["+42"],
    timeLeft: "7 Days Left",
    actionText: "Log Activity",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfz27TeNeXpRZT__7wibFUxnulEqSAJsITnCI653-ir6FOJ5LBd-wf2WNTYvConjurMkSwlacgW_eMwDmfpBV1cAdkUIWJkjlpo7p1qymW0TUM-DRJxi09Lzns-Sg8dVj1btvhnY2WwIvq1EL7B1Wj6ouozljLnFEG2HjBZCfQfjWDBJAmukoeZT5dBJeLyUhX1oCjKpyzU7zGiBQ3lIOdxo4SSz9BLknC7-ZUzGJ9BUCbQBNNJZkh6EBA"
  },
  {
    id: 2,
    title: "Bike to Work Day",
    desc: "Track your commute with the corporate app. Reduce carbon footprint per kilometer.",
    participants: 131,
    participantsAvatars: ["+128"],
    timeLeft: "Ends Tomorrow",
    actionText: "JOIN NOW",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGbwrWFIrOl-RZU6UdcJNsu0p7C39pXNb8tRjMDODVAiBRtnWyoCyQLycnorAUTK2ILlzlNEVPlxncK7Z1ZHoGvBZJPboz-Sibzk97FvDZTDOftkmEoDVVnsZQWdNLEMRMg0kJhaXAaJkJTsbzDzCiq0pFaoZ6qLviG-hNRktMoAw5zwlq3MEzkIq1h_3g2DYhQ3cj3KZNg24Oi75288zJjLneLxlxx8wbEepHQsiyaYdAc-IRA"
  }
];

const MOCK_BADGES = [
  { title: "Green Beginner", desc: "UNLOCKED", icon: "park", colorClass: "bg-primary text-on-primary", locked: false },
  { title: "Carbon Saver", desc: "UNLOCKED", icon: "bolt", colorClass: "bg-secondary text-on-secondary", locked: false },
  { title: "ESG Champion", desc: "Reach 5,000 XP (Demo: 2,600 XP)", icon: "emoji_events", colorClass: "bg-tertiary text-on-tertiary", locked: true },
  { title: "Water Guard", desc: "Complete 3 Challenges (Demo: 1 Challenge)", icon: "water_drop", colorClass: "bg-blue-500 text-white", locked: true }
];

const MOCK_DIRECTORY = [
  { title: "Sustainability Sprint", type: "Global", icon: "public", difficulty: "HARD", diffClass: "bg-tertiary text-on-tertiary", reward: "200 XP + TOKEN", deadline: "07/20" },
  { title: "Recycle Challenge", type: "Dept", icon: "recycling", difficulty: "EASY", diffClass: "bg-secondary text-on-secondary", reward: "80 XP", deadline: "07/15" },
  { title: "Solar Installation Review", type: "Special", icon: "solar_power", difficulty: "MEDIUM", diffClass: "bg-primary text-on-primary", reward: "120 XP", deadline: "07/25" }
];

const MOCK_REWARDS = [
  { id: 1, name: "Eco Thermos Flask", points_required: 60, stock: 8 },
  { id: 2, name: "Carbon Offset Certificate", points_required: 100, stock: 99 },
  { id: 3, name: "Organic Tote Bag", points_required: 30, stock: 25 }
];

function NewChallengeModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', reward: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({ title: '', description: '', reward: '' });
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
    if (!form.title.trim()) e.title = 'Challenge title is required';
    if (!form.description.trim()) e.description = 'Challenge description is required';
    if (!form.reward.trim()) e.reward = 'Reward is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  const Field = ({ name, label, children }) => (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {label}
        {errors[name] && (
          <span className="ml-2 text-error normal-case tracking-normal">— {errors[name]}</span>
        )}
      </label>
      {children}
    </div>
  );

  const inputClass = (name) =>
    `w-full h-11 px-4 border-2 ${errors[name] ? 'border-error' : 'border-on-surface'} bg-white text-sm text-black focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 placeholder:text-[11px] placeholder:uppercase`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(28,27,27,0.80)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-challenge-title"
    >
      <div
        className="relative w-full max-w-xl bg-white border-4 border-on-surface flex flex-col"
        style={{ boxShadow: '12px 12px 0px 0px rgba(28,27,27,1)', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b-2 border-on-surface bg-on-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-surface flex items-center justify-center bg-secondary-container">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                add_circle
              </span>
            </div>
            <div>
              <h3
                id="new-challenge-title"
                className="uppercase text-surface tracking-tighter leading-none"
                style={{ fontFamily: 'Archivo Narrow, sans-serif', fontSize: '20px', fontWeight: 700 }}
              >
                Create New Challenge
              </h3>
              <p className="text-surface-variant text-[10px] uppercase tracking-widest mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Gamification Module
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7">
          <div className="space-y-5">
            <Field name="title" label="Challenge Title *">
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Zero Waste Week"
                className={inputClass('title')}
              />
            </Field>

            <Field name="description" label="Description *">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe the challenge and requirements..."
                className={`${inputClass('description')} h-auto py-2`}
              />
            </Field>

            <Field name="reward" label="Reward *">
              <input
                type="text"
                value={form.reward}
                onChange={(e) => update('reward', e.target.value)}
                placeholder="e.g. 100 XP + 50 Points"
                className={inputClass('reward')}
              />
            </Field>
          </div>

          {/* Footer */}
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
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                add_task
              </span>
              Create Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Gamification({ 
  subPage, 
  setSubPage, 
  onNavigate, 
  showToast,
  badgeAuto,
  notifSettings,
  userProfile = { username: "johngreen", points: 120, xp: 2450 },
  setUserProfile,
  notifications,
  setNotifications,
  rewards: globalRewards,
  setRewards: setGlobalRewards
}) {
  const [challenges, setChallenges] = useState(MOCK_ACTIVE_CHALLENGES);
  const [directory, setDirectory] = useState(MOCK_DIRECTORY);
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  const [completedCount, setCompletedCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(["Green Beginner", "Carbon Saver"]);
  const [newChallengeOpen, setNewChallengeOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);

  const points = userProfile.points;
  const xp = userProfile.xp;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/leaderboard/`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length) {
          setLeaderboard(data.map((user, idx) => ({
            rank: idx + 1,
            name: user.name || user.username,
            department: user.department || "Unknown",
            points: user.points?.toLocaleString() || "0",
            bgClass: idx === 0 ? "bg-primary-fixed" : (idx === 3 ? "bg-secondary-container border-secondary ring-2 ring-on-surface" : "bg-surface")
          })));
        }
      }
    } catch (e) {
      console.warn("Failed to fetch leaderboard, using mock data");
    }
  };

  const safeToast = (msg, type = 'info') => {
    if (showToast) {
      showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const checkBadgeUnlocks = (currentXP, currentCompleted) => {
    const badgesToUnlock = [];
    if (currentXP >= 2600 && !unlockedBadges.includes("ESG Champion")) {
      badgesToUnlock.push("ESG Champion");
    }
    if (currentCompleted >= 1 && !unlockedBadges.includes("Water Guard")) {
      badgesToUnlock.push("Water Guard");
    }

    if (badgesToUnlock.length > 0) {
      setUnlockedBadges(prev => [...prev, ...badgesToUnlock]);
      badgesToUnlock.forEach(badgeTitle => {
        safeToast(`🏆 BADGE UNLOCKED: ${badgeTitle}`, 'success');
        if (notifSettings && notifSettings.badges && setNotifications) {
          const newNotif = {
            id: Date.now() + Math.random(),
            message: `🏆 Badge Auto-Awarded: You met the criteria for the '${badgeTitle}' Badge!`,
            created_at: new Date().toISOString()
          };
          setNotifications(prev => [newNotif, ...prev]);
        }
      });
    }
  };

  const handleNewChallengeSubmit = (form) => {
    const newDirItem = {
      title: form.title,
      type: "Dept",
      icon: "task_alt",
      difficulty: "MEDIUM",
      diffClass: "bg-primary text-on-primary",
      reward: form.reward,
      deadline: "07/31"
    };

    setDirectory(prev => [newDirItem, ...prev]);
    safeToast("New corporate challenge created draft successfully.", 'success');
  };

  const handleAction = (challengeTitle, actionText) => {
    if (actionText === 'JOIN NOW') {
      safeToast(`Successfully registered for challenge: ${challengeTitle}`, 'success');
      if (notifSettings && notifSettings.csr && setNotifications) {
        const newNotif = {
          id: Date.now(),
          message: `Registered for challenge: '${challengeTitle}'. Ready for verification.`,
          created_at: new Date().toISOString()
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } else {
      const gainedXP = 150;
      const gainedPoints = 50;
      const newXP = xp + gainedXP;
      const newPoints = points + gainedPoints;

      if (setUserProfile) {
        setUserProfile(prev => ({
          ...prev,
          xp: newXP,
          points: newPoints
        }));
      }

      const newCompletedCount = completedCount + 1;
      setCompletedCount(newCompletedCount);
      safeToast(`Challenge completed! Gained +${gainedXP} XP and +${gainedPoints} PTS.`, 'success');

      if (notifSettings && notifSettings.csr && setNotifications) {
        const newNotif = {
          id: Date.now() + 1,
          message: `Challenge Completed: Activity for '${challengeTitle}' verified. Gained ${gainedXP} XP.`,
          created_at: new Date().toISOString()
        };
        setNotifications(prev => [newNotif, ...prev]);
      }

      if (badgeAuto) {
        checkBadgeUnlocks(newXP, newCompletedCount);
      }
    }
  };

  const handleRedeemReward = (reward) => {
    if (points < reward.points_required) {
      safeToast("Insufficient points balance for this redemption!", 'error');
      return;
    }
    if (reward.stock <= 0) {
      safeToast("Item currently out of stock!", 'error');
      return;
    }

    if (setUserProfile) {
      setUserProfile(prev => ({
        ...prev,
        points: prev.points - reward.points_required
      }));
    }

    if (setGlobalRewards) {
      setGlobalRewards(prev => prev.map(r => r.id === reward.id ? { ...r, stock: r.stock - 1 } : r));
    } else {
      setRewards(prev => prev.map(r => r.id === reward.id ? { ...r, stock: r.stock - 1 } : r));
    }

    safeToast(`Voucher redeemed: ${reward.name} unlocked!`, 'success');
  };

  const activeRewards = globalRewards || rewards;

  const displayBadges = [
    { title: "Green Beginner", desc: unlockedBadges.includes("Green Beginner") ? "UNLOCKED" : "LOCKED", icon: "park", colorClass: unlockedBadges.includes("Green Beginner") ? "bg-primary text-on-primary" : "bg-surface border-dashed", locked: !unlockedBadges.includes("Green Beginner") },
    { title: "Carbon Saver", desc: unlockedBadges.includes("Carbon Saver") ? "UNLOCKED" : "LOCKED", icon: "bolt", colorClass: unlockedBadges.includes("Carbon Saver") ? "bg-secondary text-on-secondary" : "bg-surface border-dashed", locked: !unlockedBadges.includes("Carbon Saver") },
    { title: "ESG Champion", desc: unlockedBadges.includes("ESG Champion") ? "UNLOCKED" : "Reach 5,000 XP (Demo: 2,600 XP)", icon: unlockedBadges.includes("ESG Champion") ? "emoji_events" : "lock", colorClass: unlockedBadges.includes("ESG Champion") ? "bg-tertiary text-on-tertiary" : "bg-surface border-dashed", locked: !unlockedBadges.includes("ESG Champion") },
    { title: "Water Guard", desc: unlockedBadges.includes("Water Guard") ? "UNLOCKED" : "Complete 3 Challenges (Demo: 1 Challenge)", icon: unlockedBadges.includes("Water Guard") ? "water_drop" : "lock", colorClass: unlockedBadges.includes("Water Guard") ? "bg-blue-500 text-white" : "bg-surface border-dashed", locked: !unlockedBadges.includes("Water Guard") }
  ];

  return (
    <>
      <NewChallengeModal
        isOpen={newChallengeOpen}
        onClose={() => setNewChallengeOpen(false)}
        onSubmit={handleNewChallengeSubmit}
      />
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b-4 border-on-surface pb-6">
          <div>
            <h2 className="font-display-lg text-display-lg uppercase leading-none mb-2">
              {subPage === 'overview' && "CHALLENGES & REWARDS"}
              {subPage === 'metrics' && "CONTRIBUTOR RANKINGS & LEADERBOARD"}
              {subPage === 'risk' && "COLLECTIBLE BADGE GALLERY"}
              {subPage === 'audit' && "CHALLENGE DIRECTORY ARCHIVE"}
              {subPage === 'documents' && "REDEMPTION SHOP - SPEND ESG TOKENS"}
            </h2>
            <p className="text-on-surface-variant font-body-lg max-w-2xl italic border-l-4 border-primary pl-4">
              Gamified environmental accountability. Participate in corporate-wide initiatives to earn verified ESG tokens.
            </p>
          </div>
          <button
            onClick={() => setNewChallengeOpen(true)}
            className="brutalist-btn bg-secondary-container text-on-secondary-fixed p-4 font-headline-md uppercase flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span> NEW CHALLENGE
          </button>
        </div>

        {/* CONDITIONAL RENDERING BASED ON SUBPAGE */}
        {subPage === 'overview' && (
          <>
            {/* Top Stats Row */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
              <div className="brutalist-card bg-surface p-6 flex flex-col justify-between">
                <div>
                  <span className="font-label-bold uppercase text-on-surface-variant block mb-1">Current XP</span>
                  <div className="font-display-lg text-display-lg leading-none">{xp.toLocaleString()} <span className="text-headline-md font-headline-md">XP</span></div>
                </div>
                <div className="mt-4">
                  <div className="h-4 border-2 border-on-surface bg-surface-container-low overflow-hidden">
                    <div className="h-full bg-secondary w-3/4"></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] font-label-bold">LVL 12</span>
                    <span className="text-[10px] font-label-bold">550 XP TO NEXT</span>
                  </div>
                </div>
              </div>
              <div className="brutalist-card bg-surface p-6">
                <span className="font-label-bold uppercase text-on-surface-variant block mb-1">Current Badge</span>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-16 h-16 bg-primary-fixed border-2 border-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md leading-tight">Sustainability Hero</div>
                    <div className="text-[10px] font-label-bold uppercase text-secondary">Verified Oct 2023</div>
                  </div>
                </div>
              </div>
              <div className="brutalist-card bg-surface p-6">
                <span className="font-label-bold uppercase text-on-surface-variant block mb-1">Your Rank</span>
                <div className="font-display-lg text-display-lg leading-none">#4</div>
                <div className="font-label-bold uppercase mt-2 text-on-surface-variant">Engineering Dept</div>
                <div className="mt-2 py-1 px-2 bg-secondary-fixed text-on-secondary-fixed inline-block font-label-bold text-[10px] border border-on-surface">
                  TOP 5% THIS MONTH
                </div>
              </div>
              <div className="brutalist-card bg-surface p-6 flex flex-col justify-between" onClick={() => setSubPage('documents')}>
                <div>
                  <span className="font-label-bold uppercase text-on-surface-variant block mb-1">Points Balance</span>
                  <div className="font-display-lg text-display-lg leading-none">{points} <span className="text-headline-md font-headline-md">PTS</span></div>
                </div>
                <button className="mt-4 flex items-center gap-2 font-label-bold uppercase text-secondary hover:underline text-left">
                  VIEW REDEMPTION SHOP <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </section>

            {/* Main area grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
              {/* Left: Active Challenges */}
              <div className="xl:col-span-2 space-y-12">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-lg text-headline-lg uppercase border-b-4 border-on-surface inline-block">Active Challenges</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {challenges.map((item) => (
                      <div key={item.id} className="brutalist-card bg-surface overflow-hidden flex flex-col justify-between min-h-[380px]">
                        <div className="h-40 bg-surface-container-high relative">
                          <img className="w-full h-full object-cover grayscale brightness-75" src={item.image} alt={item.title} />
                          <div className="absolute top-4 left-4 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 font-label-bold border-2 border-on-surface uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            ONGOING
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-headline-md text-headline-md uppercase mb-2">{item.title}</h4>
                            <p className="text-on-surface-variant font-body-md mb-6">{item.desc}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="flex -space-x-3">
                                <div className="w-8 h-8 border-2 border-on-surface bg-primary-fixed-dim rounded-full"></div>
                                <div className="w-8 h-8 border-2 border-on-surface bg-secondary-fixed-dim rounded-full"></div>
                                <div className="w-8 h-8 border-2 border-on-surface bg-tertiary-fixed-dim rounded-full"></div>
                                <div className="w-8 h-8 border-2 border-on-surface bg-surface flex items-center justify-center text-[10px] font-label-bold rounded-full">
                                  {item.participantsAvatars[0]}
                                </div>
                              </div>
                              <span className="text-[10px] font-label-bold uppercase text-on-surface-variant">{item.participants} Participants</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-label-bold uppercase text-on-tertiary-fixed-variant">{item.timeLeft}</span>
                              <button
                                onClick={() => handleAction(item.title, item.actionText)}
                                className="brutalist-btn bg-secondary text-surface px-4 py-2 font-label-bold uppercase text-xs"
                              >
                                {item.actionText}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge Gallery Section */}
                <div>
                  <h3 className="font-headline-lg text-headline-lg uppercase mb-6 border-b-4 border-on-surface inline-block">Badge Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {displayBadges.map((badge, idx) => (
                      <div key={idx} className={`brutalist-card bg-surface p-4 flex flex-col items-center text-center ${badge.locked ? 'opacity-60 bg-surface-container' : ''}`}>
                        <div className={`w-12 h-12 flex items-center justify-center mb-2 border-2 border-on-surface ${badge.colorClass}`}>
                          <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                        </div>
                        <div className="font-label-bold uppercase leading-tight text-[10px]">{badge.title}</div>
                        <div className={`text-[8px] font-label-bold mt-1 uppercase ${badge.locked ? 'text-on-surface-variant italic' : 'text-secondary'}`}>
                          {badge.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Leaderboard */}
              <aside>
                <div className="brutalist-card bg-surface p-0 flex flex-col h-fit">
                  <div className="bg-on-surface text-surface p-4 border-b-2 border-on-surface">
                    <h3 className="font-headline-md text-headline-md uppercase">Top Contributors</h3>
                    <p className="text-[10px] font-label-bold uppercase opacity-80">This Quarter</p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {leaderboard.map((user, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-3 border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${user.bgClass}`}>
                          <div className="font-display-lg text-[24px] w-8">#{user.rank}</div>
                          <div className="flex-grow">
                            <div className="font-label-bold uppercase leading-none">{user.name}</div>
                            <div className="text-[10px] font-label-bold uppercase opacity-60">{user.department}</div>
                          </div>
                          <div className="font-headline-md text-headline-md">{user.points}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSubPage('metrics')} className="w-full brutalist-btn mt-6 py-2 bg-surface-container font-label-bold uppercase text-[10px]">
                      View Full Leaderboard
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        {subPage === 'metrics' && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="brutalist-card bg-surface p-0 flex flex-col">
              <div className="bg-on-surface text-surface p-4 border-b-2 border-on-surface">
                <h3 className="font-headline-md text-headline-md uppercase">Top Contributors</h3>
                <p className="text-[10px] font-label-bold uppercase opacity-80">This Quarter</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {leaderboard.map((user, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${user.bgClass}`}>
                      <div className="font-display-lg text-[24px] w-8">#{user.rank}</div>
                      <div className="flex-grow">
                        <div className="font-label-bold uppercase leading-none">{user.name}</div>
                        <div className="text-[10px] font-label-bold uppercase opacity-60">{user.department}</div>
                      </div>
                      <div className="font-headline-md text-headline-md">{user.points}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {subPage === 'risk' && (
          <section className="space-y-6">
            <h3 className="font-headline-lg text-headline-lg uppercase mb-6 border-b-4 border-on-surface inline-block">Badge Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {displayBadges.map((badge, idx) => (
                <div key={idx} className={`brutalist-card bg-surface p-6 flex flex-col items-center text-center ${badge.locked ? 'opacity-60 bg-surface-container' : ''}`}>
                  <div className={`w-16 h-16 flex items-center justify-center mb-4 border-2 border-on-surface ${badge.colorClass}`}>
                    <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
                  </div>
                  <div className="font-headline-md text-sm uppercase leading-tight">{badge.title}</div>
                  <div className={`text-[10px] font-label-bold mt-2 uppercase ${badge.locked ? 'text-on-surface-variant italic' : 'text-secondary'}`}>
                    {badge.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {subPage === 'audit' && (
          <section className="space-y-6">
            <h3 className="font-headline-lg text-headline-lg uppercase mb-6 border-b-4 border-on-surface inline-block">Challenge Directory</h3>
            <div className="brutalist-card bg-surface overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b-2 border-on-surface bg-surface-container">
                  <tr>
                    <th className="p-4 font-label-bold uppercase text-[12px]">Title</th>
                    <th className="p-4 font-label-bold uppercase text-[12px]">Type</th>
                    <th className="p-4 font-label-bold uppercase text-[12px]">Difficulty</th>
                    <th className="p-4 font-label-bold uppercase text-[12px]">Reward</th>
                    <th className="p-4 font-label-bold uppercase text-[12px]">Deadline</th>
                    <th className="p-4 font-label-bold uppercase text-[12px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/10 font-label-bold uppercase text-[12px]">
                  {directory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-primary-fixed-dim transition-all">
                      <td className="p-4 font-bold">{item.title}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 border border-on-surface ${item.diffClass}`}>{item.difficulty}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-secondary">{item.reward}</td>
                      <td className="p-4 font-mono">{item.deadline}</td>
                      <td className="p-4 text-right">
                        <span onClick={() => safeToast(`Opening challenge details: ${item.title}`)} className="material-symbols-outlined cursor-pointer hover:text-secondary">open_in_new</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {subPage === 'documents' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-3 mb-6">
              <h3 className="font-headline-lg text-headline-lg uppercase inline-block">REDEEM VOUCHERS SHOP</h3>
              <div className="font-headline-md text-headline-md text-secondary">
                Balance: <span className="font-bold">{points} Pts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeRewards.map(r => (
                <div key={r.id} className="bg-white border-2 border-on-surface p-6 brutalist-card flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 border border-on-surface font-label-bold text-xs uppercase inline-block mb-3">
                      {r.points_required} Points
                    </div>
                    <h4 className="font-headline-md text-headline-md uppercase">{r.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-2 uppercase">Stock left: {r.stock} units</p>
                  </div>
                  <button 
                    className="w-full mt-6 bg-secondary text-on-secondary font-label-bold text-xs py-3 border-2 border-on-surface brutalist-btn uppercase"
                    onClick={() => handleRedeemReward(r)}
                    disabled={r.stock === 0}
                  >
                    REDEEM VOUCHER
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
