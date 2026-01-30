export type AccountType = 'checking' | 'savings' | 'investment' | 'cash'

export interface CreateAccountDTO {
  name: string
  type: AccountType
  balance: number
}

export interface UpdateAccountDTO {
  id: string
  name: string
  type: AccountType
  balance: number
}

export interface Account extends CreateAccountDTO {
  id: string
  createdAt: Date
  updatedAt: Date
}
