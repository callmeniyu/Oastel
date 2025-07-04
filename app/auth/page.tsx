// app/auth/page.tsx
"use client"
import { useState } from "react"
import AuthForm from "@/components/ui/AuthForm"
import Image from "next/image"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 font-poppins">
        
        {/* Left Image Section */}
        <div className="hidden md:block">
          <Image
            src="/images/loginsignup.jpg"
            alt="Login"
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary_green mb-6 text-center md:text-left">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h2>

          <AuthForm isLogin={isLogin} />

          <p className="mt-6 text-sm text-gray-600 text-center md:text-left">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary_green font-medium ml-2 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
