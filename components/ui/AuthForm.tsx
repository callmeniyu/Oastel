"use client"
import { useState } from "react"
import GoogleBtn from "./GoogleBtn"
import GreenBtn from "./GreenBtn"

type Props = {
    isLogin: boolean
}

export default function AuthForm({ isLogin }: Props) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: integrate with NextAuth handler
        console.log({ email, password, type: isLogin ? "login" : "signup" })
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
            />

        {/* w-full bg-primary_green text-white py-2 rounded hover:bg-green-700 transition */}
            <GreenBtn text={isLogin ? "Login" : "Sign Up"} customStyles="w-full py-3 text-xl font-poppins" onClick={()=>{}}/>

            <div className="flex items-center my-4">
                <hr className="flex-1" />
                <span className="mx-2 text-gray-400">or</span>
                <hr className="flex-1" />
            </div>

            <GoogleBtn />
        </form>
    )
}
