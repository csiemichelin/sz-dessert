"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import type { IceLevel, SweetnessLevel } from "@/lib/cart-context"
import type { Product } from "@/lib/products"

const iceLevels: IceLevel[] = ["正常冰", "少冰", "微冰", "去冰"]
const sweetnessLevels: Exclude<SweetnessLevel, "固定甜度">[] = ["全糖", "少糖", "半糖", "微糖", "無糖"]

interface ProductCardProps {
  product: Product
  isFirst?: boolean
  isLast?: boolean
}

export function ProductCard({ product, isFirst = false, isLast = false }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [iceLevel, setIceLevel] = useState<IceLevel>("正常冰")
  const [sweetness, setSweetness] = useState<Exclude<SweetnessLevel, "固定甜度">>("全糖")
  const { addItem } = useCart()
  const isDrink = product.category === "drinks"
  const canAdjustIce = isDrink && product.temperature === "iced"
  const canAdjustSweetness = isDrink && product.sweetnessMode === "adjustable"
  const edgeClassName = [
    isFirst ? "md:-mt-5 md:pt-5 lg:-mt-7 lg:pt-6" : "",
    isLast ? "md:-mb-5 md:pb-5 lg:-mb-7 lg:pb-6" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsAdded(false)
          setIsOpen(true)
        }}
        className={`group relative z-10 -my-2 flex min-h-24 w-full items-center justify-between gap-2 bg-transparent px-3 py-5 text-left transition hover:bg-[var(--cream)]/70 active:bg-[var(--cream)]/70 md:bg-white/82 md:gap-3 md:px-4 md:py-3 lg:min-h-32 lg:px-7 lg:py-3 ${edgeClassName}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5 md:gap-3 lg:gap-5">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-[6px] bg-[var(--cream)] md:size-20 lg:size-28 lg:rounded-[8px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105 group-active:scale-105"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-3">
              <span className="min-w-0 text-base font-black leading-6 text-[var(--ink)] lg:text-xl lg:leading-7">{product.name}</span>
              <span className="shrink-0 text-base font-black text-[var(--wood)] lg:text-xl">NT${product.price}</span>
            </span>
            <span className="font-peak mt-2 block text-sm leading-6 text-[var(--muted-text)] lg:mt-3 lg:text-base lg:leading-7">
              {product.description}
            </span>
          </span>
        </span>
      </button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setIsAdded(false)
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-3.5rem)] gap-0 overflow-y-auto rounded-[8px] border border-[var(--line)] bg-[var(--cream)] p-0 shadow-[0_24px_70px_rgba(75,61,45,0.22)] sm:max-w-[420px] lg:max-w-[560px]"
        >
          <div className="relative px-5 pb-5 pt-6 text-center">
            <DialogTitle className="text-2xl font-black tracking-[0.08em] text-[var(--wood-dark)]">
              {product.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {product.name} 商品圖片與加入購物車
            </DialogDescription>
            <p className="font-peak mx-auto mt-3 max-w-[18rem] text-base leading-7 text-[var(--muted-text)]">
              {product.description}
            </p>
            <DialogClose className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-[var(--muted-text)] shadow-[0_4px_14px_rgba(75,61,45,0.12)] transition hover:bg-[var(--soft-pink)] hover:text-[var(--ink)] active:bg-[var(--soft-pink)]">
              <X className="size-5" />
              <span className="sr-only">關閉</span>
            </DialogClose>
          </div>

          <div className="px-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {isDrink && (
            <div className="grid gap-4 px-4 pt-5">
              <div>
                <p className="mb-2 text-sm font-black text-[var(--wood)]">冰塊</p>
                {canAdjustIce ? (
                  <div className="grid grid-cols-4 gap-2">
                    {iceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setIceLevel(level)}
                        className={`rounded-[4px] border px-2 py-2 text-sm font-bold transition ${
                          iceLevel === level
                            ? "border-[var(--wood)] bg-[var(--wood)] text-white"
                            : "border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-[4px] border border-[var(--line)] bg-white px-3 py-2 text-sm font-bold text-[var(--muted-text)]">
                    熱飲
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-black text-[var(--wood)]">甜度</p>
                {canAdjustSweetness ? (
                  <div className="grid grid-cols-5 gap-2">
                    {sweetnessLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSweetness(level)}
                        className={`rounded-[4px] border px-2 py-2 text-sm font-bold transition ${
                          sweetness === level
                            ? "border-[var(--wood)] bg-[var(--wood)] text-white"
                            : "border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-[4px] border border-[var(--line)] bg-white px-3 py-2 text-sm font-bold text-[var(--muted-text)]">
                    固定甜度
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] px-4 py-4">
            <span className="text-2xl font-black text-[var(--wood)]">NT${product.price}</span>
            <Button
              onClick={() => {
                addItem(
                  product,
                  isDrink
                    ? {
                        iceLevel: canAdjustIce ? iceLevel : undefined,
                        sweetness: canAdjustSweetness ? sweetness : "固定甜度",
                      }
                    : undefined,
                )
                setIsAdded(true)
                window.setTimeout(() => setIsOpen(false), 420)
              }}
              className={`h-11 rounded-[4px] px-5 text-white transition ${
                isAdded
                  ? "bg-[var(--wood)]"
                  : "bg-[var(--wood-dark)] hover:bg-[var(--wood)] active:bg-[var(--wood)]"
              }`}
            >
              <ShoppingCart className="size-4" />
              {isAdded ? "已加入" : "加入購物車"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function FloatingCartButton() {
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <Button
      onClick={() => setIsCartOpen(true)}
      className="floating-cart-wiggle fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[var(--wood)] text-white shadow-[0_16px_36px_rgba(75,61,45,0.24)] hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)] md:hidden"
      size="icon"
      aria-label="開啟購物車"
    >
      <ShoppingCart className="size-6" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--brand-pink)] px-1.5 text-sm font-bold text-white shadow-[0_6px_14px_rgba(217,138,158,0.28)]">
          {totalItems}
        </span>
      )}
    </Button>
  )
}
