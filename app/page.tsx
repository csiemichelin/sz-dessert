import {
  Header,
  HeroSection,
  HeroWoodSection,
  MenuSection,
  ContactSection,
  ReviewsSection,
  Footer,
} from "@/components/sections"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <HeroWoodSection />
      <MenuSection />
      <ContactSection />
      <ReviewsSection />
      <Footer />
    </main>
  )
}
