import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mira – Web Health AI Assistant",
  description:
    "Mira adalah asisten kesehatan berbasis AI yang membantu analisis gejala, memberikan tips kesehatan harian, dan info obat terpercaya untuk gaya hidup sehat.",
  keywords: [
    "Mira",
    "Web Health AI",
    "AI Kesehatan",
    "Analisis Gejala",
    "Info Obat",
    "Tips Kesehatan",
    "Nutrition Planner",
    "Symptom Checker",
    "Health Library",
  ],
  authors: [{ name: "Mira Team" }],
  openGraph: {
    title: "Mira – Asisten Kesehatan Berbasis AI",
    description:
      "Kenali gejala, temukan informasi obat, dan dapatkan saran kesehatan harian dengan Mira – Web Health AI yang siap bantu kamu hidup lebih sehat.",
    siteName: "Mira",
    images: [
      {
        url: "/asset/cover.png",
        width: 1200,
        height: 630,
        alt: "Mira Health AI Cover",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mira – Asisten Kesehatan Berbasis AI",
    description:
      "Mira bantu kamu pantau kesehatan, analisis gejala, dan temukan informasi medis terpercaya langsung dari AI.",
    images: ["https://mira.healthai.id/cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Preloader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
