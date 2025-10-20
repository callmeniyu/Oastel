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
                try {
                    // Add timeout to database operations
                    await Promise.race([
                        dbConnect(),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Database connection timeout')), 5000)
                        )
                    ]);

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
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
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
            
            try {
                // Add timeout to database connection
                await Promise.race([
                    dbConnect(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
                    )
                ]);

                if (account?.provider === "google") {
                    const existingUser = await User.findOne({ email: profile?.email })

                    if (!existingUser) {
                        // Create new user with complete UserType schema
                        try {
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
                                // Schema expects a string for bookings (use empty string as default)
                                bookings: "",
                                provider: "google",
                                googleId: profile?.sub,
                            })
                        } catch (err) {
                            console.error("Failed to create user on Google sign-in:", err)
                            // Redirect to a clearer error page for server-side failures
                            return "/auth/error?error=server_error"
                        }
                    } else if (existingUser.provider !== "google") {
                        return "/auth/error?error=email-already-in-use"
                    }
                }

                return true
            } catch (error) {
                console.error("SignIn callback error:", error);
                return "/auth/error?error=callback_error"
            }
        },
        async jwt({ token, user, account }: { token: Record<string, any>; user?: Record<string, any>; account?: any }) {
            if (user) {
                token.id = user.id
            }
            if (account?.provider) {
                token.provider = account.provider
            }
            return token
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.provider = token.provider
            }
            return session
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    // Disable debug logging in production to improve performance
    debug: process.env.NODE_ENV === 'development',
    // Lightweight logger only for errors in production
    logger: {
        error(code: string, ...metadata: any[]) {
            console.error("[next-auth][error]", code, ...metadata)
        },
        warn(code: string) {
            if (process.env.NODE_ENV === 'development') {
                console.warn("[next-auth][warn]", code)
            }
        },
        debug(code: string, ...metadata: any[]) {
            if (process.env.NODE_ENV === 'development') {
                console.debug("[next-auth][debug]", code, ...metadata)
            }
        },
    },
    // Event hooks to log signIn attempts and errors
    events: {
        async signIn(message: any) {
            try {
                console.log("[next-auth][event][signIn]", { provider: message?.provider, user: message?.user?.email })
            } catch (e) {
                console.log("[next-auth][event][signIn] (error logging)", e)
            }
        },
        async error(message: any) {
            try {
                console.error("[next-auth][event][error]", message)
            } catch (e) {
                console.error("[next-auth][event][error] (error logging)", e)
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
