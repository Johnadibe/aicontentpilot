"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0)
  const [label, setLabel] = useState("")
  const [color, setColor] = useState("bg-gray-200")

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setLabel("")
      setColor("bg-gray-200")
      return
    }

    // Calculate password strength
    let score = 0

    // Length check
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 10

    // Character type checks
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 20
    if (/[^A-Za-z0-9]/.test(password)) score += 20

    // Variety check
    const uniqueChars = new Set(password).size
    if (uniqueChars > 4) score += 10
    if (uniqueChars > 8) score += 10

    // Cap at 100
    score = Math.min(score, 100)

    // Set strength and label
    setStrength(score)

    if (score < 40) {
      setLabel("Weak")
      setColor("bg-red-500")
    } else if (score < 70) {
      setLabel("Moderate")
      setColor("bg-yellow-500")
    } else {
      setLabel("Strong")
      setColor("bg-green-500")
    }
  }, [password])

  if (!password) return null

  return (
    <div className="space-y-1 mt-2">
      <div className="flex justify-between items-center text-xs">
        <span>Password Strength</span>
        <span
          className={`
          ${color === "bg-red-500" ? "text-red-500" : ""}
          ${color === "bg-yellow-500" ? "text-yellow-500" : ""}
          ${color === "bg-green-500" ? "text-green-500" : ""}
          font-medium
        `}
        >
          {label}
        </span>
      </div>
      <Progress value={strength} className={`h-1 ${color}`} />
    </div>
  )
}
