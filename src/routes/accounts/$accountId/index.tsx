import { ArrowDownIcon, ArrowUpIcon, Plus } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAccountsFn } from '@/features/accounts/functions'
import { getTransactionsByAccountFn } from '@/features/transactions/functions'
import { AccountActions } from '@/features/accounts/components/AccountActions'
import { TransactionActions } from '@/features/transactions/components/TransactionActions'
import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/lib/settings-context'

export const Route = createFileRoute('/accounts/$accountId/')({
  component: AccountDetailPage,
})

function AccountDetailPage() {
  const { accountId } = Route.useParams()
  const { t } = useTranslation()

  return (
    <div className='p-8 max-w-4xl mx-auto space-y-8'>
      <BackButton to='/accounts' label={t('accounts.title')} />
      <Suspense fallback={<div>{t('common.loading')}</div>}>
        <AccountDetails accountId={accountId} />
      </Suspense>

      <Suspense fallback={<div>{t('common.loading')}</div>}>
        <TransactionHistory accountId={accountId} />
      </Suspense>
    </div>
  )
}

function AccountDetails({ accountId }: { accountId: string }) {
  const { data: accounts } = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccountsFn(),
  })
  const { formatCurrency } = useSettings()
  const { t } = useTranslation()

  const account = accounts.find((a) => a.id === accountId)

  if (!account) return <div>Account not found.</div>

  return (
    <Card className='border-2'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardDescription>{account.type.toUpperCase()}</CardDescription>
            <CardTitle className='text-3xl font-bold'>{account.name}</CardTitle>
          </div>
          <div className='flex items-center gap-2'>
            <Button asChild>
              <Link to='/accounts/$accountId/transactions/new' params={{ accountId }}>
                <Plus size={16} />
                {t('dashboard.newTransaction')}
              </Link>
            </Button>
            <AccountActions account={account} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-4xl font-bold tabular-nums'>{formatCurrency(account.balance)}</div>
      </CardContent>
    </Card>
  )
}

function TransactionHistory({ accountId }: { accountId: string }) {
  const { t, i18n } = useTranslation()
  const { data: transactions } = useSuspenseQuery({
    queryKey: ['transactions', accountId],
    queryFn: () => (getTransactionsByAccountFn as any)({ data: { accountId } }),
  })
  const { formatCurrency } = useSettings()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(i18n.language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('transactions.history')}</CardTitle>
          <CardDescription>{t('transactions.noTransactions')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant='outline'>
            <Link to='/accounts/$accountId/transactions/new' params={{ accountId }}>
              <Plus size={16} />
              {t('dashboard.newTransaction')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>{t('transactions.history')}</h2>
      <div className='space-y-2'>
        {transactions.map((tx: any) => (
          <Card key={tx.id}>
            <CardContent className='p-4 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div
                  className={`p-2 rounded-full ${tx.type === `INCOME` ? `bg-green-100 text-green-600` : `bg-red-100 text-red-600`}`}
                >
                  {tx.type === 'INCOME' ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />}
                </div>
                <div>
                  <div className='font-semibold'>{tx.description}</div>
                  <div className='text-sm text-muted-foreground'>
                    {formatDate(tx.date)}
                    {tx.category && ` • ${tx.category.name}`}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div
                  className={`text-lg font-bold tabular-nums ${tx.type === `INCOME` ? `text-green-600` : `text-red-600`}`}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </div>
                <TransactionActions transaction={tx} accountId={accountId} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
