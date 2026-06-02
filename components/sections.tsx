"use client"

import Image from "next/image"
import Link from "next/link"
import { type ReactNode, useEffect, useRef, useState } from "react"
import {
  Clock,
  Coffee,
  Cookie,
  Gift,
  MapPin,
  Medal,
  Menu,
  Phone,
  Quote,
  ShoppingBag,
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

const steps = [
  { title: "挑選品項", text: "選擇喜歡的商品與數量" },
  { title: "填寫資料", text: "確認取餐時間、付款方式與聯絡資訊" },
  { title: "準時取餐", text: "依取餐時間到店報取餐號碼即可" },
]

const latestNews = [
  {
    date: "2026/05/29",
    category: "營業公告",
    text: "端午連假甜點與飲品正常供應，建議提前私訊預留貓舌餅、乳酪球禮盒與客製蛋糕取貨時段，現場甜點每日數量有限售完不再追加",
  },
  {
    date: "2026/05/24",
    category: "新品公告",
    text: "夏季限定白桃氣泡飲正式上架，使用清爽果香與細緻氣泡調製，搭配奶香貓舌餅與伯爵貓舌餅可享下午茶組合優惠",
  },
  {
    date: "2026/05/18",
    category: "預購公告",
    text: "父親節客製蛋糕開放預訂，可討論口味、尺寸、裝飾風格與指定取貨日期，若需插牌、蠟燭或簡短祝福字樣也可以一併備註",
  },
  {
    date: "2026/05/12",
    category: "會員公告",
    text: "加入會員可累積消費點數，生日當月享指定甜點九折優惠與新品優先預留資格，後續也會不定期推出會員限定小禮與試吃活動",
  },
  {
    date: "2026/05/06",
    category: "活動公告",
    text: "週三下午茶時段任選飲品搭配小份貓舌餅現折 NT$20，適合內用聊天或外帶分享，每日數量有限售完為止",
  },
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

const bestSellerCategories = [
  {
    title: "餅乾",
    description: "酥脆奶香與茶香系單品，午後最容易被帶走的四款。",
    icon: Cookie,
    items: [
      { name: "奶香貓舌餅", note: "經典奶油香氣，回購率第一", price: "NT$120", image: "/images/cat-tongue-cookies.jpg" },
      { name: "抹茶貓舌餅", note: "茶香清爽，甜度剛剛好", price: "NT$130", image: "/images/cat-tongue-cookies.jpg" },
      { name: "巧克力貓舌餅", note: "濃郁可可尾韻，適合配咖啡", price: "NT$130", image: "/images/cat-tongue-cookies.jpg" },
      { name: "起司貓舌餅", note: "鹹甜平衡，越吃越順口", price: "NT$140", image: "/images/cat-tongue-cookies.jpg" },
    ],
  },
  {
    title: "飲品",
    description: "清爽氣泡、香醇咖啡與歐蕾，搭配甜點剛剛好。",
    icon: Coffee,
    items: [
      { name: "草莓氣泡飲", note: "果香明亮，夏季詢問度最高", price: "NT$130", image: "/images/drinks.jpg" },
      { name: "咖啡拿鐵", note: "奶泡細緻，甜點萬用搭檔", price: "NT$80", image: "/images/drinks.jpg" },
      { name: "抹茶拿鐵", note: "抹茶厚度夠，茶控固定回點", price: "NT$90", image: "/images/drinks.jpg" },
      { name: "鮮奶茶", note: "茶香溫柔，輕甜不膩口", price: "NT$75", image: "/images/drinks.jpg" },
    ],
  },
  {
    title: "禮盒",
    description: "生日、節慶與拜訪心意，拆開就很有儀式感。",
    icon: Gift,
    items: [
      { name: "乳酪球禮盒", note: "綿密乳酪球，送禮首選", price: "NT$340", image: "/images/gift-box.jpg" },
      { name: "經典禮盒", note: "三款人氣貓舌餅一次收藏", price: "NT$350", image: "/images/gift-box.jpg" },
      { name: "精選禮盒", note: "餅乾加乳酪球，份量更完整", price: "NT$520", image: "/images/gift-box.jpg" },
      { name: "豪華禮盒", note: "重要日子的體面甜點組", price: "NT$680", image: "/images/gift-box.jpg" },
    ],
  },
]

const rankStyles = [
  {
    label: "金牌",
    className: "bg-[#c99a3a] text-white shadow-[0_10px_24px_rgba(164,112,28,0.26)]",
    foldClassName: "bg-[#8c6724]",
    image: "/images/Hot.png",
    gradient: "bg-[linear-gradient(135deg,rgba(201,154,58,0.22),rgba(255,244,204,0.72),rgba(255,255,255,0.78))]",
  },
  {
    label: "銀牌",
    className: "bg-[#c7beb3] text-white shadow-[0_10px_24px_rgba(123,111,98,0.22)]",
    foldClassName: "bg-[#8b8176]",
    image: "/images/Hot.png",
    gradient: "bg-[linear-gradient(135deg,rgba(199,190,179,0.24),rgba(244,241,236,0.78),rgba(255,255,255,0.78))]",
  },
  {
    label: "銅牌",
    className: "bg-[#b9774f] text-white shadow-[0_10px_24px_rgba(151,82,43,0.22)]",
    foldClassName: "bg-[#7f4a2f]",
    image: "/images/Hot.png",
    gradient: "bg-[linear-gradient(135deg,rgba(185,119,79,0.24),rgba(255,229,210,0.74),rgba(255,255,255,0.78))]",
  },
  {
    label: "人氣",
    className: "bg-[var(--soft-pink)] text-[var(--brand-pink)] shadow-[0_10px_24px_rgba(217,138,158,0.2)]",
    foldClassName: "bg-[#bd6f83]",
    image: "/images/Hot.png",
    gradient: "bg-[linear-gradient(135deg,rgba(217,138,158,0.22),rgba(246,224,230,0.78),rgba(255,255,255,0.78))]",
  },
]

function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-pink)]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">{title}</h2>
      {description && <p className="font-peak mt-4 leading-7 text-[var(--muted-text)]">{description}</p>}
    </div>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)]/70 bg-[rgba(253,250,244,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-16 lg:px-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="萱仔甜點 Logo" width={46} height={46} className="rounded-full" />
          <span className="text-xl font-black text-[var(--ink)]">萱仔甜點</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#menu" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]">
            熱銷商品
          </Link>
          <Link href="#how" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]">
            訂購方式
          </Link>
          <Link href="#reviews" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]">
            顧客好評
          </Link>
          <Button asChild className="h-9 rounded-full bg-[var(--wood)] px-6 text-white hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)]">
            <a href="/order">
              <ShoppingBag className="size-4" />
              立即訂購
            </a>
          </Button>
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="relative grid gap-4 overflow-hidden border-t border-[var(--line)]/70 bg-[rgba(253,250,244,0.82)] px-5 pb-8 pt-5 backdrop-blur-xl md:hidden">
          <Link href="#menu" className="transition hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]" onClick={() => setIsMenuOpen(false)}>熱銷商品</Link>
          <Link href="#how" className="transition hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]" onClick={() => setIsMenuOpen(false)}>訂購方式</Link>
          <Link href="#reviews" className="transition hover:text-[var(--brand-pink)] active:text-[var(--brand-pink)]" onClick={() => setIsMenuOpen(false)}>顧客好評</Link>
          <Button asChild className="rounded-full bg-[var(--wood)] text-white hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)]">
            <a href="/order">立即訂購</a>
          </Button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2.5 border-t border-[var(--wood)]/24 bg-gradient-to-r from-[var(--wood)]/50 via-[var(--wood)]/78 to-[var(--wood)]/50 shadow-[0_-8px_18px_rgba(117,88,58,0.08)]">
            <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <span className="absolute inset-x-14 top-1.5 h-px bg-gradient-to-r from-transparent via-[var(--cream)]/45 to-transparent" />
            <span className="absolute left-1/2 top-0.5 h-1 w-12 -translate-x-1/2 rounded-full bg-[var(--cream)]/72 shadow-[0_0_0_1px_rgba(117,88,58,0.16)]" />
            <span className="absolute left-8 top-1.5 h-px w-10 bg-gradient-to-r from-transparent to-white/55" />
            <span className="absolute right-8 top-1.5 h-px w-10 bg-gradient-to-l from-transparent to-white/55" />
          </div>
        </nav>
      )}
    </header>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-0 flex-1 overflow-hidden sm:flex-1 lg:flex-none min-[2000px]:!min-h-0 min-[2000px]:!flex-1">
      <div className="relative h-full w-full sm:h-full sm:aspect-auto lg:h-auto lg:aspect-[2480/960] min-[2000px]:!h-full min-[2000px]:!aspect-auto">
        <Image
          src="/images/banner_dessert_m.png"
          alt="萱仔甜點首頁 Banner"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center scale-[1.1] hidden sm:block lg:hidden"
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
        <div className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 items-center gap-5 sm:bottom-50 sm:gap-10 sm:left-1/2 sm:-translate-x-1/2 lg:left-[calc(25%+50px)] lg:top-[90%] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <div className="toast-steam-cta">
            <span className="toast-steam toast-steam-1" aria-hidden="true" />
            <span className="toast-steam toast-steam-2" aria-hidden="true" />
            <span className="toast-steam toast-steam-3" aria-hidden="true" />
            <span className="toast-steam toast-steam-4" aria-hidden="true" />
            <Button
              asChild
              size={null}
              className="toast-cta-button h-9 rounded-full bg-[var(--wood)] px-5 py-0 text-xs font-bold leading-none text-white shadow-[0_12px_26px_rgba(75,61,45,0.22)] hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)] sm:h-12 sm:px-9 sm:text-base lg:h-10 lg:px-9 lg:text-sm xl:h-11 xl:px-11 xl:text-sm 2xl:h-12 2xl:px-12 2xl:text-base 3xl:h-14 3xl:px-14 3xl:text-base"
            >
              <a href="/order">
                <ShoppingBag className="size-4 lg:size-5" />
                立即訂購
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HeroWoodSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<number[][]>([latestNews.map((_, index) => index)])
  const [activePage, setActivePage] = useState(0)

  useEffect(() => {
    const calculatePages = () => {
      const container = containerRef.current
      const measure = measureRef.current

      if (!container || !measure) {
        return
      }

      if (window.matchMedia("(min-width: 640px) and (max-width: 1023px)").matches) {
        setPages(latestNews.map((_, index) => [index]))
        setActivePage(0)
        return
      }

      const rows = Array.from(measure.querySelectorAll<HTMLElement>("[data-news-row]"))
      const availableHeight = container.clientHeight
      const nextPages: number[][] = []
      let currentPage: number[] = []
      let currentHeight = 0

      rows.forEach((row, index) => {
        const rowHeight = row.offsetHeight
        const shouldStartNextPage =
          currentPage.length > 0 && currentHeight + rowHeight > availableHeight

        if (shouldStartNextPage) {
          nextPages.push(currentPage)
          currentPage = []
          currentHeight = 0
        }

        currentPage.push(index)
        currentHeight += rowHeight
      })

      if (currentPage.length > 0) {
        nextPages.push(currentPage)
      }

      setPages(nextPages.length > 0 ? nextPages : [latestNews.map((_, index) => index)])
      setActivePage(0)
    }

    calculatePages()

    const resizeObserver = new ResizeObserver(calculatePages)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    if (measureRef.current) {
      resizeObserver.observe(measureRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (pages.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActivePage((page) => (page + 1) % pages.length)
    }, 4800)

    return () => window.clearInterval(timer)
  }, [pages.length])

  const activeNews = pages[activePage] ?? pages[0] ?? []

  return (
    <section className="h-44 flex-shrink-0 sm:h-43">
      <div className="relative h-full w-full overflow-hidden border-[4px] sm:border-[8px] border-[var(--light-wood)] bg-[var(--light-wood)]">
        <img
          src="/images/hero_wood_section_l.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-x-2 top-1/2 mx-auto max-w-6xl -translate-y-1/2 sm:inset-x-8 md:inset-x-16 lg:inset-x-8 lg:top-[54%]">
          <div className="px-2 text-[var(--ink)] sm:px-4 sm:py-4">
            <h2 className="mb-1 text-base font-black leading-none text-[var(--wood-dark)] sm:mb-2 sm:text-xl">最新消息</h2>
            <div className="mb-1.5 flex items-center justify-center gap-3 sm:mb-2">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[var(--wood)] to-transparent opacity-70" />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[var(--wood)]">
                <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill="currentColor" opacity="0.85" />
              </svg>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[var(--wood)] to-transparent opacity-70" />
            </div>
            <div ref={containerRef} className="relative h-20 overflow-hidden sm:h-16 lg:h-16" aria-live="polite">
              <div key={activePage} className="latest-news-page">
                {activeNews.map((newsIndex) => (
                  <NewsRow key={latestNews[newsIndex].date} item={latestNews[newsIndex]} />
                ))}
              </div>
              <div
                ref={measureRef}
                className="pointer-events-none invisible absolute inset-x-0 top-0"
                aria-hidden="true"
              >
                {latestNews.map((item) => (
                  <NewsRow key={`measure-${item.date}`} item={item} />
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1">
              {pages.map((_, index) => (
                <div
                  key={index}
                  className={`size-1.5 rounded-full bg-[var(--wood)] transition-opacity ${
                    index === activePage ? "opacity-100" : "opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NewsRow({ item }: { item: (typeof latestNews)[number] }) {
  return (
    <div data-news-row className="flex flex-row items-start gap-2 py-0.5 text-xs font-bold leading-6 sm:gap-4 sm:text-sm sm:leading-7">
      <time className="shrink-0 font-black text-[var(--wood)]" dateTime={item.date.replaceAll("/", "-")}>
        {item.date}
      </time>
      <p className="min-w-0 text-[var(--ink)]">
        <span className="mr-2 text-[var(--brand-pink)]">|</span>
        <span>{item.category}</span>
        <span className="mx-2 text-[var(--brand-pink)]">|</span>
        <span>{item.text}</span>
      </p>
    </div>
  )
}

export function AboutSection() {
  return (
    <section id="space" className="relative overflow-hidden bg-white px-5 py-20 md:px-16 lg:px-5">
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
  const active = bestSellerCategories[activeCategory]

  return (
    <section id="menu" className="relative overflow-hidden bg-white px-5 py-20 md:px-16 lg:px-5">
      <div className="terrazzo pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-8 w-full max-w-[360px] md:max-w-none">
          <SectionTitle eyebrow="Best Sellers" title="熱銷商品" />
        </div>

        <div>
          <div className="mx-auto mb-6 flex w-full max-w-[360px] flex-wrap gap-3 md:max-w-none">
            {bestSellerCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <button
                  key={category.title}
                  onClick={() => setActiveCategory(index)}
                  aria-pressed={activeCategory === index}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                    activeCategory === index
                      ? "bg-[var(--wood)] text-white"
                      : "bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--soft-pink)] active:bg-[var(--soft-pink)]"
                  }`}
                >
                  <Icon className="size-4" />
                  {category.title}
                </button>
              )
            })}
          </div>

          <div className="mx-auto mt-8 grid w-full max-w-[360px] gap-8 md:max-w-[680px] md:grid-cols-2 md:gap-5 lg:max-w-none xl:grid-cols-4">
            {active.items.map((item, index) => {
              const rank = rankStyles[index]
              return (
                <a
                  href="/order"
                  key={item.name}
                  className="group relative mx-auto w-full max-w-[360px] rounded-[28px] border border-white/80 bg-white p-3 shadow-[0_16px_40px_rgba(75,61,45,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(75,61,45,0.14)] active:-translate-y-1 active:shadow-[0_24px_58px_rgba(75,61,45,0.14)] md:max-w-[320px] md:p-4 lg:max-w-none"
                >
                  <div className={`pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 ${rank.gradient}`} />
                  {/* <div className="pointer-events-none absolute -right-2 -top-2 z-10 h-[148px] w-[148px] overflow-hidden">
                    <div className={`absolute right-[92px] top-0 z-0 h-2.5 w-12 rounded-t-[14px] ${rank.foldClassName}`} />
                    <div className={`absolute right-0 top-[92px] z-0 h-12 w-2.5 rounded-r-[14px] ${rank.foldClassName}`} />
                    <div className={`absolute right-[-46px] top-7 z-10 flex h-10 w-48 rotate-45 items-center justify-center text-xs font-black shadow-[0_0_0_3px_rgba(255,255,255,0.18),0_22px_8px_-16px_rgba(75,61,45,0.55)] ${rank.className}`}>
                      <span className="absolute inset-1 border border-dashed border-white/85" />
                      <span className="relative inline-flex items-center gap-1.5">
                        {"image" in rank ? (
                          <Image src={rank.image} alt={rank.label} width={54} height={36} className="h-8 w-12 object-contain" />
                        ) : (
                          <>
                            <Medal className="size-4" />
                            {rank.label}
                          </>
                        )}
                      </span>
                    </div>
                  </div> */}
                  {"image" in rank && (
                    <Image
                      src={rank.image}
                      alt={rank.label}
                      width={128}
                      height={85}
                      className="pointer-events-none absolute -right-6 -top-8 z-10 h-auto w-32 drop-shadow-[0_14px_24px_rgba(75,61,45,0.22)]"
                    />
                  )}
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--cream)]">
                    <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105 group-active:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(40,32,24,0.34)] to-transparent" />
                  </div>
                  <div className="relative flex min-h-[132px] flex-col">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-pink)]">No. {index + 1}</p>
                    <h4 className="mt-2 text-xl font-black leading-tight text-[var(--ink)]">{item.name}</h4>
                    <p className="font-peak mt-2 text-sm leading-6 text-[var(--muted-text)]">{item.note}</p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <span className="rounded-full bg-[var(--cream)] px-3 py-1.5 text-xs font-bold text-[var(--muted-text)]">單品熱銷</span>
                      <span className="text-xl font-black text-[var(--wood)]">{item.price}</span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
          <div className="mx-auto mt-6 flex w-full max-w-[360px] justify-center md:max-w-none">
            <Button asChild className="h-11 rounded-full bg-[var(--wood)] px-7 text-white hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)]">
              <a href="/order">
                <ShoppingBag className="size-4" />
                前往訂購
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="how" className="wood-grain-light wood-grain-b wood-grain-faded relative border-t border-[var(--line)] bg-[var(--light-wood)] px-5 py-20 md:px-16 lg:px-5">
      <div className="mx-auto grid w-full max-w-[360px] gap-4 md:max-w-6xl md:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionTitle
            eyebrow="How it works"
            title={
              <>
                三個步驟
                <br />
                把甜蜜帶回家
              </>
            }
            description="請依取餐時間到店報取餐號碼即可，無需提早到。最新品項與限定口味請參考 Instagram"
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild className="rounded-full bg-[var(--wood)] px-7 text-white hover:bg-[var(--wood-dark)] active:bg-[var(--wood-dark)]">
              <a href="/order">
                <ShoppingBag className="size-4" />
                立即訂購
              </a>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="https://www.instagram.com/s.z_dessert" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="block transition hover:-translate-y-0.5 active:-translate-y-0.5">
              <Image src="/images/icons/ig.png" alt="" width={42} height={42} className="size-10 rounded-full object-cover drop-shadow-[0_8px_18px_rgba(75,61,45,0.14)]" />
            </a>
            <a href="https://line.me/R/ti/p/@kek5408f" target="_blank" rel="noopener noreferrer" aria-label="LINE" className="block transition hover:-translate-y-0.5 active:-translate-y-0.5">
              <Image src="/images/icons/line.png" alt="" width={42} height={42} className="size-10 rounded-full object-cover drop-shadow-[0_8px_18px_rgba(75,61,45,0.14)]" />
            </a>
            <a href="https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fkek5408f%2F%3Flocale%3Dzh_TW" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="block transition hover:-translate-y-0.5 active:-translate-y-0.5">
              <Image src="/images/icons/fb.png" alt="" width={42} height={42} className="size-10 rounded-full object-cover drop-shadow-[0_8px_18px_rgba(75,61,45,0.14)]" />
            </a>
          </div>
        </div>

        <div className="">
          <div className="relative px-1 py-2 md:hidden">
            <div className="absolute bottom-10 left-7 top-10 border-l-[3px] border-dashed border-[var(--wood)]/48" />
            <div className="grid gap-5">
              {steps.map((step, index) => (
                <div key={step.title} className="relative flex items-center gap-4">
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--wood)] text-2xl font-black text-white shadow-[0_14px_30px_rgba(117,88,58,0.18)] ring-4 ring-white/50">
                    {index + 1}
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 border-b border-l border-white/55 bg-white/55" />
                    <div className="relative z-0 overflow-hidden rounded-[24px] border border-white/55 bg-[var(--cream)] px-4 py-3.5 shadow-[0_14px_32px_rgba(117,88,58,0.1)] backdrop-blur-[2px] transition hover:bg-[var(--cream)]">
                      <Image
                        src={`/images/step${index + 1}.png`}
                        alt=""
                        width={96}
                        height={96}
                        className="pointer-events-none absolute -right-3 -top-4 z-0 size-24 rotate-[30deg] object-contain"
                      />
                      <h3 className="relative z-10 text-lg font-black tracking-wide text-[var(--ink)]">{step.title}</h3>
                      <p className="relative z-10 mt-1 text-xs font-bold leading-5 text-[var(--muted-text)]">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden gap-5 px-4 pt-0 pb-5 md:grid md:grid-cols-3 md:items-stretch lg:gap-8">
            <div className="absolute left-[calc(16.666%+32px)] right-[calc(50%+32px)] top-[52px] hidden border-t-[3px] border-dashed border-[var(--wood)]/58 md:block" />
            <div className="absolute left-[calc(50%+32px)] right-[calc(16.666%+32px)] top-[52px] hidden border-t-[3px] border-dashed border-[var(--wood)]/58 md:block" />
            <div className="absolute left-1/3 top-[52px] hidden size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--wood)] shadow-[0_0_0_5px_rgba(242,231,216,0.72)] md:block" />
            <div className="absolute left-2/3 top-[52px] hidden size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--wood)] shadow-[0_0_0_5px_rgba(242,231,216,0.72)] md:block" />
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative z-10 flex h-full min-h-[196px] w-full flex-col items-center rounded-[26px] px-4 py-5 text-center transition hover:bg-white/28 lg:min-h-[188px]"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--wood)] text-2xl font-black text-white shadow-[0_14px_30px_rgba(117,88,58,0.18)] ring-4 ring-white/50 md:size-16 md:text-3xl">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-black tracking-wide text-[var(--ink)] md:mt-6 md:text-xl">{step.title}</h3>
                <p className="mx-auto mt-1 max-w-[10.5rem] text-xs font-bold leading-5 text-[var(--muted-text)] md:mt-1.5 md:max-w-[12rem] md:text-base md:leading-6">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-[30px] border border-white/55 bg-[var(--cream)] p-5 shadow-[0_18px_46px_rgba(117,88,58,0.1)] md:mt-0 md:p-6">
            <div className="grid gap-0 divide-y divide-[var(--wood)]/12 md:grid-cols-[1fr_1.15fr] md:divide-x md:divide-y-0">
              <div className="grid gap-0 divide-y divide-[var(--wood)]/12 pb-5 md:pb-0 md:pr-6">
                <div className="flex gap-4 pb-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/65 text-[var(--brand-pink)] shadow-[0_10px_22px_rgba(117,88,58,0.09)]">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-[0.12em] text-[var(--wood)]">地址</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-[var(--muted-text)]">435臺中市梧棲區大村里立德街95巷63號</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/65 text-[var(--brand-pink)] shadow-[0_10px_22px_rgba(117,88,58,0.09)]">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-[0.12em] text-[var(--wood)]">電話</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-[var(--muted-text)]">0900 407 168</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-5 md:pl-6 md:pt-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/65 text-[var(--brand-pink)] shadow-[0_10px_22px_rgba(117,88,58,0.09)]">
                  <Clock className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black tracking-[0.12em] text-[var(--wood)]">營業時間</h3>
                  <dl className="mt-2 grid grid-cols-[3.3rem_1fr] gap-x-3 gap-y-1.5 text-sm leading-5 text-[var(--muted-text)]">
                    {[
                      ["星期日", "11:00–18:00"],
                      ["星期一", "休息"],
                      ["星期二", "休息"],
                      ["星期三", "11:00–18:00"],
                      ["星期四", "11:00–18:00"],
                      ["星期五", "11:00–18:00"],
                      ["星期六", "11:00–18:00"],
                    ].map(([day, time]) => (
                      <div key={day} className="contents">
                        <dt className="font-bold text-[var(--muted-text)]">{day}</dt>
                        <dd className={time === "休息" ? "font-black text-[var(--brand-pink)]" : "font-bold"}>
                          {time}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
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
    <section id="reviews" className="relative overflow-hidden border-t border-[var(--line)] bg-white px-5 py-20 md:px-16 lg:px-5">
      <div className="terrazzo pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-[360px] md:max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Google Reviews"
            title="顧客好評推薦"
            description="感謝每位顧客的支持與鼓勵，陪伴我們用心做好每一份甜點"
          />
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-5 py-3 text-sm font-black text-[var(--ink)] shadow-[0_14px_36px_rgba(75,61,45,0.08)]">
            <Star className="size-4 fill-[#f4c95d] text-[#f4c95d]" />
            Google 五星精選
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
              <p className="font-peak min-h-24 text-sm leading-7 text-[var(--ink)]">{review.text}</p>
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
            className="group flex size-14 items-center justify-center rounded-full border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(75,61,45,0.10)] transition hover:border-[var(--wood)] hover:bg-[var(--wood)] active:border-[var(--wood)] active:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--ink)] transition group-hover:text-white group-active:text-white">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="下一頁"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="group flex size-14 items-center justify-center rounded-full border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(75,61,45,0.10)] transition hover:border-[var(--wood)] hover:bg-[var(--wood)] active:border-[var(--wood)] active:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--ink)] transition group-hover:text-white group-active:text-white">
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
    <footer className="wood-grain-light wood-grain-c wood-grain-faded bg-[var(--light-wood)] px-5 py-2 sm:py-4 md:px-16 lg:px-5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 border-t border-[var(--line)] pt-2 text-center sm:flex-row sm:gap-2 sm:pt-3 sm:text-left">
        <Image src="/logo.png" alt="萱仔甜點" width={28} height={28} className="size-7 rounded-full sm:size-8" />
        <p className="text-[11px] leading-4 text-[var(--muted-text)] sm:text-xs sm:leading-5">
          © 2024 <span className="font-black text-[var(--wood)]">萱仔甜點</span> S.Z Dessert. All rights reserved. Designed by{" "}
          <span className="font-black text-[var(--wood)]">Michelin Yu</span>.
        </p>
      </div>
    </footer>
  )
}
