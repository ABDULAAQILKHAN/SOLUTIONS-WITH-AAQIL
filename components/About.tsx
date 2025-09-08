"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Download, User, Code, Award } from "lucide-react"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const downloadResume = () => {
    const link = document.createElement("a")
    link.href = "./resume/Aaqil-khan-Resume.pdf"
    link.download = "Aaqil_Khan_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = [
    { icon: Code, label: "Projects Delivered", value: "6+" },
    { icon: Award, label: "Years Experience", value: "3+" },
    { icon: User, label: "Happy Clients", value: "15+" },
  ]

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-8">
              <User className="w-8 h-8 text-orange-400 mr-3" />
              <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                About Me
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-8">
                <p
                  className="text-lg text-gray-300 leading-relaxed mb-6"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Versatile Full-Stack Software Engineer with a pronounced aptitude for architecting and deploying
                  scalable, maintainable, and performance-optimized digital systems across both web and mobile
                  platforms. Demonstrated mastery in utilizing contemporary frameworks including React, Svelte, and
                  FastAPI.
                </p>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  With a keen emphasis on modern engineering principles, containerization, and secure deployment
                  methodologies, I excel at translating complex requirements into modular, extensible codebases through
                  agile collaboration and systematic design.
                </p>

                <motion.button
                  onClick={downloadResume}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </motion.button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div style={{ y }} className="space-y-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mr-4">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {stat.value}
                      </div>
                      <div className="text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
