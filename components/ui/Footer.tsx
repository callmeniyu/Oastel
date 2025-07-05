import { FaFacebookF } from "react-icons/fa"
import { FaYoutube } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { FaTiktok } from "react-icons/fa"
import { FaTelegramPlane } from "react-icons/fa"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-primary_green text-white px-4 pt-10 pb-2 md:pr-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
                <div className="text-4xl font-bold my-auto font-poppins w-2/6 flex md:justify-center">
                    <h1>Oastel</h1>
                    {/* <div className="flex gap-3 mt-24">
                        <Link href="https://www.facebook.com/Oastel" target="_blank">
                            <FaFacebookF className="text-white text-3xl hover:text-gray-300 transition" />
                        </Link>
                        <Link href="https://www.youtube.com/@oastel" target="_blank">
                            <FaYoutube className="text-white text-3xl hover:text-gray-300 transition" />
                        </Link>
                        <Link href="https://www.instagram.com/oastel/" target="_blank">
                            <FaInstagram className="text-white text-3xl hover:text-gray-300 transition" />
                        </Link>
                        <Link href="https://twitter.com/oastel" target="_blank">
                            <FaXTwitter className="text-white text-3xl hover:text-gray-300 transition" />
                        </Link>
                        <Link href="https://www.tiktok.com/@oastel" target="_blank">
                            <FaTiktok className="text-white text-3xl hover:text-gray-300 transition" />
                        </Link>
                        <Link href="https://t.me/oastel" target="_blank">
                            <FaTelegramPlane className="text-white text-3xl hover:text-gray-300 transition" />
                        </Link>
                    </div> */}
                </div>
                <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm md:text-base my-4 justify-center">
                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">About</h4>
                            <ul className="space-y-1 font-medium">
                                <li>
                                    <Link href="/about#about-us">About us</Link>
                                </li>
                                <li>
                                    <Link href="/about#our-story">Our Story</Link>
                                </li>
                                <li>
                                    <Link href="/about#our-features">Features</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Services</h4>
                            <ul className="space-y-1 font-medium">
                                <li>
                                    <a href="#">Tours</a>
                                </li>
                                <li>
                                    <a href="#">Vans</a>
                                </li>
                                <li>
                                    <a href="#">Stays</a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Help</h4>
                            <ul className="space-y-1 font-medium">
                                <li>
                                    <a href="#">Contact Us</a>
                                </li>
                                <li>
                                    <a href="#">Feedback</a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Others</h4>
                            <ul className="space-y-1 font-medium">
                                <li>
                                    <a href="#">Terms & Conditions</a>
                                </li>
                                <li>
                                    <a href="#">Blogs</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <img src="/images/footer_payment1.png" className="w-13 h-12" alt="footer_payment" />
                        <img src="/images/footer_payment2.png" className="w-13 h-12" alt="footer_payment" />
                        <img src="/images/footer_payment3.png" className="w-13 h-12" alt="footer_payment" />
                        <img src="/images/footer_payment4.png" className="w-13 h-12" alt="footer_payment" />
                        <img src="/images/footer_payment5.png" className="w-13 h-12" alt="footer_payment" />
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 text-center text-xs text-gray-300 font-poppins font-medium">
                Copyright@2025 Oastel. All Rights Reserved.
            </div>
        </footer>
    )
}
