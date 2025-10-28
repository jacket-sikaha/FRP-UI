"use client";

import { ThemeCtx } from "@/context";
import { getSystemTheme } from "@/lib";
import React, { useEffect, useState } from "react";

function ThemeConfig({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(
      () =>
        getSystemTheme() ||
        (localStorage?.getItem("theme") as "light" | "dark") ||
        "light"
    );
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export default ThemeConfig;
