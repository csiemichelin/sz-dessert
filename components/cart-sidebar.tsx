"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart-context"

export function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-[74vw] max-w-[320px] flex-col border-l border-[var(--line)] bg-[var(--cream)] p-0 sm:w-full sm:max-w-md [&>button]:hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>
            <ShoppingBag className="w-5 h-5" />
            購物車
          </SheetTitle>
        </SheetHeader>
        <div className="flex items-start justify-between px-4 pb-8 pt-5">
          <div>
            <h2 className="font-serif text-2xl font-black tracking-[0.08em] text-[var(--wood-dark)]">購物車</h2>
            <p className="mt-3 text-sm tracking-[0.16em] text-[var(--muted-text)]">
              你的購物車中共有 {totalItems} 件品項
            </p>
          </div>
          <button
            type="button"
            aria-label="關閉購物車"
            onClick={() => setIsCartOpen(false)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--muted-text)] transition hover:bg-[var(--soft-pink)] hover:text-[var(--ink)] active:bg-[var(--soft-pink)]"
          >
            <X className="size-5" />
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-white/72">
              <ShoppingBag className="size-10 text-[var(--muted-text)]" />
            </div>
            <p className="mb-4 text-[var(--muted-text)]">購物車是空的</p>
            <Button onClick={() => setIsCartOpen(false)} variant="outline" className="rounded-[4px]">
              繼續購物
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div>
                {items.map((item) => (
                  <div key={item.product.id} className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-3 border-b border-[var(--line)]/70 bg-white/34 px-4 py-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[4px] bg-white">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-black text-[var(--ink)]">{item.product.name}</h4>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="mr-auto text-xs font-medium tracking-[0.08em] text-[var(--muted-text)]">NT${item.product.price}</p>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-[4px] border-[var(--line)] bg-white text-[var(--ink)]"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-4 text-center text-sm font-medium text-[var(--ink)]">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-[4px] border-[var(--line)] bg-white text-[var(--ink)]"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                        <button
                          type="button"
                          aria-label={`移除 ${item.product.name}`}
                          className="text-red-500 transition hover:text-red-600 active:text-red-600"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t border-[var(--line)] bg-[var(--cream)] px-4 py-4">
              <div className="mb-4 flex items-center justify-between font-serif">
                <span className="text-lg font-black text-[var(--ink)]">Total:</span>
                <span className="text-base font-black text-[var(--wood)]">NT${totalPrice}.00</span>
              </div>
              <div className="grid gap-2">
                <Button asChild className="h-10 w-full rounded-[4px] bg-[var(--wood-dark)] text-white hover:bg-[var(--wood)] active:bg-[var(--wood)]">
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                    線上點餐
                  </Link>
                </Button>
                <Button variant="outline" className="h-10 w-full rounded-[4px] border-[var(--line)] bg-white text-[var(--ink)]" onClick={clearCart}>
                  清空購物車
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
