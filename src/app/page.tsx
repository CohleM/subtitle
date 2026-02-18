// src/app/page.tsx
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { Pricing } from '@/components/Pricing' // Import from components
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing isLandingPage={true} />
      <Footer />
    </main>
  )
}