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
      <div className="flex h-screen flex-col sm:h-screen lg:h-auto min-[2000px]:!h-screen">
        <Header />
        <div className="mt-16 flex h-[calc(100vh-4rem)] min-h-0 flex-none flex-col lg:mt-0 lg:h-auto min-[2000px]:!mt-16 min-[2000px]:!h-[calc(100vh-4rem)] min-[2000px]:!min-h-0 min-[2000px]:!flex-none">
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
