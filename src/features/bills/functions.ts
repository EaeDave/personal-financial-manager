import { createServerFn } from '@tanstack/react-start'
import type { Bill, CreateBillDTO } from './types'
import { prisma } from '@/lib/db'

export const createBillFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const payload = ctx.data as CreateBillDTO

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
  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return bills as Array<Bill>
})
