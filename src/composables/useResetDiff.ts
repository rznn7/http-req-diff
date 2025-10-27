const resetSignal = ref(0)

export function useResetDiff() {
  const { clearTransactions } = useHttpTransactionStore()

  function resetDiff() {
    clearTransactions()
    resetSignal.value++
  }

  return { resetDiff, resetSignal: readonly(resetSignal) }
}
