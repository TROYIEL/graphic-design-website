"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"

export function ContactSection() {
  const whatsappNumber = "256751642598"

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleWhatsAppSend = () => {
    setLoading(true)

    const fullMessage = `
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
    `.trim()

    const encodedMessage = encodeURIComponent(fullMessage)

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank",
      "noopener,noreferrer"
    )

    setLoading(false)
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-foreground/60">
            Ready to transform your brand? Let's talk.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Mail className="mx-auto mb-3 text-primary" />
              <a href="mailto:najunatroy@gmail.com" className="text-primary">
                najunatroy@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Phone className="mx-auto mb-3 text-primary" />
              <p>+256 751 642598 | +256 779 100841</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-8">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleWhatsAppSend()
                }}
              >
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <textarea
                  rows={5}
                  placeholder="Tell us about your project"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary"
                >
                  {loading ? "Sending..." : "Send "}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
