import { createServerFn } from '@tanstack/react-start'
import type {
  CreateCreditCardDTO,
  CreateCreditCardTransactionDTO,
  CreditCard,
  CreditCardTransaction,
  UpdateCreditCardDTO,
  UpdateCreditCardTransactionDTO,
} from './types'
import { prisma } from '@/lib/db'

export const createCreditCardFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateCreditCardDTO

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
  const cards = await prisma.creditCard.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      transactions: true,
    },
  })

  return cards.map((card) => ({
    ...card,
    usedLimit: card.transactions.reduce((sum, t) => sum + t.amount, 0),
  })) as Array<CreditCard & { usedLimit: number }>
})

export const getCreditCardByIdFn = createServerFn({ method: 'GET' }).handler(async (ctx: any) => {
  const { cardId } = ctx.data as { cardId: string }

  const card = await prisma.creditCard.findUnique({
    where: { id: cardId },
    include: {
      transactions: {
        orderBy: { date: 'desc' },
        include: { category: true },
      },
    },
  })

  if (!card) return null

  return {
    ...card,
    usedLimit: card.transactions.reduce((sum, t) => sum + t.amount, 0),
  } as CreditCard & { usedLimit: number; transactions: Array<CreditCardTransaction> }
})

export const createCreditCardTransactionFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as CreateCreditCardTransactionDTO

  const transaction = await prisma.creditCardTransaction.create({
    data: {
      description: payload.description,
      amount: payload.amount,
      creditCardId: payload.creditCardId,
      date: payload.date ? new Date(payload.date) : new Date(),
      installments: payload.installments || 1,
      currentInstallment: 1,
      categoryId: payload.categoryId,
    },
  })

  return transaction as unknown as CreditCardTransaction
})

export const getCreditCardTransactionsFn = createServerFn({ method: 'GET' }).handler(async (ctx: any) => {
  const { cardId } = ctx.data as { cardId: string }

  const transactions = await prisma.creditCardTransaction.findMany({
    where: { creditCardId: cardId },
    orderBy: { date: 'desc' },
    include: { category: true },
  })

  return transactions as unknown as Array<CreditCardTransaction>
})

export const deleteCreditCardTransactionFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { transactionId } = ctx.data as { transactionId: string }

  await prisma.creditCardTransaction.delete({
    where: { id: transactionId },
  })

  return { success: true }
})

export const updateCreditCardTransactionFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as UpdateCreditCardTransactionDTO

  const transaction = await prisma.creditCardTransaction.update({
    where: { id: payload.id },
    data: {
      description: payload.description,
      amount: payload.amount,
      date: payload.date ? new Date(payload.date) : undefined,
      installments: payload.installments,
      categoryId: payload.categoryId,
    },
  })

  return transaction as unknown as CreditCardTransaction
})

export const updateCreditCardFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as UpdateCreditCardDTO

  const card = await prisma.creditCard.update({
    where: { id: payload.id },
    data: {
      name: payload.name,
      limit: payload.limit,
      closingDay: payload.closingDay,
      dueDay: payload.dueDay,
    },
  })

  return card as CreditCard
})

export const deleteCreditCardFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { cardId } = ctx.data as { cardId: string }

  await prisma.creditCard.delete({
    where: { id: cardId },
  })

  return { success: true }
})
