"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const whatsappNumber = "+256751642598" 
  const message = "Hi! I'm interested in your design services."

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}
