import * as React from "react";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'E-Agle App',
  description: 'The E-AgleTRT official app for checking live data and configurations.',
  manifest: 'manifest.webmanifest',
  publisher: 'E-AgleTRT Software Team',
  appleWebApp: {
    title: 'E-Agle App',
    startupImage: {
      url: 'logo/apple-icon.png'
    } 
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
