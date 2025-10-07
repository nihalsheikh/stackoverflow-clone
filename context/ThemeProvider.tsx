"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  themeMode: string;
  setThemeMode: (themeMode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState("");

  const handleThemeChange = () => {
    if (themeMode === "dark") {
      setThemeMode("light");
      document.documentElement.classList.add("light");
    } else {
      setThemeMode("dark");
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
