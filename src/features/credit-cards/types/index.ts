export interface CreateCreditCardDTO {
  name: string
  limit: number
  closingDay: number
  dueDay: number
}

export interface CreditCard extends CreateCreditCardDTO {
  id: string
  createdAt: string
}
