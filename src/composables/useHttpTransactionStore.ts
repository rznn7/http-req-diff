import type { HttpTransaction } from '~/models/httpTransaction'

const transactions = ref<HttpTransaction[]>([])

export function useHttpTransactionStore() {
  function addTransaction(transaction: HttpTransaction): string {
    transactions.value.push(transaction)
    return transaction.id
  }

  function addTransactions(items: HttpTransaction[]): string[] {
    transactions.value.push(...items)
    return items.map(t => t.id)
  }

  function getTransaction(id: string): HttpTransaction | undefined {
    return transactions.value.find(t => t.id === id)
  }

  function deleteTransaction(id: string): boolean {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value.splice(index, 1)
      return true
    }
    return false
  }

  function clearTransactions(): void {
    transactions.value = []
  }

  return {
    transactions: shallowReadonly(transactions),
    addTransaction,
    addTransactions,
    getTransaction,
    deleteTransaction,
    clearTransactions,
  }
}
