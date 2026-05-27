export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: "cookies" | "drinks" | "gift-box"
  image: string
  badge?: string
}

export const products: Product[] = [
  // 餅乾類
  {
    id: "cookie-original",
    name: "原味貓舌餅",
    description: "經典奶香，入口即化的酥脆口感",
    price: 120,
    category: "cookies",
    image: "/images/cat-tongue-cookies.jpg",
  },
  {
    id: "cookie-chocolate",
    name: "巧克力貓舌餅",
    description: "濃郁可可風味，甜而不膩",
    price: 130,
    category: "cookies",
    image: "/images/cat-tongue-cookies.jpg",
  },
  {
    id: "cookie-matcha",
    name: "抹茶貓舌餅",
    description: "日本宇治抹茶，茶香回甘",
    price: 130,
    category: "cookies",
    image: "/images/cat-tongue-cookies.jpg",
    badge: "人氣",
  },
  {
    id: "cookie-strawberry",
    name: "草莓貓舌餅",
    description: "酸甜草莓風味，少女心最愛",
    price: 130,
    category: "cookies",
    image: "/images/cat-tongue-cookies.jpg",
  },
  {
    id: "cookie-cheese",
    name: "起司貓舌餅",
    description: "鹹香起司，獨特風味",
    price: 140,
    category: "cookies",
    image: "/images/cat-tongue-cookies.jpg",
    badge: "新品",
  },
  {
    id: "cheese-ball",
    name: "乳酪球 (6入)",
    description: "綿密乳酪內餡，外酥內軟",
    price: 180,
    category: "cookies",
    image: "/images/cat-tongue-cookies.jpg",
    badge: "招牌",
  },
  // 飲品類
  {
    id: "drink-latte",
    name: "拿鐵咖啡",
    description: "香醇義式濃縮配上綿密奶泡",
    price: 80,
    category: "drinks",
    image: "/images/drinks.jpg",
  },
  {
    id: "drink-matcha-latte",
    name: "抹茶拿鐵",
    description: "濃郁抹茶搭配香甜牛奶",
    price: 90,
    category: "drinks",
    image: "/images/drinks.jpg",
  },
  {
    id: "drink-fruit-tea",
    name: "水果氣泡飲",
    description: "新鮮水果配上清爽氣泡",
    price: 85,
    category: "drinks",
    image: "/images/drinks.jpg",
  },
  {
    id: "drink-milk-tea",
    name: "鮮奶茶",
    description: "嚴選茶葉搭配鮮奶",
    price: 75,
    category: "drinks",
    image: "/images/drinks.jpg",
  },
  // 禮盒類
  {
    id: "gift-classic",
    name: "經典禮盒",
    description: "原味+巧克力+抹茶貓舌餅各一盒",
    price: 350,
    category: "gift-box",
    image: "/images/gift-box.jpg",
  },
  {
    id: "gift-premium",
    name: "精選禮盒",
    description: "五種口味貓舌餅+乳酪球組合",
    price: 520,
    category: "gift-box",
    image: "/images/gift-box.jpg",
    badge: "送禮首選",
  },
  {
    id: "gift-deluxe",
    name: "豪華禮盒",
    description: "全品項貓舌餅+雙倍乳酪球",
    price: 680,
    category: "gift-box",
    image: "/images/gift-box.jpg",
  },
]

export const categories = [
  { id: "cookies", name: "餅乾", icon: "🍪" },
  { id: "drinks", name: "飲品", icon: "🥤" },
  { id: "gift-box", name: "禮盒", icon: "🎁" },
] as const
