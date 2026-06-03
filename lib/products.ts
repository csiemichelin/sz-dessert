import menuData from "@/data/menu.json"

export type ProductCategory = "cookies" | "drinks" | "gift-box"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  badge?: string
}

export interface ProductCategoryItem {
  id: ProductCategory
  name: string
  icon: string
}

export const products = menuData.products as Product[]
export const categories = menuData.categories as ProductCategoryItem[]
