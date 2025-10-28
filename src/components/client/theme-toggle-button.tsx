"use client";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

const ThemeToggleButton = () => {
  // 初始化主题状态，优先从localStorage读取，默认深色模式
  const [isDarkMode, setIsDarkMode] = useState(() => {
    let flag =
      typeof window !== "undefined"
        ? localStorage?.getItem("theme") === "dark" ||
          (!localStorage?.getItem("theme") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        : false;
    return flag;
  });
  // 当主题变化时更新DOM和localStorage
  useEffect(() => {
    const html = document.querySelector<HTMLHtmlElement>("html");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      // html?.setAttribute("data-prefers-color", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      // html?.setAttribute("data-prefers-color", "light");
    }
  }, [isDarkMode]);

  // 切换主题的处理函数
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      onClick={toggleTheme}
      className="flex items-center justify-center size-8"
    >
      {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
    </div>
  );
};

export default ThemeToggleButton;
