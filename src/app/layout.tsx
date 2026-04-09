import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "./nav";

export const metadata: Metadata = {
  title: "RepIQ — Train Your Football IQ",
  description: "Turn your playbook into reps. AI-built quizzes for football players.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-ink min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
