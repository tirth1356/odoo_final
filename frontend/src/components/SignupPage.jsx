import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(`${apiUrl}/api/auth/register/`, {
        username,
        email,
        password
      });
      setSuccess("Registration successful! Please sign in with your new credentials.");
      // Navigate to login after a short delay
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Basic error formatting from DRF
        const msgs = Object.values(err.response.data).flat();
        setError(msgs.join(" "));
      } else {
        setError("An error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* TopAppBar */}
      <header className="w-full top-0 border-b-2 border-on-surface bg-background flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 z-50">
        <Link
          to="/"
          className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tighter text-on-surface cursor-pointer"
        >
          ESG CORE
        </Link>
        <Link
          to="/"
          className="font-label-bold text-label-bold uppercase px-4 py-2 bg-on-surface text-background hover:bg-secondary transition-colors brutalist-shadow-active"
        >
          HOME
        </Link>
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
                Join the definitive operating system for environmental, social, and governance intelligence.
              </p>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-secondary">verified_user</span>
                <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Military-Grade Encryption Standard</span>
              </div>
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

        {/* Right Side: Signup Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop bg-surface-container">
          <div className="w-full max-w-md bg-background border-[3px] border-on-surface p-8 brutalist-shadow transition-all duration-300">
            <header className="mb-8 border-b-2 border-on-surface pb-6">
              <h2 className="font-headline-md text-headline-md uppercase mb-1">REGISTER</h2>
              <p className="font-label-bold text-label-bold text-on-surface-variant">CREATE INSTITUTIONAL ACCESS</p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border-2 border-error">
                <p className="font-label-bold text-sm uppercase">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-secondary-container text-on-secondary-container border-2 border-secondary">
                <p className="font-label-bold text-sm uppercase">{success}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Username */}
              <div className="space-y-2">
                <label
                  className={`block font-label-bold text-label-bold uppercase transition-colors ${isUsernameFocused ? 'text-secondary' : 'text-on-surface'
                    }`}
                  htmlFor="username"
                >
                  USERNAME
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">person</span>
                  <input
                    className="w-full bg-surface-container-low border-2 border-on-surface px-12 py-4 font-body-md focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                    id="username"
                    name="username"
                    placeholder="USERNAME_XXXXXX"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => setIsUsernameFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  className={`block font-label-bold text-label-bold uppercase transition-colors ${isEmailFocused ? 'text-secondary' : 'text-on-surface'
                    }`}
                  htmlFor="email"
                >
                  INSTITUTIONAL EMAIL
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">alternate_email</span>
                  <input
                    className="w-full bg-surface-container-low border-2 border-on-surface px-12 py-4 font-body-md focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                    id="email"
                    name="email"
                    placeholder="name@institution.edu"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label
                    className={`block font-label-bold text-label-bold uppercase transition-colors ${isConfirmPasswordFocused ? 'text-secondary' : 'text-on-surface'
                      }`}
                    htmlFor="confirmPassword"
                  >
                    CONFIRM ACCESS KEY
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">lock</span>
                  <input
                    className="w-full bg-surface-container-low border-2 border-on-surface px-12 py-4 font-body-md focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col gap-4">
                <button
                  className="w-full bg-secondary text-on-secondary font-headline-md text-headline-md uppercase py-4 border-2 border-on-surface brutalist-shadow brutalist-shadow-active brutalist-shadow-hover transition-all focus:outline-none"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'PROCESSING...' : 'REGISTER'}
                </button>
                <div className="text-center mt-2">
                  <Link
                    to="/login"
                    className="font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-tertiary transition-colors border-b-2 border-transparent hover:border-tertiary"
                  >
                    ALREADY HAVE ACCESS? SIGN IN
                  </Link>
                </div>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-12 p-4 bg-surface-container-highest border border-on-surface-variant/20 flex gap-4 items-start">
              <span className="material-symbols-outlined text-error mt-1">gpp_maybe</span>
              <p className="font-label-bold text-[10px] leading-tight text-on-surface-variant opacity-80">
                BY PROCEEDING, YOU ACKNOWLEDGE THAT SYSTEM ACCESS IS LOGGED AND MONITORED.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
