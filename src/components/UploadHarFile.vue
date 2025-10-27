<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue'
import z, { ZodError } from 'zod'
import { useHttpTransactionStore } from '~/composables/useHttpTransactionStore'
import { loadHarFromFile, loadHarFromString } from '~/utils/harFile'
import { createHttpTransactionsFromHar } from '~/utils/httpTransactionFactory'

const { add: addToast } = useToast()
const { addTransactions } = useHttpTransactionStore()

const harPastedText = ref('')
const fileUploadRef = ref()

async function onHarUploaded(event: FileUploadUploaderEvent) {
  fileUploadRef.value?.clear() // instantly delete pending file to keep displaying drag & drop box
  const [file] = Array.isArray(event.files) ? event.files : [event.files]
  const result = await loadHarFromFile(file)
  if (result.ok) {
    const transactions = createHttpTransactionsFromHar(result.value)
    addTransactions(transactions)
  }
  else {
    addToast({
      severity: 'error',
      summary: `Failed to parse "${file.name}"`,
      detail: result.error instanceof ZodError ? z.prettifyError(result.error) : result.error,
    })
  }
}

async function onHarPasted(event: ClipboardEvent) {
  const { clipboardData } = event
  if (!clipboardData)
    return

  event.preventDefault()
  harPastedText.value = ''

  const result = await loadFromClipboardData(clipboardData)

  if (result.ok) {
    const transactions = createHttpTransactionsFromHar(result.value)
    addTransactions(transactions)
  }
  else {
    addToast({
      severity: 'error',
      summary: 'Failed to parse HAR Data',
      detail: result.error instanceof ZodError ? z.prettifyError(result.error) : result.error,
    })
  }
}

async function loadFromClipboardData(clipboardData: DataTransfer) {
  const file = clipboardData.files.item(0)
  if (file) {
    return await loadHarFromFile(file)
  }
  else {
    const content = clipboardData.getData('text')
    return await loadHarFromString(content)
  }
}
</script>

<template>
  <FileUpload
    ref="fileUploadRef" accept=".har" :auto="true" class="max-w-md" custom-upload :max-file-size="1000000"
    @uploader="onHarUploaded"
  >
    <template #header="{ chooseCallback }">
      <Button icon="pi pi-plus" label="Browse" severity="secondary" @click="chooseCallback()" />
      <InputText
        v-model="harPastedText" fluid placeholder="Paste HAR here" type="text" variant="outlined"
        @paste="onHarPasted"
      />
    </template>
    <template #empty>
      <div class="flex flex-col items-center p-inputtext py-4!">
        <i class="pi pi-file-import text-muted-color text-4xl!" />
        <p class="text-muted-color ">
          Drag and drop .har file here
        </p>
      </div>
    </template>
    <template #content />
  </FileUpload>
</template>

<style scoped>
:deep(.p-fileupload-content) {
  background: transparent !important;
  border: none !important;
}

.copy-prime-input-hover-transition {
  transition:
    var(--p-inputtext-transition-duration),
    color var(--p-inputtext-transition-duration),
    border-color var(--p-inputtext-transition-duration),
    outline-color var(--p-inputtext-transition-duration),
    box-shadow var(--p-inputtext-transition-duration);
}
</style>
