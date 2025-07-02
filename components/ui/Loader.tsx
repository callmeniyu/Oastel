"use client"
import Lottie from "lottie-react"
import loadingAnimation from "@/public/images/loading_animation.json"
export default function Loader() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <Lottie loop animationData={loadingAnimation} className="w-40 h-40 mx-auto" />
        </div>
    )
}
