import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { updateCategoryFn } from '../functions'
import type { Category } from '../types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EditCategoryDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [name, setName] = useState(category.name)

  const mutation = useMutation({
    mutationFn: (newName: string) => (updateCategoryFn as any)({ data: { id: category.id, name: newName } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onOpenChange(false)
    },
  })

  const handleSave = () => {
    if (!name || name === category.name) return
    mutation.mutate(name)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('categories.editTitle')}</DialogTitle>
          <DialogDescription>{t('categories.editDesc')}</DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Label htmlFor='name'>{t('categories.form.name')}</Label>
          <Input id='name' value={name} onChange={(e) => setName(e.target.value)} className='mt-2' />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? t('common.processing') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
