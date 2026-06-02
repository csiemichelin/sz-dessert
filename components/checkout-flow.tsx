"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Calendar, Truck, User, CreditCard, MapPin, Phone, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCart, type OrderInfo } from "@/lib/cart-context"

const steps = [
  { id: 1, name: "確認商品", icon: Check },
  { id: 2, name: "取貨方式", icon: Truck },
  { id: 3, name: "訂購資料", icon: User },
  { id: 4, name: "付款方式", icon: CreditCard },
  { id: 5, name: "確認訂單", icon: FileText },
]

// Generate available dates (next 14 days, excluding today and tomorrow for preparation)
function getAvailableDates() {
  const dates: string[] = []
  const today = new Date()
  for (let i = 3; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date.toISOString().split("T")[0])
  }
  return dates
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
  return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`
}

export function CheckoutFlow() {
  const router = useRouter()
  const { items, totalPrice, orderInfo, setOrderInfo, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const availableDates = getAvailableDates()

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return items.length > 0
      case 2:
        return orderInfo.pickupDate && orderInfo.deliveryMethod
      case 3:
        if (!orderInfo.name || !orderInfo.phone || !orderInfo.email) return false
        if (orderInfo.deliveryMethod === "delivery" && !orderInfo.address) return false
        return true
      case 4:
        return !!orderInfo.paymentMethod
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newOrderId = `SZ${Date.now().toString().slice(-8)}`
    setOrderId(newOrderId)
    setOrderComplete(true)
    setIsSubmitting(false)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">購物車是空的</h2>
            <p className="font-peak text-muted-foreground mb-6">先去逛逛我們的美味甜點吧!</p>
            <Button asChild>
              <Link href="/order">開始選購</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">訂單已送出!</h2>
            <p className="font-peak text-muted-foreground mb-4">感謝您的訂購</p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="font-peak text-sm text-muted-foreground mb-1">訂單編號</p>
              <p className="text-xl font-mono font-bold text-primary">{orderId}</p>
            </div>
            <div className="text-left space-y-3 mb-6 p-4 border border-border rounded-lg">
              <div className="flex justify-between">
                <span className="font-peak text-muted-foreground">取貨日期</span>
                <span className="font-medium">{orderInfo.pickupDate && formatDate(orderInfo.pickupDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-peak text-muted-foreground">取貨方式</span>
                <span className="font-medium">{orderInfo.deliveryMethod === "pickup" ? "到店自取" : "宅配到府"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-peak text-muted-foreground">付款方式</span>
                <span className="font-medium">{orderInfo.paymentMethod === "transfer" ? "銀行轉帳" : "線上付款"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-peak text-muted-foreground">訂單金額</span>
                <span className="font-bold text-primary">NT${totalPrice}</span>
              </div>
            </div>
            {orderInfo.paymentMethod === "transfer" && (
              <div className="bg-primary/10 rounded-lg p-4 mb-6 text-left">
                <p className="font-semibold text-foreground mb-2">匯款資訊</p>
                <p className="font-peak text-sm text-muted-foreground">銀行：國泰世華銀行 (013)</p>
                <p className="font-peak text-sm text-muted-foreground">帳號：123-456789-012345</p>
                <p className="font-peak text-sm text-muted-foreground">戶名：萱仔甜點</p>
                <p className="font-peak text-sm text-primary mt-2">請於 24 小時內完成匯款</p>
              </div>
            )}
            <p className="font-peak text-sm text-muted-foreground mb-6">
              我們會透過您留下的聯絡方式確認訂單與付款狀態
            </p>
            <Button asChild className="w-full" onClick={() => clearCart()}>
              <Link href="/">返回首頁</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/order" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>繼續購物</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="萱仔甜點" width={40} height={40} className="rounded-full" />
            </Link>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`font-peak text-xs mt-1 hidden sm:block ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Confirm Items */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  確認商品
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-3 border-b border-border/50 last:border-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="font-peak text-sm text-muted-foreground">數量: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">NT${item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">商品總計</span>
                  <span className="text-xl font-bold text-primary">NT${totalPrice}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Delivery Method */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    選擇取貨日期
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-peak text-sm text-muted-foreground mb-4">
                    因為是手工製作，需要 3 天前預訂
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableDates.map((date) => (
                      <Button
                        key={date}
                        variant={orderInfo.pickupDate === date ? "default" : "outline"}
                        className={`h-auto py-3 ${orderInfo.pickupDate === date ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setOrderInfo({ pickupDate: date })}
                      >
                        {formatDate(date)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    選擇取貨方式
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderInfo.deliveryMethod}
                    onValueChange={(value: "pickup" | "delivery") => setOrderInfo({ deliveryMethod: value })}
                    className="space-y-3"
                  >
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${orderInfo.deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium">到店自取</div>
                        <div className="font-peak text-sm text-muted-foreground">免運費，營業時間內取貨</div>
                      </Label>
                      <span className="font-semibold text-green-600">免運</span>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${orderInfo.deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="font-medium">宅配到府</div>
                        <div className="font-peak text-sm text-muted-foreground">冷藏配送，隔日送達</div>
                      </Label>
                      <span className="font-semibold">+NT$150</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Customer Info */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  填寫訂購資料
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    姓名 *
                  </Label>
                  <Input
                    id="name"
                    placeholder="請輸入您的姓名"
                    value={orderInfo.name || ""}
                    onChange={(e) => setOrderInfo({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    手機號碼 *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912-345-678"
                    value={orderInfo.phone || ""}
                    onChange={(e) => setOrderInfo({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={orderInfo.email || ""}
                    onChange={(e) => setOrderInfo({ email: e.target.value })}
                  />
                </div>
                {orderInfo.deliveryMethod === "delivery" && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      配送地址 *
                    </Label>
                    <Input
                      id="address"
                      placeholder="請輸入完整配送地址"
                      value={orderInfo.address || ""}
                      onChange={(e) => setOrderInfo({ address: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    備註 (選填)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="有任何特殊需求請在此告知我們"
                    value={orderInfo.notes || ""}
                    onChange={(e) => setOrderInfo({ notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment Method */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  選擇付款方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderInfo.paymentMethod}
                  onValueChange={(value: "transfer" | "online") => setOrderInfo({ paymentMethod: value })}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${orderInfo.paymentMethod === "transfer" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                      <div className="font-medium">銀行轉帳</div>
                      <div className="font-peak text-sm text-muted-foreground">訂單成立後 24 小時內完成匯款</div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${orderInfo.paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="font-medium">線上付款</div>
                      <div className="font-peak text-sm text-muted-foreground">信用卡 / LINE Pay / 街口支付</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirm Order */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  確認訂單資訊
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">訂購商品</h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>NT${item.product.price * item.quantity}</span>
                      </div>
                    ))}
                    {orderInfo.deliveryMethod === "delivery" && (
                      <div className="flex justify-between text-sm">
                        <span>運費</span>
                        <span>NT$150</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>總計</span>
                      <span className="text-primary">
                        NT${totalPrice + (orderInfo.deliveryMethod === "delivery" ? 150 : 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h4 className="font-medium mb-3">取貨資訊</h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-peak text-muted-foreground">取貨日期</span>
                      <span>{orderInfo.pickupDate && formatDate(orderInfo.pickupDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-peak text-muted-foreground">取貨方式</span>
                      <span>{orderInfo.deliveryMethod === "pickup" ? "到店自取" : "宅配到府"}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="font-medium mb-3">訂購人資訊</h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-peak text-muted-foreground">姓名</span>
                      <span>{orderInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-peak text-muted-foreground">手機</span>
                      <span>{orderInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-peak text-muted-foreground">Email</span>
                      <span>{orderInfo.email}</span>
                    </div>
                    {orderInfo.address && (
                      <div className="flex justify-between">
                        <span className="font-peak text-muted-foreground">地址</span>
                        <span>{orderInfo.address}</span>
                      </div>
                    )}
                    {orderInfo.notes && (
                      <div className="flex justify-between">
                        <span className="font-peak text-muted-foreground">備註</span>
                        <span>{orderInfo.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-medium mb-3">付款方式</h4>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <span>{orderInfo.paymentMethod === "transfer" ? "銀行轉帳" : "線上付款"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
            )}
            {currentStep < 5 ? (
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={!canProceed()}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "處理中..." : "確認送出訂單"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
