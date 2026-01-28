import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createBillFn } from '../functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BillFrequency } from '../types'

export function AddBillForm() {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [frequency, setFrequency] = useState<BillFrequency>('monthly')

  const mutation = useMutation({
    mutationFn: async () => {
      return await createBillFn({
        data: {
          description,
          amount: Number(amount) || 0,
          dueDate, // In a real app, ensure this is formatted correctly
          frequency,
        },
      })
    },
    onSuccess: (data) => {
      alert(`Bill created: ${data.description}`)
      setDescription('')
      setAmount('')
      setDueDate('')
    },
    onError: (error) => {
      console.error(error)
      alert('Failed to create bill')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Add Bill</CardTitle>
        <CardDescription>Track a new bill.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='desc'>Description</Label>
              <Input
                id='desc'
                placeholder='e.g. Rent'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='amount'>Amount</Label>
              <Input
                id='amount'
                type='number'
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step='0.01'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='dueDate'>Due Date</Label>
              <Input id='dueDate' type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='freq'>Frequency</Label>
              <Select value={frequency} onValueChange={(val: BillFrequency) => setFrequency(val)}>
                <SelectTrigger id='freq'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='monthly'>Monthly</SelectItem>
                  <SelectItem value='yearly'>Yearly</SelectItem>
                  <SelectItem value='one-time'>One Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' type='button' onClick={() => setDescription('')}>
            Cancel
          </Button>
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
