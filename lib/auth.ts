import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import User from "@/models/User"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect()

                // Check if user exists
                const user = await User.findOne({ email: credentials?.email })

                if (!user) {
                    throw new Error("No user found with this email")
                }

                // Check if password is correct
                if (user.passwordHash) {
                    const isValid = await bcrypt.compare(credentials?.password || "", user.passwordHash)

                    if (!isValid) {
                        throw new Error("Invalid password")
                    }
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn(params: {
            user: any
            account: any
            profile?: { email?: string; name?: string; sub?: string; picture?: string }
            email?: { verificationRequest?: boolean }
            credentials?: Record<string, unknown>
        }) {
            const { user, account, profile } = params
            await dbConnect()

            if (account?.provider === "google") {
                const existingUser = await User.findOne({ email: profile?.email })

                if (!existingUser) {
                    // Create new user with complete UserType schema
                    await User.create({
                        name: profile?.name,
                        email: profile?.email,
                        passwordHash: "",
                        image: profile?.picture || "",
                        location: "",
                        bio: "",
                        address: {
                            whatsapp: "",
                            phone: "",
                            pickupAddresses: [],
                        },
                        cartId: "",
                        bookings: "",
                        provider: "google",
                        googleId: profile?.sub,
                    })
                } else if (existingUser.provider !== "google") {
                    return "/auth/error?error=email-already-in-use"
                }
            }

            return true
        },
        async jwt({ token, user }: { token: Record<string, any>; user?: Record<string, any> }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
