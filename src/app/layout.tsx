import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "src/components/navigation";
import { Toaster } from "src/components/ui/sonner";
import { SavedValuesProvider } from "src/contexts/saved-values-context";
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
  title: "Finance Calculator | Loan & Investment Tools",
  description:
    "Professional loan and investment calculators for declining balance loans, annuity payments, and recurring investments. Calculate monthly payments, interest rates, and investment returns.",
  keywords: [
    "loan calculator",
    "investment calculator",
    "finance tools",
    "mortgage calculator",
    "interest calculator",
  ],
  authors: [{ name: "Finance Calculator App" }],
  openGraph: {
    title: "Finance Calculator | Loan & Investment Tools",
    description:
      "Professional loan and investment calculators for declining balance loans, annuity payments, and recurring investments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SavedValuesProvider>
          <AppSidebar>{children}</AppSidebar>
          <Toaster />
        </SavedValuesProvider>
      </body>
    </html>
  );
}
