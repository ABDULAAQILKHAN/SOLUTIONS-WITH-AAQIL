import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Solutions With Aaqil | Full-Stack Developer & AI Enthusiast",
  description: "Portfolio of Aaqil Khan, a versatile Full-Stack Developer specializing in React, Svelte, FastAPI, and AI/ML solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/A logo.png" type="image/x-icon" />
        <meta name="google-site-verification" content="LgyFE7mbysgRKfm4khYfITpcJykfggm9gHxia6DTI3g" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
