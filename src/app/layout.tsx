import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chalk Talk",
  description: "Gamified study app for athletes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <a href="/" className="text-xl font-bold tracking-tight text-white">
            Chalk Talk
          </a>
          <a
            href="/upload"
            className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
          >
            Get Started
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
