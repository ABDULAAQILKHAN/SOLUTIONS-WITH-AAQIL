"use client"

import { ThemeProvider } from "./contexts/ThemeContext"
import SpaceBackground from "./components/SpaceBackground"
import ThemeToggle from "./components/ThemeToggle"
import Hero from "./components/Hero"
import About from "./components/About"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Experience from "./components/Experience"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function App() {
  return (
    <ThemeProvider>
      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{ fontFamily: "'Inter', 'Space Grotesk', sans-serif" }}
      >
        {/* Space Background */}
        <SpaceBackground />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Main Content with Glassmorphism */}
        <div className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}
