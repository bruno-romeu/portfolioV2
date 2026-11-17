import { MotionConfig } from 'motion/react'
import Navbar from './components/ui/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ChatWidget } from './components/ChatWidget'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-black">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </MotionConfig>
  )
}

export default App
