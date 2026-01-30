import { createServerFn } from '@tanstack/react-start'
import type { CreateTransactionDTO, Transaction, UpdateTransactionDTO } from './types'
import { prisma } from '@/lib/db'

export const createTransactionFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as CreateTransactionDTO

  return await prisma.$transaction(async (tx) => {
    // 1. Create financial movement
    const movement = await tx.financialMovement.create({
      data: {
        description: payload.description,
        amount: payload.amount,
        type: payload.type,
        accountId: payload.accountId,
        date: payload.date ? new Date(payload.date) : new Date(),
        categoryId: payload.categoryId,
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
})

export const getTransactionsByAccountFn = createServerFn({ method: 'GET' }).handler(async (ctx: any) => {
  const { accountId } = ctx.data as { accountId: string }
  const movements = await prisma.financialMovement.findMany({
    where: { accountId },
    orderBy: { date: 'desc' },
    include: { category: true },
  })

  return movements as unknown as Array<Transaction>
})

export const deleteTransactionFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { transactionId } = ctx.data as { transactionId: string }

  return await prisma.$transaction(async (tx) => {
    // 1. Get the transaction to know the amount and type
    const transaction = await tx.financialMovement.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    // 2. Reverse the balance change
    const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount

    await tx.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    })

    // 3. Delete the transaction
    await tx.financialMovement.delete({
      where: { id: transactionId },
    })

    return { success: true }
  })
})

export const updateTransactionFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as UpdateTransactionDTO

  return await prisma.$transaction(async (tx) => {
    // 1. Get the old transaction
    const oldTransaction = await tx.financialMovement.findUnique({
      where: { id: payload.id },
    })

    if (!oldTransaction) {
      throw new Error('Transaction not found')
    }

    // 2. Reverse old balance change
    const oldBalanceChange = oldTransaction.type === 'INCOME' ? -oldTransaction.amount : oldTransaction.amount

    await tx.account.update({
      where: { id: oldTransaction.accountId },
      data: {
        balance: {
          increment: oldBalanceChange,
        },
      },
    })

    // 3. Update transaction
    const updated = await tx.financialMovement.update({
      where: { id: payload.id },
      data: {
        description: payload.description,
        amount: payload.amount,
        type: payload.type,
        date: payload.date ? new Date(payload.date) : undefined,
        categoryId: payload.categoryId,
      },
    })

    // 4. Apply new balance change
    const newBalanceChange = payload.type === 'INCOME' ? payload.amount : -payload.amount

    await tx.account.update({
      where: { id: oldTransaction.accountId },
      data: {
        balance: {
          increment: newBalanceChange,
        },
      },
    })

    return updated as unknown as Transaction
  })
})
