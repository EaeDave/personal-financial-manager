import { createServerFn } from '@tanstack/react-start'
import type { Account, CreateAccountDTO, UpdateAccountDTO } from './types'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const createAccountFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const userId = await requireAuth()
  const payload = data as CreateAccountDTO

  const account = await prisma.account.create({
    data: {
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
      userId,
    },
  })

  return account as Account
})

export const getAccountsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireAuth()

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return accounts as Array<Account>
})

export const updateAccountFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const userId = await requireAuth()
  const payload = ctx.data as UpdateAccountDTO

  const account = await prisma.account.update({
    where: { id: payload.id, userId },
    data: {
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
    },
  })

  return account as Account
})

export const deleteAccountFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const userId = await requireAuth()
  const { accountId } = ctx.data as { accountId: string }

  await prisma.account.delete({
    where: { id: accountId, userId },
  })

  return { success: true }
})
