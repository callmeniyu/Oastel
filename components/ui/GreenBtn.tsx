"use client"

import { useRouter } from "next/navigation"

type GreenBtnProps = {
    customStyles?: string
    action?: string
    text: string
    onClick?: () => void
}
const GreenBtn = ({ customStyles, action, text, onClick }: GreenBtnProps) => {
    const router = useRouter()


    const handleClick = () => {
        if (onClick) {
            onClick()
            return
        }
        if (action) {
            router.push(`${action}`)
        }
    }
    return (
        <button
            onClick={handleClick}
            className={`bg-primary_green text-white text-sm px-4 py-2 rounded-md font-poppins ${customStyles} `}
        >
            {text}
        </button>
    )
}

export default GreenBtn
