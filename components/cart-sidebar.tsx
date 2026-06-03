"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import type { IceLevel, SweetnessLevel } from "@/lib/cart-context"

const iceLevels: IceLevel[] = ["正常冰", "少冰", "微冰", "去冰"]
const sweetnessLevels: Exclude<SweetnessLevel, "固定甜度">[] = ["全糖", "少糖", "半糖", "微糖", "無糖"]

export function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, updateItemOptions, totalItems, totalPrice, clearCart } = useCart()
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingIceLevel, setEditingIceLevel] = useState<IceLevel>("正常冰")
  const [editingSweetness, setEditingSweetness] = useState<Exclude<SweetnessLevel, "固定甜度">>("全糖")
  const editingItem = items.find((item) => item.id === editingItemId)
  const canEditIce = editingItem?.product.category === "drinks" && editingItem.product.temperature === "iced"
  const canEditSweetness = editingItem?.product.category === "drinks" && editingItem.product.sweetnessMode === "adjustable"

  return (
    <>
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-[74vw] max-w-[320px] flex-col border-l border-[var(--line)] bg-[var(--cream)] p-0 sm:w-full sm:max-w-md [&>button]:hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>
            <ShoppingBag className="w-5 h-5" />
            購物車
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-2 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-[0.08em] text-[var(--wood-dark)]">購物車</h2>
            <button
              type="button"
              aria-label="關閉購物車"
              onClick={() => setIsCartOpen(false)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--muted-text)] transition hover:bg-[var(--soft-pink)] hover:text-[var(--ink)] active:bg-[var(--soft-pink)]"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="font-peak mt-3 text-sm tracking-[0.16em] text-[var(--muted-text)]">
            你的購物車中共有 {totalItems} 件商品
          </p>
        </div>
        
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-white/72">
              <ShoppingBag className="size-10 text-[var(--muted-text)]" />
            </div>
            <p className="font-peak mb-4 text-[var(--muted-text)]">購物車是空的</p>
            <Button onClick={() => setIsCartOpen(false)} variant="outline" className="rounded-[4px]">
              繼續購物
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div>
                {items.map((item) => {
                  const isDrink = item.product.category === "drinks"
                  return (
                  <div key={item.id} className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-2 border-b border-[var(--line)]/70 bg-white/34 px-4 py-4">
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
                      {isDrink && (
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--muted-text)]">
                          <span>{item.options?.iceLevel ?? (item.product.temperature === "hot" ? "熱飲" : "正常冰")}</span>
                          <span>/</span>
                          <span>{item.options?.sweetness ?? "固定甜度"}</span>
                          <button
                            type="button"
                            className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/75 px-2 py-0.5 text-[var(--wood)] transition hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                            onClick={() => {
                              setEditingIceLevel(item.options?.iceLevel ?? "正常冰")
                              setEditingSweetness(
                                item.options?.sweetness && item.options.sweetness !== "固定甜度"
                                  ? item.options.sweetness
                                  : "全糖",
                              )
                              setEditingItemId(item.id)
                            }}
                          >
                            <Pencil className="size-3" />
                            編輯
                          </button>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <p className="mr-auto text-base font-black text-[var(--wood)]">NT${item.product.price}</p>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-[4px] border-[var(--line)] bg-white text-[var(--ink)]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-4 text-center text-sm font-medium text-[var(--ink)]">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-[4px] border-[var(--line)] bg-white text-[var(--ink)]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                        <button
                          type="button"
                          aria-label={`移除 ${item.product.name}`}
                          className="text-red-500 transition hover:text-red-600 active:text-red-600"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </ScrollArea>
            
            <div className="border-t border-[var(--line)] bg-[var(--cream)] px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
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
    <Dialog open={Boolean(editingItem)} onOpenChange={(open) => !open && setEditingItemId(null)}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[360px] gap-0 rounded-[8px] border border-[var(--line)] bg-[var(--cream)] p-0 shadow-[0_24px_70px_rgba(75,61,45,0.22)] sm:max-w-[400px] lg:max-w-[560px]"
      >
        {editingItem && (
          <>
            <div className="relative px-5 pb-4 pt-5">
              <DialogTitle className="pr-10 text-xl font-black text-[var(--wood-dark)]">
                編輯飲品
              </DialogTitle>
              <DialogDescription className="font-peak mt-2 text-sm text-[var(--muted-text)]">
                {editingItem.product.name}
              </DialogDescription>
              <DialogClose className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-[var(--muted-text)] transition hover:bg-[var(--soft-pink)] hover:text-[var(--ink)] active:bg-[var(--soft-pink)]">
                <X className="size-5" />
                <span className="sr-only">關閉</span>
              </DialogClose>
            </div>

            <div className="grid gap-5 px-5 pb-5">
              <div>
                <p className="mb-2 text-sm font-black text-[var(--wood)]">冰塊</p>
                {canEditIce ? (
                  <div className="grid grid-cols-4 gap-2">
                    {iceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`rounded-[4px] border px-2 py-2 text-sm font-bold transition ${
                          editingIceLevel === level
                            ? "border-[var(--wood)] bg-[var(--wood)] text-white"
                            : "border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                        }`}
                        onClick={() => setEditingIceLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[4px] border border-[var(--line)] bg-white px-3 py-2 text-sm font-bold text-[var(--muted-text)]">
                    熱飲
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-black text-[var(--wood)]">甜度</p>
                {canEditSweetness ? (
                  <div className="grid grid-cols-5 gap-2">
                    {sweetnessLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`rounded-[4px] border px-1.5 py-2 text-sm font-bold transition ${
                          editingSweetness === level
                            ? "border-[var(--wood)] bg-[var(--wood)] text-white"
                            : "border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                        }`}
                        onClick={() => setEditingSweetness(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[4px] border border-[var(--line)] bg-white px-3 py-2 text-sm font-bold text-[var(--muted-text)]">
                    固定甜度
                  </div>
                )}
              </div>

              <Button
                className="h-10 rounded-[4px] bg-[var(--wood-dark)] text-white hover:bg-[var(--wood)] active:bg-[var(--wood)]"
                onClick={() => {
                  updateItemOptions(editingItem.id, {
                    iceLevel: canEditIce ? editingIceLevel : undefined,
                    sweetness: canEditSweetness ? editingSweetness : "固定甜度",
                  })
                  setEditingItemId(null)
                }}
              >
                完成
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
