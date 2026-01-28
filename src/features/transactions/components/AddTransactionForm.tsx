import { useState } from 'react'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { createTransactionFn } from '../functions'
import type { CreateTransactionDTO, TransactionType } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAccountsFn } from '@/features/accounts/functions'
import { useSettings } from '@/lib/settings-context'

export function AddTransactionForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { formatCurrency } = useSettings()

  const { data: accounts } = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccountsFn(),
  })

  const [formData, setFormData] = useState<Partial<CreateTransactionDTO>>({
    type: 'EXPENSE',
    accountId: accounts[0]?.id || '',
  })

  const mutation = useMutation({
    mutationFn: (data: CreateTransactionDTO) => (createTransactionFn as any)({ data }),
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
        type: formData.type,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('transactions.title')}</CardTitle>
        <CardDescription>{t('transactions.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='description'>{t('transactions.form.description')}</Label>
            <Input
              id='description'
              placeholder={t('transactions.form.descriptionPlaceholder')}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>{t('transactions.form.amount')}</Label>
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
              <Label htmlFor='type'>{t('transactions.form.type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as TransactionType })}
              >
                <SelectTrigger id='type'>
                  <SelectValue placeholder={t('transactions.form.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='EXPENSE'>{t('transactions.form.expense')}</SelectItem>
                  <SelectItem value='INCOME'>{t('transactions.form.income')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='account'>{t('transactions.form.account')}</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger id='account'>
                <SelectValue placeholder={t('transactions.form.selectAccount')} />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({formatCurrency(account.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? t('common.processing') : t('transactions.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
