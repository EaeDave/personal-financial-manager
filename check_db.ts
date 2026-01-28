import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

async function main() {
  const adapter = new PrismaLibSql({
    url: 'file:./dev.db',
  })
  const prisma = new PrismaClient({ adapter })

  try {
    const counts = await prisma.account.count()
    console.log('Account count:', counts)
    const accounts = await prisma.account.findMany()
    console.log('Accounts:', JSON.stringify(accounts, null, 2))

    const txCounts = await prisma.transaction.count()
    console.log('Transaction count:', txCounts)
  } catch (err) {
    console.error('Database check failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
