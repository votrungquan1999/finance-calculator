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
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
  ),
  title: {
    default: "Finance Calculator | Free Loan & Investment Calculators",
    template: "%s | Finance Calculator",
  },
  description:
    "Free professional financial calculators for loan payments, investment returns, and mortgage calculations. Get detailed amortization schedules with export capabilities. No registration required.",
  keywords: [
    "loan calculator",
    "investment calculator",
    "mortgage payment calculator",
    "loan payment calculator",
    "compound interest calculator",
    "amortization calculator",
    "declining balance loan calculator",
    "annuity calculator",
    "financial planning tools",
    "free finance calculator",
    "loan amortization schedule",
    "investment growth calculator",
    "monthly payment calculator",
    "interest rate calculator",
    "financial tools",
  ],
  authors: [{ name: "Finance Calculator" }],
  creator: "Finance Calculator",
  publisher: "Finance Calculator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Finance Calculator | Free Loan & Investment Calculators",
    description:
      "Professional financial calculators for loan payments, investment returns, and mortgage calculations. Export results, generate amortization schedules, and make informed financial decisions.",
    siteName: "Finance Calculator",
    images: [
      {
        url: "/og-image.jpg", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Finance Calculator - Professional Financial Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Calculator | Free Loan & Investment Calculators",
    description:
      "Professional financial calculators with detailed results and export capabilities. Calculate loan payments, investment returns, and more.",
    images: ["/og-image.jpg"], // You'll need to create this image
  },
  alternates: {
    canonical: "/",
  },
  category: "finance",
  classification: "Financial Tools",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    "application-name": "Finance Calculator",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Finance Calculator",
    "mobile-web-app-capable": "yes",
    "theme-color": "#2563eb",
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
