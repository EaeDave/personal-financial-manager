export type TransactionType = 'INCOME' | 'EXPENSE'

export interface CreateTransactionDTO {
  description: string
  amount: number
  accountId: string
  type: TransactionType
  date?: Date
}

export interface Transaction extends CreateTransactionDTO {
  id: string
  date: Date
  createdAt: Date
  updatedAt: Date
}
