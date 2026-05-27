"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Clock,
  Coffee,
  Gift,
  Instagram,
  MapPin,
  Menu,
  Quote,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const storeImages = [
  "/images/store-style-1.jpg",
  "/images/store-style-2.jpg",
  "/images/store-style-3.jpg",
  "/images/store-style-4.jpg",
  "/images/store-style-5.jpg",
]

const productCards = [
  {
    name: "經典貓舌餅",
    caption: "奶香 / 伯爵 / 可可 / 抹茶",
    image: "/images/cat-tongue-cookies.jpg",
  },
  {
    name: "清爽氣泡飲",
    caption: "草莓 / 藍莓 / 鳳梨 / 白桃",
    image: "/images/drinks.jpg",
  },
  {
    name: "乳酪球禮盒",
    caption: "送禮首選 NT$340",
    image: "/images/gift-box.jpg",
  },
  {
    name: "手作甜點組",
    caption: "週三 11:00 開始供應",
    image: "/images/hero-desserts.jpg",
  },
]

const steps = [
  { title: "挑選品項", text: "選擇貓舌餅、氣泡飲、歐蕾或禮盒。" },
  { title: "填寫資料", text: "確認取餐時間、取餐方式與聯絡資訊。" },
  { title: "準時取餐", text: "依取餐時間到店報取餐號碼即可。" },
]

type ReviewItem = {
  name: string
  role: string
  initials: string
  avatarUrl?: string
  text: string
}

type ReviewsApiResponse = {
  ok: boolean
  page: number
  pageSize: number
  total: number
  totalPages: number
  reviews: ReviewItem[]
}

const REVIEWS_PAGE_SIZE = 5
const REVIEWS_TOTAL_LIMIT = 20

const fallbackReviews: ReviewItem[] = [
  {
    name: "Sanny Chen",
    role: "在地嚮導",
    initials: "S",
    avatarUrl: "",
    text: "甜點都是當天現做，新鮮好吃，也可以預訂喜歡的品項。到 IG 私訊就可以特別訂製，歡迎有空過來坐坐，無用餐時間限制。",
  },
  {
    name: "anya lin",
    role: "在地嚮導",
    initials: "A",
    avatarUrl: "",
    text: "蛋糕好吃、甜而不膩，奶油滑順有濃厚口感但不油膩，也能協助客製化蛋糕。整體兼具好看與好吃，當天很快就把蛋糕吃完。",
  },
  {
    name: "陳苡蓁",
    role: "Google 評論",
    initials: "陳",
    avatarUrl: "",
    text: "很棒的咖啡廳，是梧棲聊天放鬆的好地方。冰淇淋大福和肉桂捲都很不錯，看到貓舌餅又加買一盒，結果也很好吃，會繼續回訪。",
  },
]

const menuCategories = [
  {
    title: "餅乾",
    description: "多種口味貓舌餅",
    icon: Sparkles,
    image: "/images/cat-tongue-cookies.jpg",
    items: [
      { name: "奶香貓舌餅", price: "小 NT$60 / 大 NT$180" },
      { name: "伯爵貓舌餅", price: "小 NT$60 / 大 NT$180" },
      { name: "抹茶貓舌餅", price: "小 NT$60 / 大 NT$180" },
      { name: "蜜香紅茶貓舌餅", price: "小 NT$60 / 大 NT$180" },
    ],
  },
  {
    title: "飲品",
    description: "咖啡、歐蕾與氣泡飲",
    icon: Coffee,
    image: "/images/drinks.jpg",
    items: [
      { name: "咖啡拿鐵（冰）", price: "NT$160" },
      { name: "草莓氣泡飲", price: "NT$130" },
      { name: "法芙娜可可歐蕾", price: "熱 NT$90 / 冰 NT$120" },
      { name: "小山園若竹抹茶歐蕾", price: "熱 NT$110 / 冰 NT$180" },
    ],
  },
  {
    title: "禮盒",
    description: "甜點分享與送禮",
    icon: Gift,
    image: "/images/gift-box.jpg",
    items: [{ name: "乳酪球禮盒", price: "NT$340" }],
  },
]

