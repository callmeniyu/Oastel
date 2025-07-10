"use client"
import { useState } from "react"
import Image from "next/image"
import { FiShoppingCart, FiTrash2, FiArrowRight, FiClock, FiMapPin, FiCalendar, FiUser, FiCreditCard } from "react-icons/fi"
import Link from "next/link"

type CartItem = {
    id: string
    type: "tour" | "transfer"
    title: string
    image: string
    price: number
    date: string
    time: string
    adults: number
    children?: number
    details: {
        duration?: string
        pickup?: string
    }
}

export default function MyCartContent() {
    // Dummy cart data - replace with your actual state management
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            type: "tour",
            title: "Full Day Land Rover Adventure",
            image: "/images/transfer5.jpg",
            price: 449,
            date: "2023-11-15",
            time: "09:00 AM",
            adults: 2,
            children: 1,
            details: {
                                pickup: "Heritage Hotel",

            },
        },
        {
            id: "2",
            type: "transfer",
            title: "Cameron Highlands to KL",
            image: "/images/transfer6.jpg",
            price: 120,
            date: "2023-11-20",
            time: "10:00 PM",
            adults: 1,
            children: 0,
            details: {
                pickup: "Heritage Hotel",
            },
        },
        {
            id: "3",
            type: "tour",
            title: "Sunrise + Half Day Tour",
            image: "/images/transfer7.jpg",
            price: 299,
            date: "2023-12-05",
            time: "08:00 AM",
            adults: 2,
            children: 3,
            details: {
                pickup: "Heritage Hotel",
            },
        },
    ])

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
    const BankCharge = (subtotal * 0.028).toFixed(2) // 3% bank charge
    const total = (subtotal + Number(BankCharge)).toFixed(2)

    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter((item) => item.id !== id))
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:py-6 md:px-0 font-poppins">
            <div className="flex items-center gap-3 mb-6">
                <FiShoppingCart className="text-2xl text-primary_green" />
                <h1 className="text-2xl md:text-3xl font-bold text-title_black">My Cart</h1>
            </div>

            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
                            >
                                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                                    <Image src={item.image} alt={item.title} fill className="object-cover rounded-lg" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-title_black">{item.title}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-2 items-center text-sm text-desc_gray">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar />
                                            {new Date(item.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                        <div className="flex items-center text-desc_gray">
                                            <FiClock className="mr-2" />
                                            <span>{item.time}</span>
                                        </div>
                                        <div className="flex items-center text-desc_gray">
                                            <FiUser className="mr-2" />
                                            <span className="flex flex-col">
                                                {item.adults} {item.adults === 1 ? "adult" : "adults"}, {item.children}{" "}
                                                {item.children === 1 ? "child" : "children"}
                                            </span>
                                        </div>

                                            <p className="flex items-center gap-2">
                                            <FiMapPin className="" />
                                                {item.details.pickup}
                                            </p>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-center gap-2">
                                    <p className="text-lg font-bold text-primary_green">RM {item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold text-title_black mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-desc_gray">Subtotal</span>
                                <span className="font-medium">RM {subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-desc_gray">Bank Charge</span>
                                <span className="font-medium">RM {BankCharge}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold text-primary_green">RM {total}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="w-full bg-primary_green text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary_green/90 transition-colors"
                        >
                            Checkout
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiShoppingCart className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-title_black mb-2">Your cart is empty</h3>
                    <p className="text-desc_gray mb-6">Add tours or transfers to get started</p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            href="/tours"
                            className="bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors"
                        >
                            Browse Tours
                        </Link>
                        <Link
                            href="/transfers"
                            className="border border-primary_green text-primary_green px-6 py-2 rounded-lg hover:bg-primary_green/5 transition-colors"
                        >
                            View Transfers
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
