"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"
import { useRef } from "react"

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        style={{ y, opacity, willChange: "transform, opacity" }}
        className="container mx-auto px-4 text-center z-10"
      >
        {/* Professional glassmorphism container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl p-12 shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <Sparkles className="w-8 h-8 text-orange-400 mr-3" />
            <span className="text-orange-400 font-semibold text-lg tracking-wide">Building the Next Generation of Secure, Intelligent Apps</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontFamily: "'Orbitron', 'Inter', sans-serif" }}
          >
            SOLUTIONS WITH{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
              AAQIL
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Crafting enterprise-grade digital experiences with precision, security, and scalability.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
               onClick={() => scrollToSection('contact')}
               className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300"
            >
              Start specific Project
            </button>
            
            <div className="relative group">
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-white/10 backdrop-blur-md border border-orange-500/30 text-orange-300 text-xs px-3 py-1 rounded-full text-center">
                 One Account. All Projects.
                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-orange-500/30"></div>
              </div>
              <a
                 href="/signup"
                 className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Explore Projects <Sparkles className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8 text-orange-400" />
      </motion.div>
    </section>
  )
}
