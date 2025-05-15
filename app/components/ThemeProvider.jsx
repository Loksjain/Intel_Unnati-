'use client';

import { createContext, useContext } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
} 