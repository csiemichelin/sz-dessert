import { NextRequest, NextResponse } from "next/server"
import reviewsData from "@/data/reviews.json"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ScrapedReview = {
  name: string
  role: string
  initials: string
  avatarUrl?: string
  text: string
  rating: number
  timeAgo: string
}

type CacheShape = {
  expiresAt: number
  reviews: ScrapedReview[]
}

const PLACE_URL =
  "https://www.google.com/maps/place/%E8%90%B1%E4%BB%94%E7%94%9C%E9%BB%9E%E5%92%96%E5%95%A1%E5%BB%B3%EF%BC%88%E5%9B%9B%E4%BA%94%E6%9C%88%E5%85%AC%E4%BC%91%EF%BC%89/data=!4m2!3m1!1s0x0:0x46feae3dadfbb116"

const MAX_FETCH_COUNT = 20
const CACHE_TTL_MS = 1000 * 60 * 30

const fallbackReviews = reviewsData.reviews as ScrapedReview[]

let cache: CacheShape | null = null

function clampPositiveInt(raw: string | null, fallback: number) {
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return parsed
}

async function scrapeGoogleReviews(limit: number): Promise<ScrapedReview[]> {
  const playwright = (await new Function('return import("playwright")')()) as any
  const browser = await playwright.chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--lang=zh-TW",
    ],
  })

  try {
    const context = await browser.newContext({
      locale: "zh-TW",
      viewport: { width: 1440, height: 900 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      extraHTTPHeaders: { "Accept-Language": "zh-TW,zh;q=0.9" },
    })

    // Hide webdriver flag
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined })
    })

    const page = await context.newPage()

    // Go directly to the reviews tab via URL
    const reviewsUrl = PLACE_URL.replace("/data=", "/reviews/data=")
    await page.goto(reviewsUrl, { waitUntil: "domcontentloaded", timeout: 60000 })

    // Handle cookie consent
    for (const selector of ['button:has-text("全部接受")', 'button:has-text("Accept all")']) {
      const btn = page.locator(selector).first()
      if ((await btn.count()) > 0) {
        await btn.click({ timeout: 2000 }).catch(() => undefined)
        break
      }
    }

    await page.waitForTimeout(3000)

    // If reviews tab not in view, click the reviews tab
    const reviewTab = page
      .locator('[role="tab"]').filter({ hasText: /評論|Reviews/i }).first()
    if ((await reviewTab.count()) > 0) {
      await reviewTab.click({ timeout: 5000 }).catch(() => undefined)
      await page.waitForTimeout(2000)
    }

    // Sort by newest so we get more variety; then switch to highest-rated
    const sortBtn = page.locator('button[aria-label*="排序"], button[data-value="sort"]').first()
    if ((await sortBtn.count()) > 0) {
      await sortBtn.click({ timeout: 3000 }).catch(() => undefined)
      await page.waitForTimeout(500)
      const highestRated = page.locator('[role="menuitemradio"]:has-text("評分最高"), [role="option"]:has-text("評分最高")').first()
      if ((await highestRated.count()) > 0) {
        await highestRated.click({ timeout: 3000 }).catch(() => undefined)
        await page.waitForTimeout(2000)
      }
    }

    // Google Maps markup changes often; try multiple containers and allow fallback scrolling.
    const feedSelectors = [
      'div[role="feed"]',
      'div.m6QErb[aria-label*="評論"]',
      'div.m6QErb[aria-label*="reviews" i]',
    ]

    let feed: ReturnType<typeof page.locator> | null = null
    for (const selector of feedSelectors) {
      const candidate = page.locator(selector).first()
      if ((await candidate.count()) > 0) {
        feed = candidate
        break
      }
    }

    if (feed) {
      await feed.waitFor({ state: "visible", timeout: 25000 }).catch(() => undefined)
    } else {
      await page.waitForSelector('div.jftiEf, div[data-review-id]', { timeout: 25000 }).catch(() => undefined)
    }

    const resultsMap = new Map<string, ScrapedReview>()

    for (let i = 0; i < 24; i++) {
      const batch = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll("div.jftiEf, div[data-review-id]"))
        return cards
          .map((card) => {
            const name =
              card.querySelector<HTMLElement>(".d4r55")?.innerText?.trim() ??
              card.querySelector<HTMLElement>(".WNxzHc")?.innerText?.trim() ??
              ""

            const role =
              card.querySelector<HTMLElement>(".RfnDt")?.innerText?.trim() ??
              "Google 評論"

            const text =
              card.querySelector<HTMLElement>(".wiI7pd")?.innerText?.trim() ??
              card.querySelector<HTMLElement>(".MyEned")?.innerText?.trim() ??
              ""

            const timeAgo =
              card.querySelector<HTMLElement>(".rsqaWe")?.innerText?.trim() ??
              card.querySelector<HTMLElement>("span")?.innerText?.trim() ??
              ""

            const ratingLabel =
              card.querySelector<HTMLElement>('span.kvMYJc[aria-label]')?.getAttribute("aria-label") ?? ""
            const ratingMatch = ratingLabel.match(/(\d+(?:\.\d+)?)/)
            const rating = ratingMatch ? Number(ratingMatch[1]) : 0

            return { name, role, text, rating, timeAgo }
          })
          .filter((item) => item.name && item.text && item.rating === 5)
      })

      for (const item of batch) {
        const initials = item.name.slice(0, 1)
        const key = `${item.name}|${item.text.slice(0, 40)}`

        if (!resultsMap.has(key)) {
          resultsMap.set(key, {
            name: item.name,
            role: item.role || "Google 評論",
            initials,
            text: item.text,
            rating: 5,
            timeAgo: item.timeAgo || "近期",
          })
        }
      }

      if (resultsMap.size >= limit) break

      if (feed) {
        await feed.evaluate((el: HTMLElement) => {
          el.scrollBy({ top: 1400, behavior: "auto" })
        })
      } else {
        await page.mouse.wheel(0, 1400)
      }
      await page.waitForTimeout(900)
    }

    const sorted = Array.from(resultsMap.values())
    return sorted.slice(0, limit)
  } finally {
    await browser.close()
  }
}

async function getReviews(limit: number): Promise<ScrapedReview[]> {
  const now = Date.now()

  if (cache && cache.expiresAt > now && cache.reviews.length >= 1) {
    return cache.reviews.slice(0, limit)
  }

  try {
    const reviews = await scrapeGoogleReviews(MAX_FETCH_COUNT)
    if (reviews.length > 0) {
      cache = { expiresAt: now + CACHE_TTL_MS, reviews }
      return reviews.slice(0, limit)
    }
  } catch (err) {
    console.error("[google-reviews] scrape failed:", err)
  }

  // Don't cache fallback so next request retries
  return fallbackReviews.slice(0, limit)
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const page = clampPositiveInt(url.searchParams.get("page"), 1)
  const pageSize = clampPositiveInt(url.searchParams.get("pageSize"), 5)
  const limit = Math.min(clampPositiveInt(url.searchParams.get("limit"), MAX_FETCH_COUNT), MAX_FETCH_COUNT)

  const reviews = await getReviews(limit)
  const total = reviews.length

  const start = (page - 1) * pageSize
  const paged = reviews.slice(start, start + pageSize)

  return NextResponse.json({
    ok: true,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    reviews: paged,
  })
}
