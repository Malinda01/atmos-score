import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage first, default to 'light' to avoid confusion for now
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Remove both classes first
    root.classList.remove("light", "dark");

    // 2. Determine which specific theme to apply
    let appliedTheme = theme;
    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // 3. Add the class to the <html> tag
    root.classList.add(appliedTheme);

    // 4. Save preference
    localStorage.setItem("theme", theme);

    // Debugging: Check console to see if state changes
    console.log(`Theme changed to: ${appliedTheme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
