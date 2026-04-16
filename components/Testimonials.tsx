"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ayushman Sahu",
    role: "CEO & Founder",
    company: "Royal IT Services",
    content: "Exceptional work on our IT infrastructure. The service delivered exceeded our expectations by providing a modern, scalable architectures. Highly recommend for any enterprise-level projects and consultancy needs.",
    rating: 5,
  },
  {
    id: "2",
    name: "Azra Khan",
    role: "Owener & Manager",
    company: "Zayka Darbar",
    content: "The restaurant management system transformed our business operations. Real-time order tracking and the admin dashboard have significantly improved our efficiency. Outstanding quality!",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Shahnawaz Qureshi",
    role: "Owener & Manager",
    company: "SS Security Services",
    content: "Professional, reliable, and innovative. The security management platform has streamlined our entire workflow. The attention to detail and commitment to quality is remarkable.",
    rating: 5,
  },
//   {
//     id: "4",
//     name: "Fatima Ansari",
//     role: "Business Owner",
//     company: "Tech Startup",
//     content: "Working with Aaqil was a game-changer for our startup. The technical expertise combined with understanding of business needs resulted in a product that our users love.",
//     rating: 5,
//   },
//   {
//     id: "5",
//     name: "Rashid Malik",
//     role: "Product Manager",
//     company: "E-commerce Platform",
//     content: "Delivered a complex e-commerce solution on time and within budget. The code quality and documentation were top-notch. Will definitely collaborate again.",
//     rating: 5,
//   },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setIsAutoPlaying(false)
    setActiveIndex(index)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="hidden sm:block w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Client Stories
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            What our partners say about working together
          </p>
        </motion.div>

        <motion.div style={{ y, willChange: "transform" }} className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl p-8 md:p-12 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-20">
                  <Quote className="w-16 h-16 text-orange-400" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(Math.floor(testimonials[activeIndex].rating))].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                  {testimonials[activeIndex].rating % 1 !== 0 && (
                    <motion.div
                      key="half"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.floor(testimonials[activeIndex].rating) * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
                    </motion.div>
                  )}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  "{testimonials[activeIndex].content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(testimonials[activeIndex].name)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
              <motion.button
                onClick={prevTestimonial}
                className="w-12 h-12 -ml-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white pointer-events-auto transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                className="w-12 h-12 -mr-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white pointer-events-auto transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-orange-400 w-8"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`text-xs px-4 py-1 rounded-full transition-all duration-200 ${
                isAutoPlaying
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-white/5 text-gray-500 border border-white/10"
              }`}
            >
              {isAutoPlaying ? "Auto-playing" : "Paused"}
            </button>
          </div>
        </motion.div>

        {/* Testimonial Mini Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              className={`p-4 rounded-xl text-left transition-all duration-300 ${
                index === activeIndex
                  ? "bg-orange-500/20 border border-orange-500/30"
                  : "bg-white/3 border border-white/5 hover:bg-white/5"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === activeIndex
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-gray-400"
                }`}>
                  {getInitials(testimonial.name)}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(Math.min(3, Math.floor(testimonial.rating)))].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${
                      index === activeIndex
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-600 text-gray-600"
                    }`} />
                  ))}
                </div>
              </div>
              <p className={`text-xs font-medium truncate ${
                index === activeIndex ? "text-white" : "text-gray-400"
              }`}>
                {testimonial.name}
              </p>
              <p className={`text-xs truncate ${
                index === activeIndex ? "text-orange-300" : "text-gray-500"
              }`}>
                {testimonial.company}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
