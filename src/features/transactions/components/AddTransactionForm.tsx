import { useState } from 'react'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createTransactionFn } from '../functions'
import type { CreateTransactionDTO, TransactionType } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAccountsFn } from '@/features/accounts/functions'

export function AddTransactionForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const { data: accounts } = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccountsFn(),
  })

  const [formData, setFormData] = useState<Partial<CreateTransactionDTO>>({
    type: 'EXPENSE',
    accountId: accounts[0]?.id || '',
  })

  const mutation = useMutation({
    mutationFn: (data: CreateTransactionDTO) => createTransactionFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      navigate({ to: '/accounts' })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.accountId || !formData.type) {
      return
    }

    setLoading(true)
    try {
      await mutation.mutateAsync({
        description: formData.description,
        amount: Number(formData.amount),
        accountId: formData.accountId,
        type: formData.type as TransactionType,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
        <CardDescription>Record a new income or expense.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              placeholder='Uber, Grocery, Salary...'
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount</Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                placeholder='0.00'
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='type'>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as TransactionType })}
              >
                <SelectTrigger id='type'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='EXPENSE'>Expense</SelectItem>
                  <SelectItem value='INCOME'>Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='account'>Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger id='account'>
                <SelectValue placeholder='Select account' />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} (
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Processing...' : 'Create Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
