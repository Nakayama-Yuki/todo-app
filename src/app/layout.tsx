import type { Metadata } from "next";
import ThemeProvider from "@/context/themeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "TodoApp",
  description: "CRUDに挑戦したメモアプリです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
