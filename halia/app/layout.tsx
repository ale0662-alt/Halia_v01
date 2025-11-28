import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Halia - AI Hiring Assistant",
  description: "Recruiting intelligente per startup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Questo componente attiva la gestione utenti in tutta l'app
    <ClerkProvider>
      <html lang="it">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
