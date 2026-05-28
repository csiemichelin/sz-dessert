"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { products, categories } from "@/lib/products"
import { ProductCard, FloatingCartButton } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"

export function OrderPage() {
  const [activeCategory, setActiveCategory] = useState<string>("cookies")
  const { totalItems, setIsCartOpen } = useCart()

  const filteredProducts = products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="萱仔甜點" width={40} height={40} className="rounded-full" />
            <span className="font-bold text-lg text-foreground hidden sm:block">萱仔甜點</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              首頁
            </Link>
            <Link href="/order" className="text-primary font-medium">
              立即訂購
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="ml-2 hidden sm:inline">購物車</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg hover:text-primary transition-colors">
                    首頁
                  </Link>
                  <Link href="/order" className="text-lg text-primary font-medium">
                    立即訂購
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
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
