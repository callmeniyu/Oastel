import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb" // (we’ll create this below)
import { compare } from "bcryptjs"
import UserModel from "@/models/User" // your mongoose user model

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await UserModel.findOne({ email: credentials?.email })
        if (!user) throw new Error("No user found")
        const isValid = await compare(credentials!.password, user.password)
        if (!isValid) throw new Error("Invalid password")
        return user
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
})

export { handler as GET, handler as POST }
