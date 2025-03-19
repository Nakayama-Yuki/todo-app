"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// ThemeContextType インターフェースは、テーマとテーマを切り替える関数を定義します。
export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// ThemeContext は、テーマの状態とテーマを切り替える関数を提供するコンテキストです。
// デフォルト値は "light" です。
const ThemeContext = createContext<ThemeContextType | undefined>({
  theme: "light",
  toggleTheme: () => {},
});

// ThemeProvider コンポーネントは、テーマの状態を管理し、子コンポーネントにテーマの状態と
// テーマを切り替える関数を提供します。
// @param children - 子コンポーネント
export default function ThemeProvider({ children }: { children: ReactNode }) {
  // テーマの状態を管理するための状態変数
  const [theme, setTheme] = useState("light");

  // toggleTheme 関数は、テーマを "light" から "dark" に、またはその逆に切り替えます。
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // コンテキストプロバイダーを通じてテーマの状態と切り替え関数を子コンポーネントに提供
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// useTheme フックは、ThemeContext からテーマの状態とテーマを切り替える関数を取得します。
// このフックは、ThemeProvider 内でのみ使用する必要があります。
export function useTheme(): ThemeContextType {
  // コンテキストからテーマ情報を取得
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
