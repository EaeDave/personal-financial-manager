import { createServerFn } from '@tanstack/react-start'
import type { CreateCreditCardDTO, CreditCard } from './types'
import { prisma } from '@/lib/db'

export const createCreditCardFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateCreditCardDTO
  console.log('Creating credit card:', payload)

  const card = await prisma.creditCard.create({
    data: {
      name: payload.name,
      limit: payload.limit,
      closingDay: payload.closingDay,
      dueDay: payload.dueDay,
    },
  })

  return card as CreditCard
})

export const getCreditCardsFn = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching credit cards')

  const cards = await prisma.creditCard.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return cards as Array<CreditCard>
})
