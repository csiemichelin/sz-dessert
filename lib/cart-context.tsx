"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Product } from "./products"

export type IceLevel = "正常冰" | "少冰" | "微冰" | "去冰"
export type SweetnessLevel = "全糖" | "少糖" | "半糖" | "微糖" | "無糖" | "固定甜度"

export interface CartItemOptions {
  iceLevel?: IceLevel
  sweetness?: SweetnessLevel
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  options?: CartItemOptions
}

export interface OrderInfo {
  pickupDate: string
  deliveryMethod: "pickup" | "delivery"
  name: string
  phone: string
  email: string
  address?: string
  notes?: string
  paymentMethod: "transfer" | "online"
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, options?: CartItemOptions) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateItemOptions: (itemId: string, options: CartItemOptions) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  orderInfo: Partial<OrderInfo>
  setOrderInfo: (info: Partial<OrderInfo>) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const CART_STORAGE_KEY = "sz-dessert-cart"

type StoredCart = {
  items?: CartItem[]
  orderInfo?: Partial<OrderInfo>
}

function createCartItemId(product: Product, options?: CartItemOptions) {
  if (product.category !== "drinks") return product.id

  return [
    product.id,
    options?.iceLevel ? `ice:${options.iceLevel}` : "",
    options?.sweetness ? `sweetness:${options.sweetness}` : "",
  ]
    .filter(Boolean)
    .join("|")
}

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    id: item.id || createCartItemId(item.product, item.options),
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderInfo, setOrderInfo] = useState<Partial<OrderInfo>>({})
  const [hasLoadedCart, setHasLoadedCart] = useState(false)

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)

      if (storedCart) {
        const parsed = JSON.parse(storedCart) as StoredCart
        if (Array.isArray(parsed.items)) setItems(parsed.items.map(normalizeCartItem))
        if (parsed.orderInfo && typeof parsed.orderInfo === "object") setOrderInfo(parsed.orderInfo)
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      setHasLoadedCart(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedCart) return

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items,
        orderInfo,
      }),
    )
  }, [hasLoadedCart, items, orderInfo])

  const addItem = useCallback((product: Product, options?: CartItemOptions) => {
    const itemId = createCartItemId(product, options)

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId)
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { id: itemId, product, quantity: 1, options }]
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      )
    }
  }, [])

  const updateItemOptions = useCallback((itemId: string, options: CartItemOptions) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === itemId)
      if (!target) return prev

      const nextId = createCartItemId(target.product, options)
      const withoutTarget = prev.filter((item) => item.id !== itemId)
      const existing = withoutTarget.find((item) => item.id === nextId)

      if (existing) {
        return withoutTarget.map((item) =>
          item.id === nextId
            ? { ...item, quantity: item.quantity + target.quantity, options }
            : item
        )
      }

      return [...withoutTarget, { ...target, id: nextId, options }]
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setOrderInfo({})
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItemOptions,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        orderInfo,
        setOrderInfo: (info) => setOrderInfo((prev) => ({ ...prev, ...info })),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
