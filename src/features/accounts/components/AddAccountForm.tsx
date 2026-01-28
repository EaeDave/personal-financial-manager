import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createAccountFn } from '../functions'
import type { AccountType } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AddAccountForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('checking')
  const [balance, setBalance] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      // Validation could happen here or be passed
      return await createAccountFn({
        data: {
          name,
          type,
          balance: Number(balance) || 0,
        },
      } as any)
    },
    onSuccess: () => {
      navigate({ to: '/accounts' })
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
        <CardTitle>{t('accounts.addAccount')}</CardTitle>
        <CardDescription>{t('accounts.desc', 'Enter account details below.')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='name'>{t('accounts.form.name', 'Name')}</Label>
              <Input
                id='name'
                placeholder='e.g. Main Checking'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='type'>{t('accounts.form.type', 'Type')}</Label>
              <Select value={type} onValueChange={(val: AccountType) => setType(val)}>
                <SelectTrigger id='type'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='checking'>{t('accounts.types.checking')}</SelectItem>
                  <SelectItem value='savings'>{t('accounts.types.savings')}</SelectItem>
                  <SelectItem value='investment'>{t('accounts.types.investment')}</SelectItem>
                  <SelectItem value='cash'>{t('accounts.types.cash')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='balance'>{t('accounts.form.initialBalance', 'Initial Balance')}</Label>
              <Input
                id='balance'
                type='number'
                placeholder='0.00'
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                step='0.01'
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            type='button'
            onClick={() => {
              navigate({ to: '/accounts' })
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
