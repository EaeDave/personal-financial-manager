export interface CreateCreditCardDTO {
  name: string
  limit: number
  closingDay: number
  dueDay: number
}

export interface UpdateCreditCardDTO {
  id: string
  name: string
  limit: number
  closingDay: number
  dueDay: number
}

export interface CreditCard extends CreateCreditCardDTO {
  id: string
  createdAt: Date
  updatedAt: Date
}

export * from './credit-card-transaction'
