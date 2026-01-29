import { useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Calendar, CreditCard as CardIcon, Plus, TrendingUp, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getCreditCardByIdFn } from '../functions'
import type { CreditCardTransaction } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useSettings } from '@/lib/settings-context'

interface CreditCardDetailProps {
  cardId: string
}

export function CreditCardDetail({ cardId }: CreditCardDetailProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useSettings()
  const navigate = useNavigate()
  const { data: card } = useSuspenseQuery({
    queryKey: ['credit-card', cardId],
    queryFn: () => (getCreditCardByIdFn as any)({ data: { cardId } }),
  })

  const handleAddPurchase = () => {
    navigate({ to: '/cards/$cardId/transactions/new', params: { cardId } })
  }

  if (!card) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>{t('common.notFound')}</h2>
          <p className='text-muted-foreground'>{t('cards.cardNotFound')}</p>
        </div>
        <Button onClick={() => navigate({ to: '/cards' })}>{t('common.back')}</Button>
      </div>
    )
  }

  const usagePercent = Math.min((card.usedLimit / card.limit) * 100, 100)
  const available = Math.max(card.limit - card.usedLimit, 0)

  return (
    <div className='space-y-6'>
      {/* Card Summary */}
      <Card className='relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-6 opacity-5 pointer-events-none'>
          <CardIcon size={120} />
        </div>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-3xl'>{card.name}</CardTitle>
              <CardDescription>{t('cards.cardDetails')}</CardDescription>
            </div>
            <Button type='button' onClick={handleAddPurchase}>
              <Plus size={16} />
              {t('cards.addPurchase')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Usage Summary */}
          <div className='space-y-3'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span className='flex items-center gap-2'>
                <TrendingUp size={14} /> {t('cards.used')}
              </span>
              <span className='flex items-center gap-2'>
                <Wallet size={14} /> {t('cards.limit')}
              </span>
            </div>
            <div className='flex justify-between text-2xl font-bold tabular-nums'>
              <span className={usagePercent > 80 ? 'text-destructive' : 'text-foreground'}>
                {formatCurrency(card.usedLimit)}
              </span>
              <span className='text-primary'>{formatCurrency(card.limit)}</span>
            </div>
            <Progress value={usagePercent} className='h-3' />
            <div className='text-center text-muted-foreground'>
              {t('cards.available')}: <span className='font-bold text-lg'>{formatCurrency(available)}</span>
            </div>
          </div>

          {/* Card Info */}
          <div className='grid grid-cols-2 gap-6 pt-4 border-t'>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground uppercase flex items-center gap-1'>
                <Calendar size={12} /> {t('cards.closing')}
              </div>
              <div className='text-lg font-semibold'>
                {t('cards.day')} {card.closingDay}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground uppercase flex items-center gap-1'>
                <Calendar size={12} /> {t('cards.dueDate')}
              </div>
              <div className='text-lg font-semibold text-destructive'>
                {t('cards.day')} {card.dueDay}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>{t('cards.transactionHistory')}</h3>

        {card.transactions.length === 0 ? (
          <Card>
            <CardContent className='py-8'>
              <div className='text-center text-muted-foreground'>
                <p>{t('cards.noTransactions')}</p>
                <Button variant='outline' className='mt-4' onClick={handleAddPurchase}>
                  <Plus size={16} />
                  {t('cards.addFirstPurchase')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-2'>
            {card.transactions.map((transaction: CreditCardTransaction) => (
              <Card key={transaction.id}>
                <CardContent className='py-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium'>{transaction.description}</div>
                      <div className='text-sm text-muted-foreground'>
                        {new Date(transaction.date).toLocaleDateString()}
                        {transaction.installments > 1 && (
                          <span className='ml-2'>
                            ({transaction.currentInstallment}/{transaction.installments})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-lg font-bold tabular-nums text-destructive'>
                      -{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
