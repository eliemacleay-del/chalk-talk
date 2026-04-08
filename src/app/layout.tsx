import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "./nav";

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
      <body className="bg-[#0A0A0A] text-white min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
