// src/app/page.tsx
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { Pricing } from '@/components/Pricing'
import { Footer } from '@/components/Footer'
// import { ThemeDebugger } from '@/components/ThemeDebugger'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
      {/* <ThemeDebugger /> */}
    </main>
  )
}