import React from "react";

import { type Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

import "../styles/prism.css";

import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "CodeOverFlow",
  description:
    "CodeOverFlow is a full-stack web application that replicates the core functionality of Stack Overflow, creating a collaborative space for developers to ask technical questions, share knowledge, and solve problems together. The platform is designed to foster a vibrant community where users can build their reputation by providing valuable answers and engaging with content.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
