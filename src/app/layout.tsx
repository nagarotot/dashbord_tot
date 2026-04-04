import type { Metadata } from "next";
import { Rubik, Geist_Mono, Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/lib/data-context";

const rubik = Rubik({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-timer-digital",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academic Notes Manager",
  description: "Personal secure academic notes platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body
        className={`${rubik.variable} ${geistMono.variable} ${orbitron.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
