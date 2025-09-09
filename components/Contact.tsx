"use client"

import type React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Mail, Phone, Linkedin, Github, Send, CheckCircle, MapPin } from "lucide-react"
import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const WELCOME_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID || "";

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSending, setIsSending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(false); // Reset submission status on a new attempt
    if (!validateForm()) return;

    setIsSending(true);
    setErrors({}); // Clear previous submission errors

    // 1. Parameters for the notification email (to you)
    const notificationParams = {
      from_name: formData.name,
      from_email: formData.email,
      to_email: "aaqilpro99@gmail.com", // Your recipient email
      message: formData.message,
    };

    // 2. Parameters for the welcome email (to the user)
    const welcomeParams = {
      from_name: formData.name,   // Used for the greeting, e.g., "Hi {{from_name}}"
      to_email: formData.email, // This sends the email to the person who filled out the form
    };

    try {
      // Send the first email (notification to you)
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, notificationParams, PUBLIC_KEY);

      // If the first email succeeds, send the second email (welcome message to user)
      await emailjs.send(SERVICE_ID, WELCOME_TEMPLATE_ID, welcomeParams, PUBLIC_KEY);
      
      // If both emails are sent successfully
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" }); // Clear form on success

    } catch (error) {
      console.error("EmailJS send error:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <Mail className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Let's Connect
            </h2>
          </div>
          <p className="text-xl text-gray-300">Ready to build something amazing together?</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y }}
            className="space-y-8"
          >
            <div className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Get In Touch
              </h3>
              <p
                className="text-gray-300 text-lg leading-relaxed mb-8"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                I'm always interested in hearing about new opportunities and exciting projects. Whether you have a
                question or just want to say hi, feel free to reach out!
              </p>

              <div className="space-y-6">
                <motion.a
                  href="mailto:aaqilpro99@gmail.com"
                  className="flex items-center p-4 bg-white/3 dark:bg-black/20 rounded-xl hover:bg-orange-500/10 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mr-4 group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p className="text-gray-300">aaqilkhan.work@gmail.com</p>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+918989680289"
                  className="flex items-center p-4 bg-white/3 dark:bg-black/20 rounded-xl hover:bg-orange-500/10 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mr-4 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <p className="text-gray-300">+91-8989680289</p>
                  </div>
                </motion.a>

                <motion.div
                  className="flex items-center p-4 bg-white/3 dark:bg-black/20 rounded-xl"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="text-gray-300">Indore, Madhya Pradesh, India</p>
                  </div>
                </motion.div>

                <div className="flex space-x-4 pt-4">
                  <motion.a
                    href="https://www.linkedin.com/in/aaqil-khan-b45135170"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/ABDULAAQILKHAN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="w-6 h-6 text-white" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-8"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  Message Sent!
                </h3>
                <p className="text-gray-300 mb-6">Thank you for reaching out. I'll get back to you soon!</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/3 dark:bg-black/20 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm ${
                      errors.name ? "border-red-500" : "border-white/20"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/3 dark:bg-black/20 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm ${
                      errors.email ? "border-red-500" : "border-white/20"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/3 dark:bg-black/20 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm resize-none ${
                      errors.message ? "border-red-500" : "border-white/20"
                    }`}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
