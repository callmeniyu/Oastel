"use client"
import Link from "next/link"
import Lottie from "lottie-react"
import { IoHome, IoMailOutline, IoArrowBack } from "react-icons/io5"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center p-4 font-poppins relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary_green rounded-full blur-3xl"></div>
                <div className="absolute bottom-32 right-16 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Lottie Animation */}
                <div className="w-full max-w-sm mx-auto mb-8">
                    <Lottie animationData={require("@/public/images/404.json")} autoplay loop className="w-full h-80" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-extrabold text-primary_green mb-2 tracking-tight">404</h1>
                        <h2 className="text-3xl md:text-4xl font-bold text-title_black mb-4">Oops! Page Not Found</h2>
                    </div>

                    <p className="text-desc_gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Looks like you've wandered off the beaten path! The page you're looking for doesn't exist, but don't
                        worry – we'll help you find your way back to amazing adventures.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3 bg-primary_green hover:bg-primary_green/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <IoHome className="text-xl group-hover:scale-110 transition-transform" />
                            Return Home
                        </Link>

                        <Link
                            href="/contact-us"
                            className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-primary_green border-2 border-primary_green px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <IoMailOutline className="text-xl group-hover:scale-110 transition-transform" />
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Back button for mobile */}
            <button
                onClick={() => window.history.back()}
                className="fixed bottom-6 left-6 bg-white hover:bg-gray-50 text-primary_green p-3 rounded-full shadow-lg border border-primary_green/20 transition-all duration-300 hover:scale-110 sm:hidden"
                aria-label="Go back"
            >
                <IoArrowBack className="text-xl" />
            </button>
        </div>
    )
}
