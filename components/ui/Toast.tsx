import { useEffect } from "react"
import { IoMdClose } from "react-icons/io"
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle } from "react-icons/fi"

type ToastType = "success" | "info" | "warning" | "error"

interface ToastProps {
  type: ToastType
  title: string
  message: string
  onClose: () => void
}

const iconMap = {
  success: <FiCheckCircle className="text-green-600 text-xl" />,
  info: <FiInfo className="text-blue-600 text-xl" />,
  warning: <FiAlertTriangle className="text-yellow-600 text-xl" />,
  error: <FiXCircle className="text-red-600 text-xl" />,
}

const bgMap = {
  success: "bg-green-50/90 border-green-500 shadow-green-200/80",
  info: "bg-blue-50/90 border-blue-500 shadow-blue-200/80",
  warning: "bg-yellow-50/90 border-yellow-500 shadow-yellow-200/80",
  error: "bg-red-50/90 border-red-500 shadow-red-200/80",
}

export default function Toast({ type, title, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4  z-[9999] bg-white border w-full max-w-md flex items-start gap-4 border-l-4 px-4 py-3 font-poppins rounded-lg shadow-md   ${bgMap[type]} z-[9999]`}
    >
      {iconMap[type]}
      <div className="">
        <p className="">{title}</p>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        <IoMdClose className="text-lg"/>
      </button>
    </div>
  )
}
