import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/db'
import type { Bill, CreateBillDTO } from './types'

export const createBillFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as CreateBillDTO
  console.log('Creating bill:', payload)

  const bill = await prisma.bill.create({
    data: {
      description: payload.description,
      amount: payload.amount,
      dueDate: payload.dueDate,
      frequency: payload.frequency,
    },
  })

  return bill as Bill
})

export const getBillsFn = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching bills')

  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return bills as Array<Bill>
})
