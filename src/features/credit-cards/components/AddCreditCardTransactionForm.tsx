import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { createCreditCardTransactionFn } from '../functions'
import type { CreateCreditCardTransactionDTO } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/lib/settings-context'

interface AddCreditCardTransactionFormProps {
  cardId: string
}

export function AddCreditCardTransactionForm({ cardId }: AddCreditCardTransactionFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { language } = useSettings()

  const [formData, setFormData] = useState<Partial<CreateCreditCardTransactionDTO>>({
    creditCardId: cardId,
    installments: 1,
    date: new Date(),
  })

  const mutation = useMutation({
    mutationFn: (data: CreateCreditCardTransactionDTO) => (createCreditCardTransactionFn as any)({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      queryClient.invalidateQueries({ queryKey: ['credit-card', cardId] })
      navigate({ to: '/cards/$cardId', params: { cardId } })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) {
      return
    }

    setLoading(true)
    try {
      await mutation.mutateAsync({
        description: formData.description,
        amount: Number(formData.amount),
        creditCardId: cardId,
        installments: formData.installments || 1,
        date: formData.date,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('cardTransactions.title')}</CardTitle>
        <CardDescription>{t('cardTransactions.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='description'>{t('cardTransactions.form.description')}</Label>
            <Input
              id='description'
              placeholder={t('cardTransactions.form.descriptionPlaceholder')}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>{t('cardTransactions.form.amount')}</Label>
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
              <Label htmlFor='installments'>{t('cardTransactions.form.installments')}</Label>
              <Input
                id='installments'
                type='number'
                min='1'
                max='48'
                placeholder='1'
                value={formData.installments || 1}
                onChange={(e) => setFormData({ ...formData, installments: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{t('cardTransactions.form.date')}</Label>
            <DatePicker
              date={formData.date}
              onDateChange={(date) => setFormData({ ...formData, date: date || new Date() })}
              placeholder={t('cardTransactions.form.selectDate')}
              locale={language === 'pt' ? 'pt' : 'en'}
            />
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? t('common.processing') : t('cardTransactions.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
