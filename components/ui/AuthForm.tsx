"use client"
import { useState } from "react"
import GoogleBtn from "./GoogleBtn"
import GreenBtn from "./GreenBtn"
import { signIn } from "next-auth/react"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import useSession from "@/hooks/SessionHook"

type Props = {
    isLogin: boolean
}

export default function AuthForm({ isLogin }: Props) {
    const router = useRouter()
    const { showToast } = useToast()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useSession();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!isLogin) {
                // Sign up logic
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || "Error signing up")
                }

                // After successful signup, log the user in
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (result?.error) {
                    throw new Error(result.error)
                }

                showToast({
                    type: "success",
                    title: "Success",
                    message: `Account created, logged in as ${user?.name || "guest"}!`,
                })
                router.push("/")
            } else {
                // Login logic
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (result?.error) {
                    throw new Error(result.error)
                }

                showToast({
                    type: "success",
                    title: "Success",
                    message: "Logged in successfully!",
                })
                router.push("/")
            }
        } catch (error: any) {
            showToast({
                type: "error",
                title: "Error",
                message: error.message || "An error occurred. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border rounded px-4 py-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            )}
            <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-4 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
            />

            <button
                type="submit"
                disabled={isLoading}
                className={`bg-primary_green text-white text-xl px-4 py-3 rounded-md font-poppins w-full ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {isLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </button>

            <div className="flex items-center my-4">
                <hr className="flex-1" />
                <span className="mx-2 text-gray-400">or</span>
                <hr className="flex-1" />
            </div>

            <GoogleBtn />
        </form>
    )
}
