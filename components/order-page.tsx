"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { products, categories } from "@/lib/products"
import { ProductCard, FloatingCartButton } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"

export function OrderPage() {
  const [activeCategory, setActiveCategory] = useState<string>("cookies")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()

  const filteredProducts = products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)]/70 bg-[rgba(253,250,244,0.76)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-16 lg:px-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="萱仔甜點" width={46} height={46} className="rounded-full" />
            <span className="text-xl font-black text-[var(--ink)]">萱仔甜點</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/#menu" className="text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]">
              熱銷商品
            </a>
            <a href="/#how" className="text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]">
              訂購方式
            </a>
            <a href="/#reviews" className="text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]">
              顧客好評
            </a>
            <Button
              className="relative h-9 rounded-full bg-[var(--wood)] px-6 text-white hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)]"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="size-4" />
              購物車
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-pink)] text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button className="rounded-full p-2 text-[var(--ink)] transition hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="relative grid gap-4 overflow-hidden border-t border-[var(--line)]/70 bg-[rgba(253,250,244,0.82)] px-5 pb-8 pt-5 backdrop-blur-xl md:hidden">
            <a href="/#menu" className="transition hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]" onClick={() => setIsMenuOpen(false)}>熱銷商品</a>
            <a href="/#how" className="transition hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]" onClick={() => setIsMenuOpen(false)}>訂購方式</a>
            <a href="/#reviews" className="transition hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]" onClick={() => setIsMenuOpen(false)}>顧客好評</a>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 border-t border-[var(--wood)]/24 bg-gradient-to-r from-[var(--wood)]/50 via-[var(--wood)]/78 to-[var(--wood)]/50 shadow-[0_-8px_18px_rgba(117,88,58,0.08)]">
              <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <span className="absolute inset-x-14 top-1.5 h-px bg-gradient-to-r from-transparent via-[var(--cream)]/45 to-transparent" />
              <span className="absolute left-1/2 top-0.5 h-1 w-12 -translate-x-1/2 rounded-full bg-[var(--cream)]/72 shadow-[0_0_0_1px_rgba(117,88,58,0.16)]" />
              <span className="absolute left-8 top-1.5 h-px w-10 bg-gradient-to-r from-transparent to-white/55" />
              <span className="absolute right-8 top-1.5 h-px w-10 bg-gradient-to-l from-transparent to-white/55" />
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">立即訂購</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            選擇您喜歡的甜點，我們會用心為您製作
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`flex-shrink-0 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">此分類目前沒有商品</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  )
}
