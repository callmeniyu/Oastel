import type { Metadata } from "next"
import "./globals.css"
import { Poppins } from "next/font/google"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"
import { BookingProvider } from "@/context/BookingContext"
import { ToastProvider } from "@/context/ToastContext"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Oastel",
    description: "Tours, Transfers, stays in Malaysia",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable}`}>
                <ToastProvider>
                    <Navbar />
                    <main>
                        <BookingProvider>{children}</BookingProvider>
                    </main>
                    <Footer />
                </ToastProvider>
            </body>
        </html>
    )
}
