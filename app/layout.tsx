import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevPulse — GitHub Developer Analytics",
    template: "%s · DevPulse",
  },
  description:
    "Instant public GitHub analytics. Paste any username and get a beautiful dashboard of repos, languages, and activity — no sign-up needed.",
  openGraph: {
    siteName: "DevPulse",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ backgroundColor: "#0d1117", color: "#e6edf3" }}
      >
        <Header />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
