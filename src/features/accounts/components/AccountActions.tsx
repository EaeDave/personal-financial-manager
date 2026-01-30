import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { deleteAccountFn, updateAccountFn } from '../functions'
import type { Account, AccountType, UpdateAccountDTO } from '../types'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AccountActionsProps {
  account: Account
}

export function AccountActions({ account }: AccountActionsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editForm, setEditForm] = useState<UpdateAccountDTO>({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: account.balance,
  })

  const deleteMutation = useMutation({
    mutationFn: () => (deleteAccountFn as any)({ data: { accountId: account.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      setShowDeleteDialog(false)
      navigate({ to: '/accounts' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAccountDTO) => (updateAccountFn as any)({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
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
            <DialogDescription>{t('accounts.desc')}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>{t('accounts.form.name')}</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className='space-y-2'>
              <Label>{t('accounts.form.type')}</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as AccountType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='checking'>{t('accounts.types.checking')}</SelectItem>
                  <SelectItem value='savings'>{t('accounts.types.savings')}</SelectItem>
                  <SelectItem value='investment'>{t('accounts.types.investment')}</SelectItem>
                  <SelectItem value='cash'>{t('accounts.types.cash')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>{t('accounts.form.initialBalance')}</Label>
              <Input
                type='number'
                step='0.01'
                value={editForm.balance}
                onChange={(e) => setEditForm({ ...editForm, balance: Number(e.target.value) })}
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
