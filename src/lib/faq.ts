export interface FAQ {
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    question: "Wait, you're actually 13?",
    answer: "Yep! Born in 2011. I know it sounds crazy, but age doesn't determine capability. I saw problems with existing tech and decided to solve them instead of complaining."
  },
  {
    question: "Is this actually safe for teens to use?",
    answer: "100%. That's literally why we use LiFePO₄ batteries instead of the cheaper Li-ion that can catch fire. Your parents will love the safety specs, and you'll love everything else."
  },
  {
    question: "How do I explain this to my parents?",
    answer: "Show them the safety comparison page. Then mention it's designed by someone who actually understands what you need daily. Most parents think it's pretty cool that someone your age is innovating."
  },
  {
    question: "What makes HAYAKU different from other charging backpacks?",
    answer: "Three things: 1) Created by someone who actually lives your life, 2) Uses the safest battery tech (LiFePO₄), 3) Designed for real-world student problems, not corporate boardroom guesses."
  },
  {
    question: "How does the C-Charge system work?", 
    answer: "It's a charging window on the side of the backpack. Plug your power bank inside, thread the cable through, and charge your devices without digging through your bag. Simple but genius."
  },
  {
    question: "Is it really Instagram-worthy?",
    answer: "100%. Stealth black design, clean lines, no ugly logos. It photographs perfectly and won't ruin your aesthetic. Finally, tech gear that gets that your 'gram matters."
  },
  {
    question: "What's the difference between the models?",
    answer: "HAYABUSAX1 is the base model (perfect for most students). HAYABUSAX2POWER has a built-in LiFePO₄ battery. LiFePACK is maximum capacity and safety for power users."
  },
  {
    question: "Can I trust a 13-year-old with my money?",
    answer: "Fair question! We have proper business structures, safety certifications, and a 30-day money-back guarantee. Age doesn't determine trustworthiness - actions do."
  }
]

export interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  author?: string
  tags?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    title: "From High School Hallways to CEO: My First Month",
    excerpt: "Balancing algebra tests with manufacturing calls isn't easy, but here's what I've learned...",
    date: "2025-01-15",
    slug: "first-month-as-teen-ceo",
    author: "Teo Guzel",
    tags: ["founder-story", "entrepreneurship", "gen-z"]
  },
  {
    title: "Why I Chose Safety Over Profit (And Why It Matters)", 
    excerpt: "Other brands could use safer batteries. Here's why they don't - and why we do.",
    date: "2025-01-10",
    slug: "safety-over-profit",
    author: "Teo Guzel", 
    tags: ["safety", "lifepo4", "tech"]
  },
  {
    title: "The Real Problems Adults Don't See",
    excerpt: "Dead phone anxiety, aesthetic pressure, and why current 'teen' products miss the mark entirely.",
    date: "2025-01-05",
    slug: "problems-adults-dont-see",
    author: "Teo Guzel",
    tags: ["gen-z", "problems", "design"]
  }
]