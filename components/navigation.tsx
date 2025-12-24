"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">TEX-TECH</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#about"
              className="text-foreground hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-foreground hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Services
            </Link>
            <Link
              href="#portfolio"
              className="text-foreground hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Portfolio
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="#about"
              className="block px-3 py-2 rounded hover:bg-muted"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              About
            </Link>
            <Link
              href="#services"
              className="block px-3 py-2 rounded hover:bg-muted"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Services
            </Link>
            <Link
              href="#portfolio"
              className="block px-3 py-2 rounded hover:bg-muted"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Portfolio
            </Link>
            <Link
              href="#contact"
              className="block px-3 py-2 rounded hover:bg-muted"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
