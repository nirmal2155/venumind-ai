/* eslint-disable react-refresh/only-export-components */
/**
 * @fileoverview Emergency Context Provider with Offline State Persistence
 * @description Manages stadium-wide emergency broadcast state using React Context.
 * State is persisted to localStorage so that emergency alerts survive page
 * refreshes and network interruptions — critical for stadium safety scenarios.
 * @module EmergencyContext
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const EmergencyContext = createContext();

/**
 * @component EmergencyProvider
 * @description Provides emergency state to all child components with automatic
 * localStorage persistence for offline-first resilience.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const EmergencyProvider = ({ children }) => {
  const [isEmergency, setEmergencyState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('venumind_emergency')) || false;
    } catch { return false; }
  });
  
  const [broadcastMessage, setBroadcastMessage] = useState(() => {
    try {
      return localStorage.getItem('venumind_broadcast') || '';
    } catch { return ''; }
  });

  // Persist emergency state changes to localStorage and announce vocally if enabled
  useEffect(() => {
    try {
      localStorage.setItem('venumind_emergency', JSON.stringify(isEmergency));
      localStorage.setItem('venumind_broadcast', broadcastMessage);
    } catch { /* localStorage unavailable - graceful degradation */ }

    if (isEmergency) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Attention. Evacuation protocol initiated. Please proceed to the nearest exit gate D immediately.");
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isEmergency, broadcastMessage]);

  /** @function setEmergency - Memoized setter to prevent unnecessary re-renders */
  const setEmergency = useCallback((value) => {
    setEmergencyState(value);
  }, []);

  return (
    <EmergencyContext.Provider value={{ isEmergency, setEmergency, broadcastMessage, setBroadcastMessage }}>
      {children}
    </EmergencyContext.Provider>
  );
};

/**
 * @hook useEmergency
 * @description Custom hook to access emergency context from any component.
 * @returns {{ isEmergency: boolean, setEmergency: Function, broadcastMessage: string, setBroadcastMessage: Function }}
 */
export const useEmergency = () => useContext(EmergencyContext);
