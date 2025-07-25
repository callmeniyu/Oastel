import { NextResponse } from "next/server"
import User from "@/models/User"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { username, email, password } = await request.json()

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json({ error: "Email already in use, Please try login" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name: username,
            email,
            passwordHash: hashedPassword,
            image: "",
            location: "",
            bio: "",
            address: {
                whatsapp: "",
                phone: "",
                pickupAddresses: [],
            },
            cartId: "",
            bookings: "",
            provider: "credentials",
        })

        return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Error creating user" }, { status: 500 })
    }
}
