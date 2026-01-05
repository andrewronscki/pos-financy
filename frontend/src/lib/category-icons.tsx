import {
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  PawPrint,
  House,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  LucideIcon,
} from "lucide-react"

export const categoryIcons: Record<string, LucideIcon> = {
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  "tool-case": ToolCase,
  utensils: Utensils,
  "paw-print": PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  "baggage-claim": BaggageClaim,
  mailbox: Mailbox,
  "receipt-text": ReceiptText,
  // Mapeamentos legados para compatibilidade
  briefcase: BriefcaseBusiness,
  fuel: CarFront,
  heart: HeartPulse,
  "trending-up": BriefcaseBusiness,
  building: House,
}

export function getCategoryIcon(iconName: string): LucideIcon | null {
  return categoryIcons[iconName] || null
}

export function CategoryIcon({
  iconName,
  className = "h-5 w-5 text-gray-500",
}: {
  iconName: string
  className?: string
}) {
  const IconComponent = getCategoryIcon(iconName)
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

