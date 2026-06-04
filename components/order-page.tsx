"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Coffee, Cookie, Gift, Menu, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { products, categories } from "@/lib/products"
import { ProductCard, FloatingCartButton } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/sections"

const categoryIcons = {
  cookies: Cookie,
  drinks: Coffee,
  "gift-box": Gift,
}
const PRODUCTS_PER_PAGE = 5

export function OrderPage() {
  const [activeCategory, setActiveCategory] = useState<string>("cookies")
  const [page, setPage] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()

  const filteredProducts = products.filter((p) => p.category === activeCategory)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const pagedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  )
  const ActiveCategoryIcon = categoryIcons[activeCategory]

  return (
    <div className="flex min-h-screen flex-col bg-background pt-16">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)]/70 bg-[rgba(253,250,244,0.76)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-16 lg:max-w-7xl lg:px-5">
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
            <Button
              className="mt-1 rounded-full bg-[var(--wood)] text-white hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)]"
              onClick={() => {
                setIsMenuOpen(false)
                setIsCartOpen(true)
              }}
            >
              去買單 ({totalItems})
            </Button>
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
      <section className="wood-grain-light wood-grain-c wood-grain-faded bg-[var(--light-wood)] px-5 py-12 md:px-16 lg:px-5">
        <div className="mx-auto max-w-6xl text-center lg:max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">立即訂購</h1>
          <p className="font-peak text-muted-foreground max-w-md mx-auto">
            挑選喜愛的甜點，讓幸福從第一口開始
          </p>
          <div className="mx-auto mt-6 flex w-full max-w-[360px] flex-wrap justify-center gap-3 md:max-w-none">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id]
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={activeCategory === category.id}
                  className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                    activeCategory === category.id
                      ? "bg-[var(--wood)] text-white"
                      : "bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setPage(1)
                  }}
                >
                  <Icon className="size-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative flex-1 overflow-hidden bg-white px-9 py-20 md:px-16 lg:px-5">
        <div className="terrazzo pointer-events-none absolute inset-0 z-0 opacity-35" />
        <Image
          src="/images/cookie_1.png"
          alt=""
          width={300}
          height={300}
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-14 z-0 w-72 rotate-[14deg] opacity-90 md:-right-28 md:-top-24 md:w-[28rem] lg:-right-48 lg:-top-40 lg:w-[52rem]"
        />
        <Image
          src="/images/cookie_2.png"
          alt=""
          width={300}
          height={300}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -left-16 z-0 w-72 rotate-[-14deg] opacity-90 md:-bottom-14 md:-left-28 md:w-[28rem] lg:-bottom-28 lg:-left-56 lg:w-[52rem]"
        />

        {/* Products Grid */}
        <main className="relative z-10 mx-auto max-w-3xl lg:max-w-7xl">
          <div className="grid grid-cols-1 bg-transparent md:hidden">
            {filteredProducts.map((product, index) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  isFirst={index === 0}
                  isLast={index === filteredProducts.length - 1}
                />
                {index < filteredProducts.length - 1 && (
                  <div aria-hidden="true" className="relative z-20 flex items-center gap-3 py-1 md:py-0">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--wood)]/30 to-[var(--wood)]/55" />
                    <span className="relative z-30 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/58 text-[var(--wood)] backdrop-blur-[1px] shadow-[0_0_0_2px_rgba(255,255,255,0.32)]">
                      <ActiveCategoryIcon className="size-4" />
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[var(--wood)]/55 via-[var(--wood)]/30 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-1 bg-white/82 md:grid md:overflow-hidden md:rounded-[8px] md:border md:border-[var(--line)] md:py-5 lg:py-7">
            {pagedProducts.map((product, index) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  isFirst={index === 0}
                  isLast={index === pagedProducts.length - 1}
                />
                {index < pagedProducts.length - 1 && (
                  <div aria-hidden="true" className="relative z-20 flex items-center gap-3 py-1 md:py-0">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--wood)]/30 to-[var(--wood)]/55" />
                    <span className="relative z-30 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/58 text-[var(--wood)] backdrop-blur-[1px] shadow-[0_0_0_2px_rgba(255,255,255,0.32)]">
                      <ActiveCategoryIcon className="size-4" />
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[var(--wood)]/55 via-[var(--wood)]/30 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="mt-10 hidden items-center justify-center gap-4 md:flex">
              <button
                type="button"
                aria-label="前一頁"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="group flex size-14 items-center justify-center rounded-full border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(75,61,45,0.10)] transition hover:border-[var(--wood)] hover:bg-[var(--wood)] active:border-[var(--wood)] active:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--ink)] transition group-hover:text-white group-active:text-white">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="下一頁"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="group flex size-14 items-center justify-center rounded-full border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(75,61,45,0.10)] transition hover:border-[var(--wood)] hover:bg-[var(--wood)] active:border-[var(--wood)] active:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--ink)] transition group-hover:text-white group-active:text-white">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="font-peak text-muted-foreground">此分類目前沒有商品</p>
            </div>
          )}
        </main>
      </section>

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Cart Sidebar */}
      <CartSidebar />
      <Footer />
    </div>
  )
}
