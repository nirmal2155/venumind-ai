import React, { createContext, useState, useContext } from 'react';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [isEmergency, setEmergency] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  return (
    <EmergencyContext.Provider value={{ isEmergency, setEmergency, broadcastMessage, setBroadcastMessage }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
