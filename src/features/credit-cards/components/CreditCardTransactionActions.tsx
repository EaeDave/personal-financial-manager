import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { deleteCreditCardTransactionFn, updateCreditCardTransactionFn } from '../functions'
import type { CreditCardTransaction, UpdateCreditCardTransactionDTO } from '../types'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/lib/settings-context'

interface CreditCardTransactionActionsProps {
  transaction: CreditCardTransaction
  cardId: string
}

export function CreditCardTransactionActions({ transaction, cardId }: CreditCardTransactionActionsProps) {
  const { t } = useTranslation()
  const { language } = useSettings()
  const queryClient = useQueryClient()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editForm, setEditForm] = useState<UpdateCreditCardTransactionDTO>({
    id: transaction.id,
    description: transaction.description,
    amount: transaction.amount,
    date: new Date(transaction.date),
    installments: transaction.installments,
  })

  const deleteMutation = useMutation({
    mutationFn: () => (deleteCreditCardTransactionFn as any)({ data: { transactionId: transaction.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      setShowDeleteDialog(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCreditCardTransactionDTO) => (updateCreditCardTransactionFn as any)({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card', cardId] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      setShowEditDialog(false)
    },
  })

  const handleEdit = () => {
    updateMutation.mutateAsync(editForm)
  }

  const handleDelete = () => {
    deleteMutation.mutateAsync()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil size={14} />
            {t('common.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className='text-destructive'>
            <Trash2 size={14} />
            {t('common.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.edit')}</DialogTitle>
            <DialogDescription>{t('cardTransactions.desc')}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>{t('cardTransactions.form.description')}</Label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>{t('cardTransactions.form.amount')}</Label>
                <Input
                  type='number'
                  step='0.01'
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                />
              </div>
              <div className='space-y-2'>
                <Label>{t('cardTransactions.form.installments')}</Label>
                <Input
                  type='number'
                  min='1'
                  value={editForm.installments}
                  onChange={(e) => setEditForm({ ...editForm, installments: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>{t('cardTransactions.form.date')}</Label>
              <DatePicker
                date={editForm.date}
                onDateChange={(date) => setEditForm({ ...editForm, date: date || new Date() })}
                locale={language === 'pt' ? 'pt' : 'en'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowEditDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t('common.processing') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirmDeleteTitle')}</DialogTitle>
            <DialogDescription>{t('common.confirmDeleteDesc')}</DialogDescription>
          </DialogHeader>
          <p className='py-4'>{t('common.confirmDelete')}</p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowDeleteDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? t('common.processing') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
