import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "予約デモ",
  description: "最小構成の予約システムデモ"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main>
          <header>
            <a href="/">予約デモ</a>
            <nav>
              <a href="/admin">管理</a>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
