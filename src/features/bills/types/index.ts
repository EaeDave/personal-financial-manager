export type BillFrequency = 'monthly' | 'yearly' | 'one-time'

export interface CreateBillDTO {
  description: string
  amount: number
  dueDate: string // ISO date string or just day? Let's say full date for one-time, or just day for monthly. We'll simplify to just date for now.
  frequency: BillFrequency
}

export interface Bill extends CreateBillDTO {
  id: string
  createdAt: Date
  updatedAt: Date
}
