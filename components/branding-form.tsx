"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

const formSteps = [
  {
    title: "Basic Information",
    fields: ["fullName", "company", "email", "phone"],
  },
  {
    title: "Brand Details",
    fields: ["industry", "brandGoals", "targetAudience"],
  },
  {
    title: "Design Preferences",
    fields: ["stylePreference", "brandColors"],
  },
  {
    title: "Additional Notes",
    fields: ["notes"],
  },
]

export function BrandingForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    industry: "",
    brandGoals: "",
    targetAudience: "",
    stylePreference: "Modern",
    brandColors: "",
    budget: "Not specified",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    const currentFields = formSteps[step].fields
    const allFilled = currentFields.every((field) => formData[field as keyof typeof formData]?.toString().trim() !== "")

    if (!allFilled) {
      setError("Please fill in all required fields")
      return
    }

    setError("")
    if (step < formSteps.length - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setError("")
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const generatePDF = async (data: typeof formData) => {
    // Create a simple PDF content as text
    const content = `
BRANDING DISCOVERY FORM SUBMISSION
==================================

BASIC INFORMATION
Full Name: ${data.fullName}
Company/Brand Name: ${data.company}
Email: ${data.email}
Phone: ${data.phone}

BRAND DETAILS
Industry/Niche: ${data.industry}
Brand Goals: ${data.brandGoals}
Target Audience: ${data.targetAudience}

DESIGN PREFERENCES
Design Style: ${data.stylePreference}
Brand Colors: ${data.brandColors || "Not specified"}

ADDITIONAL NOTES
${data.notes || "No additional notes"}

==================================
Thank you for your submission!
We'll be in touch shortly.
    `

    return content
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate PDF content
      const pdfContent = await generatePDF(formData)

      // Create a data URL for WhatsApp
      const message = `Hi! I've submitted my branding discovery form. Here are my details:\n\n${pdfContent}`
      const encodedMessage = encodeURIComponent(message)

      // Open WhatsApp with the message using international format (no + or spaces)
      const whatsappNumber = "256751642598"
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank", "noopener,noreferrer")

      setSubmitted(true)
      setStep(0)
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        industry: "",
        brandGoals: "",
        targetAudience: "",
        stylePreference: "Modern",
        brandColors: "",
        budget: "Not specified",
        notes: "",
      })

      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch {
      setError("Failed to process submission. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="branding-form" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitted ? (
          <div className="mb-8">
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Success! Your branding details have been sent.
                    </h3>
                    <p className="text-green-800 dark:text-green-200">
                      We'll review your submission and contact you shortly via WhatsApp or email.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3 text-center">Branding Discovery Form</h2>
          <p className="text-lg text-foreground/60 text-center mb-8">
            Tell us about your brand vision so we can create the perfect design strategy
          </p>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8 justify-center">
            {formSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${index <= step ? "bg-primary w-8" : "bg-border w-8"}`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{formSteps[step].title}</CardTitle>
            <CardDescription>
              Step {step + 1} of {formSteps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Info */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company / Brand Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Brand Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry / Niche *</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Tech, Fashion, Healthcare"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand Goals *</label>
                    <textarea
                      name="brandGoals"
                      value={formData.brandGoals}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="What do you want your brand to achieve?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience *</label>
                    <input
                      type="text"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Describe your target audience"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Design Preferences */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Design Style Preference *</label>
                    <select
                      name="stylePreference"
                      value={formData.stylePreference}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Modern</option>
                      <option>Minimal</option>
                      <option>Bold</option>
                      <option>Corporate</option>
                      <option>Creative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand Colors (Optional)</label>
                    <input
                      type="text"
                      name="brandColors"
                      value={formData.brandColors}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Blue, Orange, Green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range *</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Not specified</option>
                      <option>$500 - $2,000</option>
                      <option>$2,000 - $5,000</option>
                      <option>$5,000 - $10,000</option>
                      <option>$10,000+</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Notes */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Any additional information or specific requests?"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-4 pt-6">
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                    Back
                  </Button>
                )}
                {step < formSteps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {loading ? "Sending..." : "Send via WhatsApp"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
