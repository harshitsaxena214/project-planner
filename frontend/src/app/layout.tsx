import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
import type { Metadata } from "next";

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})


export const metadata: Metadata = {
  title: "FlowShip - Build Apps Smarter with AI",
  description:
    "FlowShip helps you turn ideas into structured tasks and improve your code with AI-powered reviews. Plan, build, and ship faster.",

  metadataBase: new URL("https://flowship.vercel.app"),

  openGraph: {
    title: "FlowShip - AI Project Planner & Code Reviewer",
    description:
      "Break your app idea into actionable tasks, track progress, and get intelligent code reviews — all in one place.",
    type: "website",
    url: "https://flowship.vercel.app",
    images: [
      {
        url: "https://flowship.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "FlowShip - AI Development Assistant",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FlowShip - Build & Ship Faster",
    description:
      "Your AI co-builder that generates tasks and reviews code so you can ship faster.",
    site: "@harshits_twt", 
    images: ["https://flowship.vercel.app/preview.png"],
  },
};


export default function RootLayout({ children }: any) {
  return (
    <ClerkProvider>
      <html>
        <body className={inter.className}>
          <QueryProvider>
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}