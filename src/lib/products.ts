export interface HayakuProduct {
  id: string
  name: string
  badge?: string
  description: string
  features: string[]
  price: string
  cta: string
  image?: string
  popular?: boolean
}

export const products: HayakuProduct[] = [
  {
    id: "hayabusax1",
    name: "HAYABUSAX1",
    badge: "MOST POPULAR",
    description: "The perfect starter pack for students who want to level up their daily carry game.",
    features: [
      "C-Charge window for seamless power access",
      "Fits laptops up to 15.6\" like a glove",
      "Power bank compartment (supports up to 20,000mAh)",
      "Hidden anti-theft pocket for valuables",
      "Water-resistant because life happens",
      "Instagram-worthy stealth black design"
    ],
    price: "$89 - $109 CAD",
    cta: "Pre-Order Now",
    popular: true
  },
  {
    id: "hayabusax2power",
    name: "HAYABUSAX2POWER", 
    badge: "POWER USER",
    description: "For the creators, gamers, and hustlers who never want to be caught with a dead device.",
    features: [
      "Built-in 10,000mAh LiFePO₄ battery (ultra-safe)",
      "Enhanced C-Charge system (2.4A fast charging)",
      "Removable battery (TSA airport-friendly)",
      "All HAYABUSAX1 features PLUS power independence",
      "2000+ charge cycles (basically forever)",
      "Zero thermal runaway risk (seriously safe)"
    ],
    price: "$179 - $199 CAD", 
    cta: "Pre-Order Now"
  },
  {
    id: "lifepack",
    name: "LiFePACK",
    badge: "ULTIMATE SAFETY",
    description: "When safety isn't negotiable. The most secure charging solution money can buy.",
    features: [
      "20,000mAh LiFePO₄ battery (maximum capacity)",
      "Triple safety certification (UL, CE, FCC)",
      "Emergency power mode for critical situations",
      "Military-grade durability testing",
      "Professional warranty and support",
      "Zero compromise on safety standards"
    ],
    price: "$299 - $349 CAD",
    cta: "Pre-Order Now"
  }
]