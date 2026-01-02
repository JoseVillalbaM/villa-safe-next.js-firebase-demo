'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
// IMPORTACIÓN FALTANTE: styled-components
import  { DefaultTheme, ThemeProvider as StyledThemeProvider } from 'styled-components'; 
import { darkTheme, lightTheme } from '../lib/theme'; // Ajusta la ruta a tu lib/theme

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: DefaultTheme;
}

// Inicializa el contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderComponent = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {/* Usamos el componente renombrado para evitar conflictos con el nombre del Provider de React */}
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de ThemeProviderComponent');
  }
  return context;
};

