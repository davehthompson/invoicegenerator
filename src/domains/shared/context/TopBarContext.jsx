import React, { createContext, useState, useContext, useCallback } from 'react';

const TopBarContext = createContext();

export const TopBarProvider = ({ children }) => {
  const [actions, setActions] = useState(null);

  // Memoize the setActions function
  const memoizedSetActions = useCallback((newActions) => {
    setActions(newActions);
  }, []);

  return (
    <TopBarContext.Provider value={{ actions, setActions: memoizedSetActions }}>
      {children}
    </TopBarContext.Provider>
  );
};

export const useTopBar = () => {
  const context = useContext(TopBarContext);
  if (!context) {
    throw new Error('useTopBar must be used within a TopBarProvider');
  }
  return context;
};