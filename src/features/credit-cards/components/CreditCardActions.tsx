import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { deleteCreditCardFn, updateCreditCardFn } from '../functions'
import type { CreditCard, UpdateCreditCardDTO } from '../types'
import { Button } from '@/components/ui/button'
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

interface CreditCardActionsProps {
  card: CreditCard
}

export function CreditCardActions({ card }: CreditCardActionsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editForm, setEditForm] = useState<UpdateCreditCardDTO>({
    id: card.id,
    name: card.name,
    limit: card.limit,
    closingDay: card.closingDay,
    dueDay: card.dueDay,
  })

  const deleteMutation = useMutation({
    mutationFn: () => (deleteCreditCardFn as any)({ data: { cardId: card.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      setShowDeleteDialog(false)
      navigate({ to: '/cards' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCreditCardDTO) => (updateCreditCardFn as any)({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      queryClient.invalidateQueries({ queryKey: ['credit-card', card.id] })
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
            <DialogDescription>{t('cards.desc')}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>{t('cards.form.name')}</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className='space-y-2'>
              <Label>{t('cards.limit')}</Label>
              <Input
                type='number'
                step='0.01'
                value={editForm.limit}
                onChange={(e) => setEditForm({ ...editForm, limit: Number(e.target.value) })}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>{t('cards.closing')}</Label>
                <Input
                  type='number'
                  min='1'
                  max='31'
                  value={editForm.closingDay}
                  onChange={(e) => setEditForm({ ...editForm, closingDay: Number(e.target.value) })}
                />
              </div>
              <div className='space-y-2'>
                <Label>{t('cards.dueDate')}</Label>
                <Input
                  type='number'
                  min='1'
                  max='31'
                  value={editForm.dueDay}
                  onChange={(e) => setEditForm({ ...editForm, dueDay: Number(e.target.value) })}
                />
              </div>
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
