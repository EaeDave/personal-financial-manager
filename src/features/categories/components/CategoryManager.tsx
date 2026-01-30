import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createCategoryFn, deleteCategoryFn, getCategoriesFn } from '../functions'
import { EditCategoryDialog } from './EditCategoryDialog'
import type { Category } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export function CategoryManager() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFn(),
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => (createCategoryFn as any)({ data: { name } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setCreateOpen(false)
      setNewCategoryName('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => (deleteCategoryFn as any)({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setDeletingCategory(null)
    },
  })

  const handleCreate = () => {
    if (!newCategoryName) return
    createMutation.mutate(newCategoryName)
  }

  const handleDelete = () => {
    if (!deletingCategory) return
    deleteMutation.mutate(deletingCategory.id)
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <Link to='/'>
          <Button variant='ghost' size='sm' className='gap-2 pl-2 mb-4'>
            <ArrowLeft size={16} />
            {t('common.back')}
          </Button>
        </Link>
      </div>

      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{t('categories.title')}</h2>
          <p className='text-muted-foreground'>{t('categories.desc')}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          {t('categories.create')}
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{category.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                    <Pencil className='mr-2 h-4 w-4' />
                    {t('common.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeletingCategory(category)} className='text-destructive'>
                    <Trash2 className='mr-2 h-4 w-4' />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'></div>
              <p className='text-xs text-muted-foreground'></p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('categories.createTitle')}</DialogTitle>
            <DialogDescription>{t('categories.createDesc')}</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Label htmlFor='newName'>{t('categories.form.name')}</Label>
            <Input
              id='newName'
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className='mt-2'
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? t('common.processing') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('categories.deleteTitle')}</DialogTitle>
            <DialogDescription>{t('categories.deleteDesc')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeletingCategory(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? t('common.processing') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
