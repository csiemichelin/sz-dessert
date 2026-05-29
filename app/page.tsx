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
      <div className="flex h-screen flex-col sm:h-auto 2xl:h-screen">
        <Header />
        <div className="flex flex-1 flex-col sm:flex-none 2xl:min-h-0 2xl:flex-1">
          <HeroSection />
          <HeroWoodSection />
        </div>
      </div>
      <MenuSection />
      <ContactSection />
      <ReviewsSection />
      <Footer />
    </main>
  )
}