function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string
  title: string
  description?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-pink)]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">{title}</h2>
      {description && <p className="mt-4 leading-7 text-[var(--muted-text)]">{description}</p>}
    </div>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(253,250,244,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="萱仔甜點 Logo" width={46} height={46} className="rounded-full" />
          <span className="text-xl font-black text-[var(--ink)]">萱仔甜點</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#menu" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--brand-pink)]">
            人氣商品
          </Link>
          <Link href="#how" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--brand-pink)]">
            訂購方式
          </Link>
          <Link href="#reviews" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--brand-pink)]">
            顧客好評
          </Link>
          <Button asChild className="h-9 rounded-full bg-[var(--wood)] px-6 text-white hover:bg-[var(--wood-dark)]">
            <Link href="/order">
              <ShoppingBag className="size-4" />
              立即訂購
            </Link>
          </Button>
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="grid gap-4 border-t border-[var(--line)] bg-[var(--cream)] px-5 py-5 md:hidden">
          <Link href="#menu" onClick={() => setIsMenuOpen(false)}>人氣商品</Link>
          <Link href="#how" onClick={() => setIsMenuOpen(false)}>訂購方式</Link>
          <Link href="#reviews" onClick={() => setIsMenuOpen(false)}>顧客好評</Link>
          <Button asChild className="rounded-full bg-[var(--wood)] text-white hover:bg-[var(--wood-dark)]">
            <Link href="/order">立即訂購</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full aspect-[750/1060] sm:aspect-[1536/1757] lg:aspect-[2480/960]">
        <Image
          src="/images/banner_dessert_m.png"
          alt="萱仔甜點首頁 Banner"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center hidden sm:block lg:hidden"
        />
        <Image
          src="/images/banner_dessert_s.png"
          alt="萱仔甜點首頁 Banner"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center block sm:hidden"
        />
        <Image
          src="/images/banner_dessert_l.png"
          alt="萱仔甜點首頁 Banner"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center hidden lg:block"
        />
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section id="space" className="relative overflow-hidden bg-white px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionTitle
            eyebrow="Store Atmosphere"
            title="把甜點店做成一個安靜、乾淨、好拍照的角落"
            description="店面以奶油白牆、圓角線條、淺木桌椅、灰色地磚與玻璃磚組成，視覺上柔和、明亮，也保留品牌包裝裡可愛的粉色細節。"
          />
          <div className="grid grid-cols-3 gap-3">
            {["奶油白牆", "淺木桌椅", "玻璃磚光影", "水磨石櫃檯", "圓角牆面", "粉色點綴"].map((item) => (
              <div key={item} className="rounded-full border border-[var(--line)] bg-[var(--cream)] px-4 py-3 text-center text-sm font-bold text-[var(--ink)]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-5">
          {storeImages.map((image, index) => (
            <div
              key={image}
              className={`group relative overflow-hidden rounded-[32px] bg-[var(--cream)] shadow-[0_18px_46px_rgba(75,61,45,0.09)] ${
                index === 2 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className={index === 2 ? "aspect-[4/5]" : "aspect-[3/4]"}>
                <Image src={image} alt={`萱仔甜點店家風格 ${index + 1}`} fill className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(0)
  const active = menuCategories[activeCategory]
  const ActiveIcon = active.icon

  return (
    <section id="menu" className="relative overflow-hidden border-t border-[var(--line)] bg-white px-5 py-20">
      <div className="terrazzo pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <SectionTitle eyebrow="Menu" title="人氣甜點與飲品" />
          <div className="flex gap-3">
            {menuCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <button
                  key={category.title}
                  onClick={() => setActiveCategory(index)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                    activeCategory === index
                      ? "bg-[var(--wood)] text-white"
                      : "bg-white/80 text-[var(--ink)] hover:bg-[var(--soft-pink)]"
                  }`}
                >
                  <Icon className="size-4" />
                  {category.title}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {productCards.map((item) => (
            <Link
              href="/order"
              key={item.name}
              className="group rounded-[28px] bg-white/84 p-5 shadow-[0_18px_46px_rgba(75,61,45,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,61,45,0.14)]"
            >
              <div className="relative mb-5 aspect-square overflow-hidden rounded-[22px] bg-[var(--cream)]">
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-xl font-black text-[var(--ink)]">{item.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted-text)]">{item.caption}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid gap-10 rounded-[38px] bg-white/86 p-6 shadow-[0_24px_70px_rgba(75,61,45,0.1)] lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] bg-[var(--cream)]">
            <Image src={active.image} alt={active.title} fill className="object-cover" />
          </div>
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-[var(--soft-pink)] text-[var(--brand-pink)]">
                <ActiveIcon className="size-7" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-[var(--ink)]">{active.title}</h3>
                <p className="mt-1 text-[var(--muted-text)]">{active.description}</p>
              </div>
            </div>
            <div className="grid gap-3">
              {active.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4 rounded-[20px] bg-[var(--cream)] px-5 py-4">
                  <span className="font-bold text-[var(--ink)]">{item.name}</span>
                  <span className="shrink-0 text-right text-sm font-black text-[var(--wood)]">{item.price}</span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-7 h-11 rounded-full bg-[var(--wood)] px-8 text-white hover:bg-[var(--wood-dark)]">
              <Link href="/order">
                <ShoppingBag className="size-4" />
                前往訂購
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="how" className="wood-grain-light wood-grain-b relative border-t border-[var(--line)] bg-[var(--light-wood)] px-5 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionTitle
            eyebrow="How it works"
            title="三個步驟，把甜甜的時刻帶回家"
            description="請依照取餐時間到店報取餐號碼，不用提早到。最新品項、限定口味與販售時間會更新在 Instagram。"
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild className="rounded-full bg-[var(--wood)] px-7 text-white hover:bg-[var(--wood-dark)]">
              <Link href="/order">線上訂購</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-[var(--line)] bg-white px-7 text-[var(--ink)]">
              <a href="https://www.instagram.com/s.z_dessert" target="_blank" rel="noopener noreferrer">
                <Instagram className="size-4" />
                追蹤 IG
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[30px] bg-[var(--cream)] p-6">
              <div className="mb-6 flex size-11 items-center justify-center rounded-full bg-[var(--wood)] text-lg font-black text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-black text-[var(--ink)]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-text)]">{step.text}</p>
            </div>
          ))}
          <div className="rounded-[30px] bg-[var(--cream)] p-6 md:col-span-3">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Instagram className="mb-4 size-7 text-[var(--brand-pink)]" />
                <h3 className="font-black text-[var(--ink)]">Instagram</h3>
                <p className="mt-2 text-sm text-[var(--muted-text)]">@s.z_dessert</p>
              </div>
              <div>
                <Clock className="mb-4 size-7 text-[var(--brand-pink)]" />
                <h3 className="font-black text-[var(--ink)]">營業時間</h3>
                <p className="mt-2 text-sm text-[var(--muted-text)]">週三 11:00 開始供應</p>
              </div>
              <div>
                <MapPin className="mb-4 size-7 text-[var(--brand-pink)]" />
                <h3 className="font-black text-[var(--ink)]">取餐方式</h3>
                <p className="mt-2 text-sm text-[var(--muted-text)]">到店自取 / 宅配 NT$180</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(fallbackReviews)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(fallbackReviews.length)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isUnmounted = false

    async function loadReviews() {
      setIsLoading(true)

      try {
        const response = await fetch(
          `/api/google-reviews?page=${page}&pageSize=${REVIEWS_PAGE_SIZE}&limit=${REVIEWS_TOTAL_LIMIT}`,
          { cache: "no-store" },
        )

        if (!response.ok) throw new Error("Failed to fetch reviews")

        const data = (await response.json()) as ReviewsApiResponse

        if (isUnmounted) return

        setReviews(data.reviews.length > 0 ? data.reviews : fallbackReviews)
        setTotalPages(Math.max(1, data.totalPages || 1))
        setTotalCount(data.total || fallbackReviews.length)
      } catch {
        if (isUnmounted) return
        setReviews(fallbackReviews)
        setTotalPages(1)
        setTotalCount(fallbackReviews.length)
      } finally {
        if (!isUnmounted) setIsLoading(false)
      }
    }

    void loadReviews()

    return () => {
      isUnmounted = true
    }
  }, [page])

  return (
    <section id="reviews" className="relative overflow-hidden border-t border-[var(--line)] bg-white px-5 py-20">
      <div className="terrazzo pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Google Reviews"
            title="顧客好評推薦"
            description="精選 Google 五星回饋，保留乾淨、溫柔的店面風格，也讓好評卡片像甜點盒一樣輕盈。"
          />
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-5 py-3 text-sm font-black text-[var(--ink)] shadow-[0_14px_36px_rgba(75,61,45,0.08)]">
            <Star className="size-4 fill-[#f4c95d] text-[#f4c95d]" />
            Google 五星精選 {Math.min(totalCount, REVIEWS_TOTAL_LIMIT)} 則
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/82 p-6 shadow-[0_22px_62px_rgba(75,61,45,0.1)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_78px_rgba(75,61,45,0.14)]"
            >
              <Quote className="absolute bottom-5 right-5 size-10 text-[var(--line)]" />
              <div className="mb-5 flex items-center gap-4">
                {review.avatarUrl ? (
                  <img
                    src={review.avatarUrl}
                    alt={`${review.name} 的 Google 頭像`}
                    className="size-12 rounded-full border border-white object-cover shadow-[0_8px_18px_rgba(75,61,45,0.12)]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-[var(--soft-pink)] text-lg font-black text-[var(--brand-pink)]">
                    {review.initials}
                  </div>
                )}
                <div>
                  <h3 className="font-black text-[var(--ink)]">{review.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[var(--muted-text)]">{review.role}</p>
                </div>
              </div>
              <p className="min-h-24 text-sm leading-7 text-[var(--ink)]">{review.text}</p>
              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="size-4 fill-[#f4c95d] text-[#f4c95d]"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="前一頁"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="group flex size-14 items-center justify-center rounded-full border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(75,61,45,0.10)] transition hover:border-[var(--wood)] hover:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition group-hover:text-white text-[var(--ink)]">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="下一頁"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="group flex size-14 items-center justify-center rounded-full border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(75,61,45,0.10)] transition hover:border-[var(--wood)] hover:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition group-hover:text-white text-[var(--ink)]">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="wood-grain-light wood-grain-c bg-[var(--light-wood)] px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 border-t border-[var(--line)] pt-8 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="萱仔甜點" width={44} height={44} className="rounded-full" />
          <div>
            <p className="font-black text-[var(--ink)]">萱仔甜點</p>
            <p className="text-sm text-[var(--muted-text)]">甜甜吃甜點！</p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted-text)]">© 2024 萱仔甜點 S.Z Dessert. All rights reserved.</p>
      </div>
    </footer>
  )
}
