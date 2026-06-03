"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { PROJECTS } from "@/lib/constants"

const INTERVAL_MS = 5000

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0, scale: 0.96 }),
}

const metaVariants = {
  hidden: { y: 28, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.07 + 0.15, duration: 0.45, ease: "easeOut" as const },
  }),
}

export default function ProjectShowcase() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = (index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
    setProgress(0)
  }

  const next = () => goTo((current + 1) % PROJECTS.length, 1)
  const prev = () => goTo((current - 1 + PROJECTS.length) % PROJECTS.length, -1)

  useEffect(() => {
    if (paused) return
    setProgress(0)
    const start = Date.now()

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / INTERVAL_MS) * 100, 100))
    }, 40)

    const slideTimer = setTimeout(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % PROJECTS.length)
      setProgress(0)
    }, INTERVAL_MS)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(slideTimer)
    }
  }, [current, paused])

  const project = PROJECTS[current]

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden bg-zinc-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={project.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <Image
              src={`/${project.image}`}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Category chip */}
            <motion.div
              custom={0}
              variants={metaVariants}
              initial="hidden"
              animate="visible"
              className="absolute top-5 left-5 flex flex-wrap gap-1"
            >
              {project.category.split(",").slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 backdrop-blur-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </motion.div>

            {/* Bottom metadata */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10">
              <motion.h3
                custom={0}
                variants={metaVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl font-black text-white leading-tight mb-1"
              >
                {project.title}
              </motion.h3>

              <motion.p
                custom={1}
                variants={metaVariants}
                initial="hidden"
                animate="visible"
                className="text-sm text-gray-300 leading-relaxed mb-4 max-w-xs"
              >
                {project.description}
              </motion.p>

              <motion.a
                custom={2}
                variants={metaVariants}
                initial="hidden"
                animate="visible"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-orange-500/30 hover:border-orange-500/40 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Project <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next buttons */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-orange-500/30 hover:border-orange-500/40 transition-all"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-orange-500/30 hover:border-orange-500/40 transition-all"
          aria-label="Next project"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 h-1.5 bg-orange-500"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0 }}
        />
      </div>
    </div>
  )
}
