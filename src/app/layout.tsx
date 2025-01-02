import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme";

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

import { ClerkProvider } from "@clerk/nextjs";

import ReactQueryProvider from "@/react-query";



const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TravelVote - Discover & Share Amazing Places',
  description: 'Discover, vote, and share the best places to visit across states and cities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light">
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <ReactQueryProvider>
               <main className="flex-1">
                {children}
                <Toaster />
                </main>
                </ReactQueryProvider>
              <Footer />
            </div>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}