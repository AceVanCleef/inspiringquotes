import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import NavBar from "@/components/ui/organisms/NavBar";
import Footer from "@/components/ui/organisms/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inspiring Quotes",
  description: "Quotes from inspiring personalities to overcome any challenges of your everyday life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body> 
        {/* 
          Important: 
            classNames for Body must be put in div below to prevent issue with shadcn/select
            Source: https://github.com/shadcn-ui/ui/issues/977#issuecomment-1646616629
        */}
        <div
          className={`p-10 max-w-2xl mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="pb-4">
            <NavBar />
          </div>
          <Providers>
            {children}
          </Providers>
          <div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
