import React from 'react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary-container text-on-primary-container border-b-2 border-on-background h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
          <span className="material-symbols-outlined text-headline-md">grid_view</span>
          <h1 className="text-headline-md font-headline-md font-bold tracking-tighter uppercase">ESG RESOLVE</h1>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="font-label-bold text-label-bold uppercase text-on-primary-container/80 hover:text-white transition-colors" href="#features">Features</a>
          <a className="font-label-bold text-label-bold uppercase text-on-primary-container/80 hover:text-white transition-colors" href="#solutions">Solutions</a>
          <a className="font-label-bold text-label-bold uppercase text-on-primary-container/80 hover:text-white transition-colors" href="#about">About</a>
          <button
            onClick={() => onNavigate('login')}
            className="bg-on-background text-background font-label-bold text-label-bold px-6 py-2 border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all uppercase"
          >
            LOGIN
          </button>
        </nav>
        <button className="md:hidden material-symbols-outlined" onClick={() => onNavigate('login')}>menu</button>
      </header>

      <main className="pt-16 pb-24">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop py-20 bg-surface">
          <div className="inline-block bg-primary-container text-on-primary-container font-label-bold text-label-bold px-3 py-1 mb-8 border-2 border-on-background uppercase">
            SYSTEM UPDATE: AI ROADMAP 2.0
          </div>
          <h2 className="text-display-lg font-display-lg text-on-surface max-w-4xl uppercase leading-tight mb-6">
            INSTITUTIONAL-GRADE <span className="text-secondary">ESG INTELLIGENCE</span>. ACTIONABLE ANALYTICS. <span class="text-primary">ZERO FLUFF</span>.
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mb-12">
            Reject the greenwashing. Harness brutal precision in environmental, social, and governance reporting through our high-fidelity analytics engine.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => onNavigate('login')}
              className="bg-secondary text-on-secondary font-label-bold text-[16px] px-10 py-4 border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
            >
              START ASSESSMENT
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="bg-white text-on-background font-label-bold text-[16px] px-10 py-4 border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
            >
              VIEW DEMO
            </button>
          </div>
        </section>

        {/* Service Highlights (Bento Grid Style) */}
        <section id="features" className="px-margin-mobile md:px-margin-desktop py-24 bg-surface-container-low border-y-2 border-on-background">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Precision Analytics */}
            <div className="bg-white p-8 border-2 border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-primary-fixed border-2 border-on-background flex items-center justify-center">
                <span className="material-symbols-outlined text-headline-md text-on-primary-fixed">monitoring</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md uppercase mb-3">PRECISION ANALYTICS</h3>
                <p className="text-on-surface-variant">Scoring across Environment, Social, and Governance pillars with calculated confidence vectors. Hard data, no compromises.</p>
              </div>
              <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center cursor-pointer" onClick={() => onNavigate('login')}>
                <span className="text-label-bold font-label-bold uppercase">View Metrics</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>

            {/* Strategic Intelligence */}
            <div className="bg-white p-8 border-2 border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-secondary-container border-2 border-on-background flex items-center justify-center">
                <span className="material-symbols-outlined text-headline-md text-on-secondary-container">lightbulb</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md uppercase mb-3">STRATEGIC INTELLIGENCE</h3>
                <p className="text-on-surface-variant">Prioritized recommendations tailored specifically to your operational footprint and industry sector. Move from theory to execution.</p>
              </div>
              <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center cursor-pointer" onClick={() => onNavigate('login')}>
                <span className="text-label-bold font-label-bold uppercase">Analyze Strategy</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>

            {/* AI Orchestration */}
            <div className="bg-white p-8 border-2 border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-tertiary-fixed border-2 border-on-background flex items-center justify-center">
                <span className="material-symbols-outlined text-headline-md text-on-tertiary-fixed">smart_toy</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md uppercase mb-3">AI ORCHESTRATION</h3>
                <p className="text-on-surface-variant">Deploy a step-by-step execution plan managed by our intelligent compliance neural network. Automated reporting at scale.</p>
              </div>
              <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center cursor-pointer" onClick={() => onNavigate('login')}>
                <span className="text-label-bold font-label-bold uppercase">Learn More</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Intake Section (Assessment Preview) */}
        <section id="solutions" className="px-margin-mobile md:px-margin-desktop py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-headline-lg font-headline-lg uppercase border-l-8 border-secondary pl-6">THE ASSESSMENT INTERFACE</h2>
            <p class="text-body-lg font-body-lg text-on-surface-variant">
              Our multi-step intake engine is designed for rapid institutional deployment. Capture complex ESG datasets through a streamlined, secure interface that validates every entry against global standards in real-time.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-surface-container border-2 border-on-background">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
                <div>
                  <p className="font-label-bold text-label-bold uppercase">Dynamic Form Logic</p>
                  <p className="text-on-surface-variant">Questions adapt based on your industry and jurisdiction.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-surface-container border-2 border-on-background">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
                <div>
                  <p className="font-label-bold text-label-bold uppercase">Auto-Validation</p>
                  <p className="text-on-surface-variant">Built-in error checking prevents non-compliant data entry.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="bg-on-background text-white font-label-bold text-label-bold px-8 py-4 border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase"
            >
              Explore Interface
            </button>
          </div>
        </section>

        {/* Data Table / Metrics Preview */}
        <section id="about" className="px-margin-mobile md:px-margin-desktop py-24 bg-surface">
          <div className="border-2 border-on-background bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-primary-container text-on-primary-container p-6 border-b-2 border-on-background flex justify-between items-center">
              <h3 className="text-headline-md font-headline-md uppercase">QUARTERLY ESG BENCHMARKS</h3>
              <span className="font-label-bold text-label-bold uppercase">Sector: Heavy Industry</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-md">
                <thead>
                  <tr className="bg-surface-container-high border-b-2 border-on-background">
                    <th className="p-4 font-label-bold uppercase border-r-2 border-on-background">Indicator</th>
                    <th className="p-4 font-label-bold uppercase border-r-2 border-on-background text-center">Baseline</th>
                    <th className="p-4 font-label-bold uppercase border-r-2 border-on-background text-center">Target</th>
                    <th className="p-4 font-label-bold uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="font-label-bold">
                  <tr className="border-b-2 border-on-background hover:bg-surface-container-low transition-colors">
                    <td className="p-4 border-r-2 border-on-background">Carbon Intensity (tCO2e/$M)</td>
                    <td className="p-4 border-r-2 border-on-background text-center">450.2</td>
                    <td className="p-4 border-r-2 border-on-background text-center">380.0</td>
                    <td className="p-4 text-center">
                      <span className="bg-error-container text-on-error-container px-2 py-1 border border-on-background text-[10px]">CRITICAL</span>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-on-background hover:bg-surface-container-low transition-colors">
                    <td className="p-4 border-r-2 border-on-background">Board Diversity (%)</td>
                    <td className="p-4 border-r-2 border-on-background text-center">18.5</td>
                    <td className="p-4 border-r-2 border-on-background text-center">30.0</td>
                    <td className="p-4 text-center">
                      <span className="bg-secondary-container text-on-secondary-container px-2 py-1 border border-on-background text-[10px]">ON TRACK</span>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-on-background hover:bg-surface-container-low transition-colors">
                    <td className="p-4 border-r-2 border-on-background">Supply Chain Transparency</td>
                    <td className="p-4 border-r-2 border-on-background text-center">45.0</td>
                    <td className="p-4 border-r-2 border-on-background text-center">85.0</td>
                    <td className="p-4 text-center">
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-1 border border-on-background text-[10px]">IMPROVING</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-lowest text-right italic text-on-surface-variant text-[12px]">
              * Data updated 14-OCT-2023. Source: Global Intelligence Node 4.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-on-background text-white pt-20 pb-24 border-t-4 border-secondary px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h4 className="text-headline-md font-headline-md uppercase tracking-tighter">ESG RESOLVE</h4>
            <p className="text-on-surface-variant/80 max-w-xs">High-authority ESG compliance systems for the next decade of institutional responsibility.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-sm">terminal</span>
              </div>
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-sm">share</span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-label-bold text-label-bold uppercase mb-6 text-secondary">Solutions</h5>
            <ul className="space-y-3 font-body-md text-on-surface-variant/80">
              <li><a className="hover:text-white transition-colors" href="#solutions">Risk Assessment</a></li>
              <li><a className="hover:text-white transition-colors" href="#solutions">Regulatory Filing</a></li>
              <li><a className="hover:text-white transition-colors" href="#solutions">Impact Modeling</a></li>
              <li><a className="hover:text-white transition-colors" href="#solutions">AI Orchestrator</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-bold text-label-bold uppercase mb-6 text-secondary">Company</h5>
            <ul className="space-y-3 font-body-md text-on-surface-variant/80">
              <li><a className="hover:text-white transition-colors" href="#about">Architecture</a></li>
              <li><a className="hover:text-white transition-colors" href="#about">Institutional Labs</a></li>
              <li><a className="hover:text-white transition-colors" href="#about">Ethics Board</a></li>
              <li><a className="hover:text-white transition-colors" href="#about">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-label-bold text-label-bold uppercase text-secondary">Subscribe to Intelligence</h5>
            <div className="relative">
              <input
                className="w-full bg-transparent border-b-2 border-white/20 p-2 focus:border-secondary focus:ring-0 text-white font-label-bold placeholder:text-white/20"
                placeholder="EMAIL@DOMAIN.COM"
                type="email"
              />
              <button className="absolute right-0 bottom-2 material-symbols-outlined text-secondary">arrow_forward</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <span className="font-label-bold text-[10px] uppercase opacity-50">© 2023 ESG RESOLVE SYSTEMS. ALL RIGHTS RESERVED.</span>
          <span className="font-label-bold text-[10px] uppercase opacity-50">ESTABLISHED IN LISBON • SERVING GLOBAL INSTITUTIONS</span>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface border-t-2 border-on-background">
        <div
          onClick={() => onNavigate('landing')}
          className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-1 scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-label-bold font-label-bold">Dashboard</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-1 cursor-pointer" onClick={() => onNavigate('login')}>
          <span className="material-symbols-outlined">menu_open</span>
          <span className="text-label-bold font-label-bold">Modules</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-1 cursor-pointer" onClick={() => onNavigate('login')}>
          <span className="material-symbols-outlined">military_tech</span>
          <span className="text-label-bold font-label-bold">Gaming</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-1 cursor-pointer" onClick={() => onNavigate('login')}>
          <span className="material-symbols-outlined">description</span>
          <span className="text-label-bold font-label-bold">Reports</span>
        </div>
      </nav>
    </div>
  );
}
