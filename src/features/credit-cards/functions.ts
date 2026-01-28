import { createServerFn } from '@tanstack/react-start'
import { CreateCreditCardDTO, CreditCard } from './types'

// Mock DB
const cards: CreditCard[] = []

export const createCreditCardFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateCreditCardDTO
  console.log('Creating credit card:', payload)

  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newCard: CreditCard = {
    ...payload,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  }

  cards.push(newCard)

  return newCard
})
