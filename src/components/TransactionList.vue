<script setup lang="ts">
import type { HttpTransaction } from '~/models/httpTransaction'
import { format } from 'date-fns'

const { transactions, deleteTransaction } = useHttpTransactionStore()

const selectedTransactions = defineModel<[HttpTransaction, HttpTransaction] | undefined>('selected', {
  default: undefined,
})

const internalSelection = ref<HttpTransaction[]>([])

watch(internalSelection, (newSelection) => {
  if (newSelection.length > 2) {
    internalSelection.value = newSelection.slice(-2)
  }

  if (newSelection.length === 2) {
    selectedTransactions.value = [newSelection[0], newSelection[1]]
  }
  else {
    selectedTransactions.value = undefined
  }
})

function formatTime(date: Date) {
  return format(date, 'HH:mm:ss.SSS')
}

function getStatusCodeSeverity(statusCode: number) {
  if (statusCode >= 100 && statusCode < 200)
    return 'info'
  if (statusCode >= 200 && statusCode < 300)
    return 'success'
  if (statusCode >= 300 && statusCode < 400)
    return 'warn'
  if (statusCode >= 400 && statusCode < 500)
    return 'danger'
  if (statusCode >= 500 && statusCode < 600)
    return 'danger'
  return 'secondary'
}

function getStatusCodeDescription(statusCode: number) {
  const descriptions: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    306: 'unused',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  }
  return descriptions[statusCode] ?? `HTTP ${statusCode}`
}

function deleteTransactionClicked(idToDelete: string) {
  const toDeleteIsSelected = internalSelection.value.map(t => t.id).includes(idToDelete)
  if (toDeleteIsSelected) {
    internalSelection.value = internalSelection.value.filter(t => t.id !== idToDelete)
  }

  deleteTransaction(idToDelete)
}
</script>

<template>
  <Card class="border-1 border-surface rounded-md!">
    <template #content>
      <DataTable
        v-model:selection="internalSelection" class="rounded-full text-sm" data-key="id" scroll-height="400px"
        scrollable selection-mode="multiple" size="small" :value="transactions"
      >
        <Column header="Selection">
          <template #body="{ data }: { data: HttpTransaction }">
            <Tag v-if="data.id === internalSelection.at(0)?.id" severity="contrast" value="left" />
            <Tag v-else-if="data.id === internalSelection.at(1)?.id" severity="contrast" value="right" />
            <Tag v-else severity="secondary" value="-" />
          </template>
        </Column>
        <Column field="response.statusCode" header="Status" sortable>
          <template #body="{ data }: { data: HttpTransaction }">
            <Tag
              v-tooltip="getStatusCodeDescription(data.response.statusCode)" v-tooltip.right="{
                value: getStatusCodeDescription(data.response.statusCode),
                pt: {
                  text: 'whitespace-nowrap! text-sm',
                },
              }" :severity="getStatusCodeSeverity(data.response.statusCode)" :value="data.response.statusCode"
            />
          </template>
        </Column>
        <Column field="request.method" header="Method" sortable>
          <template #body="{ data }">
            <Tag severity="secondary" :value="data.request.method" />
          </template>
        </Column>
        <Column field="request.path" header="Path" sortable />
        <Column field="request.host" header="Host" sortable>
          <template #body="{ data }: { data: HttpTransaction }">
            <span
              v-tooltip.right="{
                value: data.request.url,
                pt: {
                  text: 'whitespace-nowrap! text-sm truncate',
                  root: 'max-w-2xl!',
                },
              }"
            >{{ data.request.host }}</span>
          </template>
        </Column>
        <Column field="timestamp" header="Time" sortable>
          <template #body="{ data }: { data: HttpTransaction }">
            <span>{{ formatTime(data.timestamp) }}</span>
          </template>
        </Column>
        <Column>
          <template #body="{ data }: { data: HttpTransaction }">
            <Button
              aria-label="Delete transaction" icon="pi pi-trash" severity="secondary" size="small"
              @click="deleteTransactionClicked(data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
