"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import SpaceBackground from "./SpaceBackground"
import ArticleNav from "./ArticleNav"
import Footer from "./Footer"

interface ArticleLayoutProps {
  children: React.ReactNode
  showBack?: boolean
}

export default function ArticleLayout({ children, showBack = false }: ArticleLayoutProps) {
  return (
    <ThemeProvider>
      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{ fontFamily: "'Inter', 'Space Grotesk', sans-serif" }}
      >
        <SpaceBackground />

        <div className="relative z-10">
          <ArticleNav showBack={showBack} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}
