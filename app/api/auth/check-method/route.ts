import { NextResponse } from "next/server"
import User from "@/models/User"
import dbConnect from "@/lib/dbConnect"

export async function GET(request: Request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)
        const email = searchParams.get("email")

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const user = await User.findOne({ email: normalizedEmail })

        if (!user) {
            return NextResponse.json({ success: true, method: "not_found" })
        }

        if (user.provider === "google") {
            return NextResponse.json({ success: true, method: "google" })
        }

        if (!user.passwordHash) {
            return NextResponse.json({ success: true, method: "guest" })
        }

        return NextResponse.json({ success: true, method: "credentials" })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
