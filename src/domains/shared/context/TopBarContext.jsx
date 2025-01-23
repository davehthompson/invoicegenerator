import React, { createContext, useState, useContext } from 'react';

const TopBarContext = createContext();

export const TopBarProvider = ({ children }) => {
  const [actions, setActions] = useState(null);

  return (
    <TopBarContext.Provider value={{ actions, setActions }}>
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