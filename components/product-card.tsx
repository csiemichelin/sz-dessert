"use client"

import Image from "next/image"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity || 0

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all hover:shadow-lg hover:border-primary/30">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {product.badge}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">
            NT${product.price}
          </span>
          {quantity === 0 ? (
            <Button
              onClick={() => addItem(product)}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-1" />
              加入
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function FloatingCartButton() {
  const { totalItems, setIsCartOpen } = useCart()

  if (totalItems === 0) return null

  return (
    <Button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
      size="icon"
    >
      <ShoppingBag className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
        {totalItems}
      </span>
    </Button>
  )
}
