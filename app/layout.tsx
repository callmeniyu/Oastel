import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";


const poppins = Poppins({
  subsets: ['latin'], 
  weight: ['300','400', '500', '600', '700'], 
  variable: '--font-poppins', 
  display: 'swap', 
});

export const metadata: Metadata = {
  title: "Oastel",
  description: "Tours, Transfers, stays in Malaysia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
      <body className={`${poppins.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
