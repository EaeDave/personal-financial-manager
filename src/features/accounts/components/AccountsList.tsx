import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { getAccountsFn } from '../functions'
import type { Account } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/lib/settings-context'

export function AccountsList() {
  const { t } = useTranslation()
  const { formatCurrency } = useSettings()
  const { data: accounts } = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccountsFn(),
  })

  const totalBalance = accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0)

  const formatAccountType = (type: string) => {
    return t(`accounts.types.${type}`)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (accounts.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>{t('accounts.noAccounts')}</h2>
          <p className='text-muted-foreground'>{t('accounts.noAccountsDesc')}</p>
        </div>
        <Link to='/accounts/new'>
          <Button>{t('accounts.addAccount')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Total Balance Card */}
      <Card className='border-2'>
        <CardHeader>
          <CardDescription>{t('accounts.totalBalance')}</CardDescription>
          <CardTitle className='text-4xl font-bold tabular-nums'>{formatCurrency(totalBalance)}</CardTitle>
        </CardHeader>
      </Card>

      {/* Accounts List */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-semibold tracking-tight'>{t('accounts.title')}</h2>
          <Link to='/accounts/new'>
            <Button variant='outline'>{t('accounts.addAccount')}</Button>
          </Link>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {accounts.map((account: Account) => (
            <Link
              key={account.id}
              to='/accounts/$accountId'
              params={{ accountId: account.id }}
              className='block hover:no-underline'
            >
              <Card className='hover:bg-slate-50 transition-colors cursor-pointer h-full'>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <CardTitle className='text-lg'>{account.name}</CardTitle>
                      <CardDescription>{formatAccountType(account.type)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='text-2xl font-bold tabular-nums'>{formatCurrency(account.balance)}</div>
                    <div className='text-xs text-muted-foreground'>Created {formatDate(account.createdAt)}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
