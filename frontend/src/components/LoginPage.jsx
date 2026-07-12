import React, { useState } from 'react';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberTerminal, setRememberTerminal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both Email and Access Key.");
      return;
    }
    // Simulate authentication
    console.log("Authenticated terminal:", { email, rememberTerminal });
    onNavigate('dashboard');
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* TopAppBar */}
      <header className="w-full top-0 border-b-2 border-on-surface bg-background flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 z-50">
        <div
          onClick={() => onNavigate('landing')}
          className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tighter text-on-surface cursor-pointer"
        >
          ESG CORE
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="font-label-bold text-label-bold uppercase px-4 py-2 bg-on-surface text-background hover:bg-secondary transition-colors brutalist-shadow-active"
        >
          HOME
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className=" flex-grow flex flex-col md:flex-row relative overflow-hidden">
        {/* Left Side: Atmospheric/Institutional Panel */}
        <section className="hidden md:flex md:w-1/2 bg-primary-container relative flex-col justify-center items-center p-20 overflow-hidden border-r-2 border-on-surface">
          <div className="absolute inset-0 noise-texture pointer-events-none"></div>
          {/* Abstract Grid & Brand Mark */}
          <div className="relative z-10 w-full max-w-md">
            <div className="border-4 border-on-surface p-12 bg-surface-bright brutalist-shadow">
              <h1 className="font-display-lg text-display-lg uppercase leading-none mb-4">ESG<br />RESOLVE</h1>
              <div className="h-1 w-24 bg-on-surface mb-8"></div>
              <p className="font-body-lg text-body-lg text-on-surface mb-8">
                The definitive operating system for environmental, social, and governance intelligence.
              </p>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-secondary">verified_user</span>
                <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Military-Grade Encryption Standard</span>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-on-surface/20 flex items-center justify-center -rotate-12">
              <span className="font-headline-lg text-headline-lg-mobile text-on-surface/10 uppercase">AUTHENTICATED</span>
            </div>
          </div>
          {/* Background Image Integration */}
          <div
            className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 filter grayscale contrast-150 mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDjhtzwtHhPLaJRfKuMvRIlaAxdtn33uEoW43fCXFDDPRwHH8cZ4QwahG3pcE9teJdo7vgp28kVkfJGhhC3TwhOtAb69yXNtDCEpTFTqMIFhzmXqMBM3vvx5R_o36XefHCSl-Nl8hExgTYKebUNNxpr5WsjxPnde1NYP2ffkSIYXzfFqJNwpHc8zPnr7XIpkeEhWQVG_fWD9Y9TBzgwSHW08GF-Zo_worqclkcaN7Zj_pPyr-WGVFwRg')"
            }}
          />
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop bg-surface-container">
          {/* Mobile Branding Only */}
          <div className="md:hidden mb-12 text-center">
            <h1 className="font-headline-lg text-headline-lg-mobile uppercase mb-2">ESG RESOLVE</h1>
            <p className="font-label-bold text-label-bold uppercase text-primary">Secure Institutional Access</p>
          </div>
          <div className="w-full max-w-md bg-background border-[3px] border-on-surface p-8 brutalist-shadow transition-all duration-300">
            <header className="mb-8 border-b-2 border-on-surface pb-6">
              <h2 className="font-headline-md text-headline-md uppercase mb-1">SIGN IN</h2>
              <p className="font-label-bold text-label-bold text-on-surface-variant">AUTHORIZED PERSONNEL ONLY</p>
            </header>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Institutional Email/ID */}
              <div className="space-y-2">
                <label
                  className={`block font-label-bold text-label-bold uppercase transition-colors ${isEmailFocused ? 'text-secondary' : 'text-on-surface'
                    }`}
                  htmlFor="email"
                >
                  INSTITUTIONAL EMAIL/ID
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">alternate_email</span>
                  <input
                    className="w-full bg-surface-container-low border-2 border-on-surface px-12 py-4 font-body-md focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                    id="email"
                    name="email"
                    placeholder="ID_REF_XXXXXX"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Access Key/Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label
                    className={`block font-label-bold text-label-bold uppercase transition-colors ${isPasswordFocused ? 'text-secondary' : 'text-on-surface'
                      }`}
                    htmlFor="password"
                  >
                    ACCESS KEY/PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">lock</span>
                  <input
                    className="w-full bg-surface-container-low border-2 border-on-surface px-12 py-4 font-body-md focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-on-surface focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col gap-4">
                <button
                  className="w-full bg-secondary text-on-secondary font-headline-md text-headline-md uppercase py-4 border-2 border-on-surface brutalist-shadow brutalist-shadow-active brutalist-shadow-hover transition-all focus:outline-none"
                  type="submit"
                >
                  SIGN IN
                </button>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
                  <a
                    className="font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-tertiary transition-colors border-b-2 border-transparent hover:border-tertiary"
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert("Contact institutional IT or system administrator to reset credentials."); }}
                  >
                    FORGOT ACCESS KEY
                  </a>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      className="w-5 h-5 border-2 border-on-surface bg-surface-container-low checked:bg-secondary checked:border-on-surface appearance-none rounded-none transition-colors"
                      type="checkbox"
                      checked={rememberTerminal}
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                    />
                    <span className="font-label-bold text-label-bold uppercase text-on-surface-variant group-hover:text-on-surface">REMEMBER TERMINAL</span>
                  </label>
                </div>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-12 p-4 bg-surface-container-highest border border-on-surface-variant/20 flex gap-4 items-start">
              <span className="material-symbols-outlined text-error mt-1">gpp_maybe</span>
              <p className="font-label-bold text-[10px] leading-tight text-on-surface-variant opacity-80">
                BY PROCEEDING, YOU ACKNOWLEDGE THAT SYSTEM ACCESS IS LOGGED AND MONITORED. UNAUTHORIZED ATTEMPTS ARE SUBJECT TO INSTITUTIONAL REVIEW UNDER THE SECURITY PROTOCOL CORE-8.
              </p>
            </div>
          </div>

          {/* Footer for Mobile */}
          <div className="md:hidden mt-8 text-center px-4 opacity-50">
            <p className="font-label-bold text-[10px] uppercase">© 2024 ESG CORE SYSTEMS. ALL RIGHTS RESERVED.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-highest border-t-2 border-on-surface px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row justify-between gap-gutter z-10">
        <div className="flex flex-col gap-2">
          <span className="font-headline-md text-headline-md text-on-surface">ESG CORE SYSTEMS</span>
          <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">© 2024 ESG CORE SYSTEMS. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex flex-wrap gap-x-gutter gap-y-4 items-center">
          <a className="font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-tertiary transition-colors" href="#privacy">PRIVACY POLICY</a>
          <a className="font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-tertiary transition-colors" href="#terms">TERMS OF SERVICE</a>
          <a className="font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-tertiary transition-colors" href="#security">INSTITUTIONAL SECURITY</a>
        </div>
      </footer>
    </div>
  );
}
