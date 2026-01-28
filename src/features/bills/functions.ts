import { createServerFn } from '@tanstack/react-start'
import { CreateBillDTO, Bill } from './types'

// Mock DB
const bills: Bill[] = []

export const createBillFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateBillDTO
  console.log('Creating bill:', payload)

  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newBill: Bill = {
    ...payload,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  }

  bills.push(newBill)

  return newBill
})
