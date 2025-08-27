import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeatureSection from './components/FeatureSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/Services'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <ServicesSection />
    </>
  )
}

export default App
