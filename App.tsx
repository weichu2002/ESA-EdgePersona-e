import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import CardSystem from './components/CardSystem';
import ChatInterface from './components/ChatInterface';
import { UserAnswer, PersonalityProfile } from './types';
import { saveProfileToEdge, getProfileFromEdge } from './services/edgeService';

type View = 'hero' | 'onboarding' | 'chat';

const App: React.FC = () => {
  const [view, setView] = useState<View>('hero');
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user already exists in "Edge Storage" (Local for now)
    const existing = getProfileFromEdge();
    if (existing) {
      setProfile(existing);
      // Optional: auto-redirect if logged in before
      // setView('chat'); 
    }
  }, []);

  const handleStart = () => {
    if (profile) {
      setView('chat');
    } else {
      setView('onboarding');
    }
  };

  const handleOnboardingComplete = async (answers: UserAnswer[]) => {
    setIsLoading(true);
    // Simulate edge computation
    const newProfile = await saveProfileToEdge(answers);
    setProfile(newProfile);
    setIsLoading(false);
    setView('chat');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
         <div className="w-16 h-16 border-4 border-edge-800 border-t-edge-accent rounded-full animate-spin"></div>
         <p className="font-mono text-edge-accent animate-pulse">Initializing Neural Pathways on Edge Node...</p>
      </div>
    );
  }

  return (
    <>
      {view === 'hero' && <Hero onStart={handleStart} />}
      {view === 'onboarding' && <CardSystem onComplete={handleOnboardingComplete} />}
      {view === 'chat' && profile && <ChatInterface profile={profile} />}
    </>
  );
};

export default App;
