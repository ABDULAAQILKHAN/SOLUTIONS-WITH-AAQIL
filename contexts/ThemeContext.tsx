"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, forceTheme }: { children: React.ReactNode, forceTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(forceTheme || "dark")

  useEffect(() => {
    if (forceTheme) {
      setTheme(forceTheme)
      return
    }
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme("light")
    }
  }, [forceTheme])

  useEffect(() => {
    if (!forceTheme) {
      localStorage.setItem("theme", theme)
    }
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme, forceTheme])

  const toggleTheme = () => {
    if (forceTheme) return // disabled when forced
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
