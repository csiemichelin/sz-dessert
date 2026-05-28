import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_TC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const notoSansTC = Noto_Sans_TC({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-tc"
});

export const metadata: Metadata = {
  title: '萱仔甜點 | S.Z Dessert - 手作甜點專門店',
  description: '萱仔甜點提供手作貓舌餅、乳酪球、精緻飲品等美味甜點，每一口都是幸福的滋味。甜甜吃甜點！',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

import { CartProvider } from "@/lib/cart-context"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className="bg-background">
      <body suppressHydrationWarning className={`${notoSansTC.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
