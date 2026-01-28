import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/db'
import type { CreateTransactionDTO, Transaction } from './types'

export const createTransactionFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateTransactionDTO
  console.log('Server: Creating transaction:', payload)

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Create financial movement
      const movement = await tx.financialMovement.create({
        data: {
          description: payload.description,
          amount: payload.amount,
          type: payload.type,
          accountId: payload.accountId,
          date: payload.date ? new Date(payload.date) : new Date(),
        },
      })

      // 2. Update balance
      const balanceChange = payload.type === 'INCOME' ? payload.amount : -payload.amount

      await tx.account.update({
        where: { id: payload.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      })

      return movement as unknown as Transaction
    })
  } catch (error: any) {
    console.error('Error in createTransactionFn:', error)
    if (error.code) console.error('Prisma Error Code:', error.code)
    if (error.meta) console.error('Prisma Error Meta:', error.meta)
    throw error
  }
})

export const getTransactionsByAccountFn = createServerFn({ method: 'GET' }).handler(async ({ data }: { data: any }) => {
  const { accountId } = data as { accountId: string }
  const movements = await prisma.financialMovement.findMany({
    where: { accountId },
    orderBy: { date: 'desc' },
  })

  return movements as unknown as Array<Transaction>
})
