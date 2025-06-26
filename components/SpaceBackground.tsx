"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTheme } from "../contexts/ThemeContext"

export default function SpaceBackground() {
  const { theme } = useTheme()
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number; opacity: number }>
  >([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      // Reduced from 200 to 100 for better performance
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.8 + 0.2,
        })
      }
      setStars(newStars)
    }
    generateStars()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Beautiful purple space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 dark:from-black dark:via-purple-950 dark:to-slate-950" />

      {/* Optimized stars with will-change */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            willChange: "opacity, transform",
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Optimized Sun (Light Mode) */}
      {theme === "light" && (
        <motion.div
          className="absolute top-8 right-8 w-56 h-56"
          style={{ willChange: "transform" }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Sun core with realistic layers */}
          <div
            className="w-full h-full rounded-full relative"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #FFEB3B 0%, #FFC107 15%, #FF9800 35%, #FF6F00 60%, #E65100 85%, #BF360C 100%)",
              boxShadow:
                "0 0 120px rgba(255, 193, 7, 0.6), 0 0 200px rgba(255, 152, 0, 0.4), 0 0 300px rgba(255, 111, 0, 0.2)",
            }}
          >
            {/* Simplified sun rays - reduced from 16 to 8 */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-t from-orange-300 via-yellow-300 to-transparent opacity-70"
                style={{
                  width: "1px",
                  height: "50px",
                  left: "50%",
                  top: "-3rem",
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${i * 45}deg)`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  scaleY: [0.8, 1.2, 0.8],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Optimized Moon (Dark Mode) */}
      {theme === "dark" && (
        <motion.div
          className="absolute top-8 right-8 w-56 h-56"
          style={{ willChange: "transform" }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 120,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Moon core with realistic surface */}
          <div
            className="w-full h-full rounded-full relative"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #F8F8F8 0%, #E0E0E0 25%, #BDBDBD 50%, #9E9E9E 75%, #757575 100%)",
              boxShadow: "0 0 60px rgba(245, 245, 245, 0.15), inset -25px -25px 50px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Static craters for better performance */}
            <div className="absolute top-8 left-12 w-8 h-8 rounded-full bg-gray-500 opacity-70" />
            <div className="absolute top-16 right-14 w-6 h-6 rounded-full bg-gray-500 opacity-60" />
            <div className="absolute bottom-12 left-16 w-4 h-4 rounded-full bg-gray-500 opacity-50" />
            <div className="absolute bottom-16 right-10 w-10 h-10 rounded-full bg-gray-500 opacity-65" />
            <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-gray-500 opacity-45" />
            <div className="absolute bottom-20 left-8 w-5 h-5 rounded-full bg-gray-500 opacity-55" />
          </div>
        </motion.div>
      )}

      {/* Simplified floating planets */}
      <motion.div
        className="absolute top-1/3 left-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
        style={{ willChange: "transform" }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600"
        style={{ willChange: "transform" }}
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
