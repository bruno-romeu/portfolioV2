import Navbar from './components/ui/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { ChatWidget } from './components/ChatWidget'
import './App.css'

function App() {

  return (
    <>
      <div className='bg-black'>
        <Navbar />
        <div>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <ChatWidget />
        </div>
      </div>
    </>
  )
}

export default App
