import './globals.css'; 
import type { Metadata } from 'next'; 
import { Inter } from 'next/font/google'; 
import { ThemeProvider } from "@/components/theme";  
import { Navbar } from '@/components/navbar';
import { Toaster } from "sonner";   
import { ClerkProvider } from "@clerk/nextjs";  
import ReactQueryProvider from "@/react-query";    

const inter = Inter({  
  subsets: ['latin'],  
  variable: '--font-sans', 
});  

export const metadata: Metadata = {  
  title: 'Vibeuno - Discover & Share Amazing Places',  
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
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/swiper@8.5.0/swiper-bundle.min.css"
          />
        </head>
        <body className={`${inter.variable} font-sans h-screen overflow-hidden`}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <div className="flex h-full flex-col">
              <ReactQueryProvider>
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                  {children}
                  <Toaster />
                </main>
              </ReactQueryProvider>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  ); 
}