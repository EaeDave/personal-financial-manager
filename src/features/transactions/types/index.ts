export type TransactionType = 'INCOME' | 'EXPENSE'

export interface CreateTransactionDTO {
  description: string
  amount: number
  accountId: string
  type: TransactionType
  date?: Date
  categoryId?: string | null
}

export interface UpdateTransactionDTO {
  id: string
  description: string
  amount: number
  type: TransactionType
  date?: Date
  categoryId?: string | null
}

export interface Transaction extends CreateTransactionDTO {
  id: string
  date: Date
  createdAt: Date
  updatedAt: Date
  categoryId?: string | null
  category?: { id: string; name: string; color: string | null } | null
}
