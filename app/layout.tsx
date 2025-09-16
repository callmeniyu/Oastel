import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { BookingProvider } from "@/context/BookingContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import {
  SITE_CONFIG,
  generateOpenGraph,
  generateTwitterCard,
} from "@/lib/seoUtils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: "%s - Oastel",
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords.join(", "),
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
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
  openGraph: generateOpenGraph(SITE_CONFIG.title, SITE_CONFIG.description),
  twitter: generateTwitterCard(SITE_CONFIG.title, SITE_CONFIG.description),
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: "travel",
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WVE732NMTC"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WVE732NMTC');
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable}`}>
        <AuthSessionProvider>
          <ToastProvider>
            <CartProvider>
              <Navbar />
              <main>
                <BookingProvider>{children}</BookingProvider>
              </main>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
