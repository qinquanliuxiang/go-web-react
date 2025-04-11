// components/ThemeProvider.tsx
import { App, ConfigProvider, theme as antdTheme } from "antd";
import { createContext, useEffect, useMemo, useState } from "react";

export const GlobalContext = createContext<{
  theme: "light" | "dark";
  setTheme: (mode: "light" | "dark") => void;
}>({
  theme: "light",
  setTheme: () => {},
});

const THEME_KEY = "app-theme";

function getDefaultTheme(): "light" | "dark" {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return "light";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">(getDefaultTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const contextValue = useMemo(
    () => ({ theme: mode, setTheme: setMode }),
    [mode]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          algorithm:
            mode === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
          components: {
            Table: {
              headerBorderRadius: 8,
              cellFontSize: 13,
              cellPaddingBlock: 16,
            },
            Pagination: {
              fontSize: 13,
            },
            Card: {
              padding: 16,
              paddingLG: 16,
              paddingSM: 12,
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </GlobalContext.Provider>
  );
}
