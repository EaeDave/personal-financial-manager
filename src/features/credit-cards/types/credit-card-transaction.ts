export interface CreateCreditCardTransactionDTO {
  description: string
  amount: number
  creditCardId: string
  date?: Date
  installments?: number
}

export interface CreditCardTransaction extends CreateCreditCardTransactionDTO {
  id: string
  date: Date
  installments: number
  currentInstallment: number
  createdAt: Date
  updatedAt: Date
}
