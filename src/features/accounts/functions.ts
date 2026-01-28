import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/db'
import type { Account, CreateAccountDTO } from './types'

export const createAccountFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateAccountDTO
  console.log('Creating account:', payload)

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
  console.log('Fetching accounts')

  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return accounts as Array<Account>
})
