import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createAccountFn } from '../functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AccountType } from '../types'

export function AddAccountForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('checking')
  const [balance, setBalance] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      // Validation could happen here or be passed
      return await createAccountFn({
        data: {
          name,
          type,
          balance: Number(balance) || 0,
        },
      })
    },
    onSuccess: (data) => {
      alert(`Account created: ${data.name}`)
      setName('')
      setBalance('')
    },
    onError: (error) => {
      console.error(error)
      alert('Failed to create account')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Add New Account</CardTitle>
        <CardDescription>Enter account details below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                placeholder='e.g. Main Checking'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='type'>Type</Label>
              <Select value={type} onValueChange={(val: AccountType) => setType(val)}>
                <SelectTrigger id='type'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='checking'>Checking</SelectItem>
                  <SelectItem value='savings'>Savings</SelectItem>
                  <SelectItem value='investment'>Investment</SelectItem>
                  <SelectItem value='cash'>Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='balance'>Initial Balance</Label>
              <Input
                id='balance'
                type='number'
                placeholder='0.00'
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                step='0.01'
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            type='button'
            onClick={() => {
              setName('')
              setBalance('')
            }}
          >
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
