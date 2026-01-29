import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Calendar, CreditCard as CardIcon, TrendingUp, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getCreditCardsFn } from '../functions'
import type { CreditCard } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useSettings } from '@/lib/settings-context'

export function CreditCardsList() {
  const { t } = useTranslation()
  const { formatCurrency } = useSettings()
  const { data: cards } = useSuspenseQuery({
    queryKey: ['credit-cards'],
    queryFn: () => getCreditCardsFn(),
  })

  if (cards.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>{t('cards.noCards')}</h2>
          <p className='text-muted-foreground'>{t('cards.noCardsDesc')}</p>
        </div>
        <Link to='/cards/new'>
          <Button>{t('cards.addCard')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold tracking-tight'>{t('cards.title')}</h2>
        <Link to='/cards/new'>
          <Button variant='outline'>{t('cards.addCard')}</Button>
        </Link>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {cards.map((card: CreditCard & { usedLimit: number }) => {
          const usagePercent = Math.min((card.usedLimit / card.limit) * 100, 100)
          const available = Math.max(card.limit - card.usedLimit, 0)

          return (
            <Link key={card.id} to='/cards/$cardId' params={{ cardId: card.id }} className='block'>
              <Card className='relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer h-full'>
                <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
                  <CardIcon size={64} />
                </div>
                <CardHeader>
                  <CardTitle className='text-xl'>{card.name}</CardTitle>
                  <CardDescription>{t('cards.clickToView')}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Used / Limit Display */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-xs text-muted-foreground uppercase'>
                      <span className='flex items-center gap-1'>
                        <TrendingUp size={12} /> {t('cards.used')}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Wallet size={12} /> {t('cards.limit')}
                      </span>
                    </div>
                    <div className='flex justify-between text-lg font-bold tabular-nums'>
                      <span className={usagePercent > 80 ? 'text-destructive' : 'text-foreground'}>
                        {formatCurrency(card.usedLimit)}
                      </span>
                      <span className='text-primary'>{formatCurrency(card.limit)}</span>
                    </div>
                    <Progress value={usagePercent} className='h-2' />
                    <div className='text-xs text-muted-foreground text-center'>
                      {t('cards.available')}: <span className='font-semibold'>{formatCurrency(available)}</span>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4 pt-2 border-t'>
                    <div className='space-y-1'>
                      <div className='text-[10px] text-muted-foreground uppercase flex items-center gap-1'>
                        <Calendar size={10} /> {t('cards.closing')}
                      </div>
                      <div className='text-sm font-semibold'>
                        {t('cards.day')} {card.closingDay}
                      </div>
                    </div>
                    <div className='space-y-1'>
                      <div className='text-[10px] text-muted-foreground uppercase flex items-center gap-1'>
                        <Calendar size={10} /> {t('cards.dueDate')}
                      </div>
                      <div className='text-sm font-semibold text-destructive'>
                        {t('cards.day')} {card.dueDay}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
