"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

/*
 * ThemeContextType インターフェースは、テーマとテーマを切り替える関数を定義します。
 */
export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

/*
 * ThemeContext は、テーマの状態とテーマを切り替える関数を提供するコンテキストです。
 * デフォルト値は "light" です。
 */
const ThemeContext = createContext<ThemeContextType | undefined>({
  theme: "light",
  toggleTheme: () => {},
});

/*
 * ThemeProvider コンポーネントは、テーマの状態を管理し、子コンポーネントにテーマの状態と
 * テーマを切り替える関数を提供します。
 * @param children - 子コンポーネント
 */

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState("light");

  /*
   * toggleTheme 関数は、テーマを "light" から "dark" に、またはその逆に切り替えます。
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/*
 * useTheme フックは、ThemeContext からテーマの状態とテーマを切り替える関数を取得します。
 * このフックは、ThemeProvider 内でのみ使用する必要があります。
 * @returns ThemeContextType - テーマの状態とテーマを切り替える関数
 * @throws エラー - ThemeProvider の外で使用された場合
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
