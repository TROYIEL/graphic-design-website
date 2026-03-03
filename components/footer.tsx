"use client"

import type { MouseEvent } from "react"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const scrollToSection = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    })
  }

  return (
    <footer className="bg-foreground/5 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold"> T</span>
              </div>
              <span className="font-bold">TEX-TECH</span>
            </div>
            <p className="text-foreground/60 text-sm">YOUR ONE TECH SOLUTION</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <Link href="#about" onClick={scrollToSection("about")} className="hover:text-primary transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="#services" onClick={scrollToSection("services")} className="hover:text-primary transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#portfolio" onClick={scrollToSection("portfolio")} className="hover:text-primary transition">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#contact" onClick={scrollToSection("contact")} className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <a href="#services" onClick={scrollToSection("services")} className="hover:text-primary transition">
                  Branding
                </a>
              </li>
              <li>
                <a href="#services" onClick={scrollToSection("services")} className="hover:text-primary transition">
                  Design
                </a>
              </li>
              <li>
                <a href="#services" onClick={scrollToSection("services")} className="hover:text-primary transition">
                  Motion Graphics
                </a>
              </li>
              <li>
                <a href="#services" onClick={scrollToSection("services")} className="hover:text-primary transition">
                  UI/Web
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/60">
          <p>&copy; {currentYear} TEX-TECH. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
