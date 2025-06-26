"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/aaqil", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/aaqil", label: "LinkedIn" },
    { icon: Mail, href: "mailto:aaqilpro99@gmail.com", label: "Email" },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <motion.h3
              className="text-3xl font-black text-white mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              whileHover={{ scale: 1.05 }}
            >
              Solutions with <span className="text-orange-400">AAQIL</span>
            </motion.h3>
            <p className="text-gray-400 flex items-center justify-center md:justify-start">
              Built with <Heart className="w-4 h-4 text-red-500 mx-1" /> and cutting-edge technology
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/3 dark:bg-black/20 hover:bg-orange-500/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
                  whileHover={{ scale: 1.2, y: -3, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-gray-400 hover:text-orange-400 transition-colors duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Scroll to top button */}
            <motion.button
              onClick={scrollToTop}
              className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Solutions with Aaqil. All rights reserved. |
            <span className="text-orange-400 ml-1">Crafting the future, one line of code at a time.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
