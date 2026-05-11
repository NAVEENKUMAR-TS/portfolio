import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  weight: ["700", "900"]
});

export const metadata: Metadata = {
  title: "NAVEENKUMAR T S | Portfolio",
  description: "Personal portfolio of NAVEENKUMAR T S",
};

import { SpaceBackground } from "@/components/SpaceBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <SpaceBackground />
        <LenisProvider>
          <Navbar />
          <main className="bg-transparent">{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
