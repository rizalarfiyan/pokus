import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

const arrayOrderUnique = <T extends string>(arr: T[]): T[] => {
  const uniqueArray: T[] = []
  const seen = new Set<string>()

  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item)
      uniqueArray.push(item)
    }
  }

  return uniqueArray
}

export { cn, arrayOrderUnique }
