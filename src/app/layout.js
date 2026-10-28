import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AquaFuzz AI | Fuzzy Water Quality Assessment (Soft Computing)",
  description:
    "An advanced Mamdani Fuzzy Inference System for continuous water quality assessment, linguistic membership visualization, and river basin environmental intelligence. Developed by Ashank Gupta.",
  keywords: [
    "Fuzzy Logic",
    "Soft Computing",
    "Water Quality Assessment",
    "Mamdani Inference",
    "WQI",
    "Defuzzification",
    "Environmental Engineering"
  ],
  authors: [{ name: "Ashank Gupta" }]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#060b18] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
