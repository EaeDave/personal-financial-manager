import * as React from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createCategoryFn, getCategoriesFn } from '../functions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface CategorySelectProps {
  value?: string | null
  onChange: (value: string) => void
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFn(),
  })

  // Manual filtering to control creation logic
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(inputValue.toLowerCase())
  )

  const createMutation = useMutation({
    mutationFn: (name: string) => (createCategoryFn as any)({ data: { name } }),
    onSuccess: (newCategory: any) => {
      queryClient.setQueryData(['categories'], (old: Array<any> | undefined) => [...(old || []), newCategory])
      onChange(newCategory.id)
      setOpen(false)
      setInputValue('')
    },
  })

  const handleCreate = () => {
    if (!inputValue) return
    createMutation.mutateAsync(inputValue)
  }

  const selectedCategory = categories.find((c) => c.id === value)

  const showCreateOption =
    inputValue.trim().length > 0 && !categories.some((c) => c.name.toLowerCase() === inputValue.trim().toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
          {selectedCategory ? selectedCategory.name : t('transactions.form.selectCategory')}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t('transactions.form.searchCategory')}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {filteredCategories.length === 0 && !showCreateOption && (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                {t('transactions.form.noCategoryFound')}
              </div>
            )}

            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  keywords={[category.name]}
                  onSelect={() => {
                    onChange(category.id)
                    setOpen(false)
                  }}
                  className='cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                >
                  <Check className={cn('mr-2 h-4 w-4', value === category.id ? 'opacity-100' : 'opacity-0')} />
                  {category.name}
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem
                  onSelect={handleCreate}
                  value={`CREATE:${inputValue}`}
                  className='cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  {t('transactions.form.createCategory')} "{inputValue}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
