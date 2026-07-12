import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      {currentScreen === 'landing' ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : (
        <LoginPage onNavigate={handleNavigate} />
      )}
    </>
  );
}
