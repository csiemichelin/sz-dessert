"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Product } from "./products"

export interface CartItem {
  product: Product
  quantity: number
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
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
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
        if (Array.isArray(parsed.items)) setItems(parsed.items)
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

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId))
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
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
