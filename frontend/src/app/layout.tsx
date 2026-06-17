import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "StreamNest",
  description: "A production-ready video sharing platform built with Next.js and FastAPI."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Header />
          <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
