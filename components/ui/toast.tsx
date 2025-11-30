"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose?: () => void
  duration?: number
}

export function Toast({ message, type = "info", onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300) // Wait for animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500"

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg transition-all",
        bgColor,
        isVisible ? "animate-in slide-in-from-top-5" : "animate-out slide-out-to-top-5"
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(), 300)
          }}
          className="rounded-full p-1 hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

