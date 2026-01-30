export interface CreateCreditCardTransactionDTO {
  description: string
  amount: number
  creditCardId: string
  date?: Date
  installments?: number
  categoryId?: string | null
}

export interface UpdateCreditCardTransactionDTO {
  id: string
  description: string
  amount: number
  date?: Date
  installments?: number
  categoryId?: string | null
}

export interface CreditCardTransaction extends CreateCreditCardTransactionDTO {
  id: string
  date: Date
  installments: number
  currentInstallment: number
  createdAt: Date
  updatedAt: Date
  categoryId?: string | null
  category?: { id: string; name: string; color: string | null } | null
}
