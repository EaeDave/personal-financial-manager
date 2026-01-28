import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createCreditCardFn } from '../functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function AddCreditCardForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [limit, setLimit] = useState('')
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      return await createCreditCardFn({
        data: {
          name,
          limit: Number(limit) || 0,
          closingDay: Number(closingDay) || 1,
          dueDay: Number(dueDay) || 10,
        },
      } as any)
    },
    onSuccess: () => {
      navigate({ to: '/cards' })
    },
    onError: (error) => {
      console.error(error)
      alert(t('common.error'))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>{t('cards.addCard')}</CardTitle>
        <CardDescription>{t('cards.desc', 'Enter card details.')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='cardName'>{t('accounts.form.name', 'Name')}</Label>
              <Input
                id='cardName'
                placeholder='e.g. Visa Platinum'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='limit'>{t('cards.limit')}</Label>
              <Input
                id='limit'
                type='number'
                placeholder='0.00'
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                step='0.01'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='closingDay'>{t('cards.closing')}</Label>
                <Input
                  id='closingDay'
                  type='number'
                  min='1'
                  max='31'
                  value={closingDay}
                  onChange={(e) => setClosingDay(e.target.value)}
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='dueDay'>{t('cards.dueDate')}</Label>
                <Input
                  id='dueDay'
                  type='number'
                  min='1'
                  max='31'
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            type='button'
            onClick={() => {
              navigate({ to: '/cards' })
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? t('common.processing') : t('common.create')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
