'use client';

import { useEffect } from 'react';
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'your-domain.com', // Replace with your actual domain
  apiHost: 'https://plausible.io', // Optional, default value
  trackLocalhost: true, // Optional, default false
});

export default function Analytics() {
  useEffect(() => {
    // Enable automatic page view tracking
    const { enableAutoPageviews } = plausible;
    enableAutoPageviews();

    // Cleanup function
    return () => {
      // No cleanup needed for Plausible
    };
  }, []);

  return null; // This component doesn't render anything
}

// Analytics helper functions for tracking custom events
export const trackEvent = (eventName, props = {}) => {
  plausible.trackEvent(eventName, { props });
};

export const trackQuizCompletion = (score, totalQuestions, category) => {
  trackEvent('quiz_completed', {
    score,
    totalQuestions,
    category,
    completionRate: Math.round((score / totalQuestions) * 100),
  });
};

export const trackGameProgress = (level, achievement) => {
  trackEvent('game_progress', {
    level,
    achievement,
  });
};

export const trackInteraction = (interactionType, details) => {
  trackEvent('user_interaction', {
    type: interactionType,
    details,
  });
}; 