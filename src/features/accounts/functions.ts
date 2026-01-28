import { createServerFn } from '@tanstack/react-start'
import { CreateAccountDTO, Account } from './types'

// Mock DB
const accounts: Account[] = []

export const createAccountFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateAccountDTO
  console.log('Creating account:', payload)

  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newAccount: Account = {
    ...payload,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  }

  accounts.push(newAccount)

  return newAccount
})
