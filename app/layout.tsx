import type { Metadata } from "next";
import { Inter, Geist, Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bit-Barber System",
  description: "All-in-one SaaS for Ethiopian barber shops to run chairs, bookings, and the till.",
  icons: {
    icon: "/brand/logo-favicon.png",
    apple: "/brand/logo-mark.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, nunito.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
