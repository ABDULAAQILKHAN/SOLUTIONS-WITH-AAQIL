"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

interface ArticleNavProps {
  showBack?: boolean
}

export default function ArticleNav({ showBack = false }: ArticleNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 w-full bg-white/5 dark:bg-black/30 backdrop-blur-2xl border-b border-white/10 dark:border-white/5"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link
              href="/articles"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Link>
          )}
          {!showBack && (
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
          )}
        </div>

        <Link
          href="/articles"
          className="flex items-center gap-2 text-white font-bold tracking-wide hover:text-orange-400 transition-colors duration-200"
          style={{ fontFamily: "'Orbitron', 'Inter', sans-serif" }}
        >
          <BookOpen className="w-4 h-4 text-orange-400" />
          Articles
        </Link>

        {/* Spacer to keep navigation balanced */}
        <div className="w-20" />
      </div>
    </motion.nav>
  )
}
