"use client"
import { createContext, useContext, useState } from "react"
import Toast from "@/components/ui/Toast"

type ToastType = "success" | "info" | "warning" | "error"

type ToastData = {
  id: number
  type: ToastType
  title: string
  message: string
}

type ToastContextType = {
  showToast: (data: Omit<ToastData, "id">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (data: Omit<ToastData, "id">) => {
    const id = toastId++
    setToasts((prev) => [...prev, { id, ...data }])
    }
        

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 space-y-4 z-[9999]">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}
