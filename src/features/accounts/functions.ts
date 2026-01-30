import { createServerFn } from '@tanstack/react-start'
import type { Account, CreateAccountDTO, UpdateAccountDTO } from './types'
import { prisma } from '@/lib/db'

export const createAccountFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateAccountDTO

  const account = await prisma.account.create({
    data: {
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
    },
  })

  return account as Account
})

export const getAccountsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return accounts as Array<Account>
})

export const updateAccountFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as UpdateAccountDTO

  const account = await prisma.account.update({
    where: { id: payload.id },
    data: {
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
    },
  })

  return account as Account
})

export const deleteAccountFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { accountId } = ctx.data as { accountId: string }

  await prisma.account.delete({
    where: { id: accountId },
  })

  return { success: true }
})
