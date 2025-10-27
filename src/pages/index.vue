<script setup lang="ts">
import type { HttpTransaction } from '~/models/httpTransaction'
import { useHttpTransactionStore } from '~/composables/useHttpTransactionStore'
import { useResetDiff } from '~/composables/useResetDiff'

defineOptions({
  name: 'IndexPage',
})

const { transactions } = useHttpTransactionStore()
const { resetSignal } = useResetDiff()

const selectedTransactions = ref<[HttpTransaction, HttpTransaction] | undefined>(undefined)

watch(resetSignal, () => {
  selectedTransactions.value = undefined
})
</script>

<template>
  <div class="flex flex-col py-4 gap-4">
    <div class="flex flex-col gap-4 container mx-auto px-4 max-w-7xl">
      <UploadHarFile />
      <TransactionList v-if="transactions.length > 0" v-model:selected="selectedTransactions" />
      <TransactionDiff v-if="selectedTransactions" :transactions="selectedTransactions" />
    </div>
    <div class="flex flex-col max-w-screen px-4" />
  </div>
</template>
