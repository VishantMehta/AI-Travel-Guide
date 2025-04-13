import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getRandomDestination(): string {
  const destinations = [
    "Paris, France",
    "Tokyo, Japan",
    "Bali, Indonesia",
    "New York City, USA",
    "Rome, Italy",
    "Barcelona, Spain",
    "Santorini, Greece",
    "Kyoto, Japan",
    "London, UK",
    "Marrakech, Morocco",
  ]
  return destinations[Math.floor(Math.random() * destinations.length)]
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
