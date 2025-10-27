<script setup lang="ts">
import type { HttpTransaction } from '~/models/httpTransaction'
import DOMPurify from 'dompurify'
import * as jsondiffpatch from 'jsondiffpatch'
import * as jsondiffpatchHtml from 'jsondiffpatch/formatters/html'
import { normalizeHarEntry } from '~/utils/normalizeHarEntry'
import 'jsondiffpatch/formatters/styles/html.css'

const props = defineProps<{ transactions: [HttpTransaction, HttpTransaction] | undefined }>()

const leftTransaction = computed(() => {
  const left = props.transactions?.[0]
  return left ? { ...left, rawData: normalizeHarEntry(left.rawData) } : undefined
})

const rightTransaction = computed(() => {
  const right = props.transactions?.[1]
  return right ? { ...right, rawData: normalizeHarEntry(right.rawData) } : undefined
})

const formattedDiff = computed(() => {
  if (!leftTransaction.value || !rightTransaction.value) {
    return undefined
  }
  const [left, right] = [leftTransaction.value.rawData, rightTransaction.value.rawData]
  const delta = jsondiffpatch.diff(left, right)
  const formattedHtml = jsondiffpatchHtml.format(delta, left)
  return formattedHtml ? DOMPurify.sanitize(formattedHtml) : undefined
})
</script>

<template>
  <Card class="border-1 border-surface rounded-md! overflow-hidden">
    <template #content>
      <div
        class="flex-1 max-h-[80vh] overflow-auto border-1 border-surface-600 rounded-md  bg-surface-100 dark:bg-surface-950"
      >
        <div class="p-4 font-mono text-color">
          <div v-html="formattedDiff" />
        </div>
      </div>
    </template>
  </Card>
</template>

<style lang="css">
.jsondiffpatch-delta {
  font-family: unset;
  font-size: 14px;

  pre {
    font-family: unset;
    font-size: 14px;
  }
}

/* Light theme styles */
.jsondiffpatch-deleted {
  pre {
    background: var(--p-red-100);
    text-decoration: none;
  }

  .jsondiffpatch-property-name {
    background: var(--p-red-100);
    text-decoration: none;
  }
}

.jsondiffpatch-modified {
  .jsondiffpatch-left-value pre {
    background: var(--p-red-100);
    text-decoration: none;
  }

  .jsondiffpatch-right-value pre {
    background: var(--p-green-100);
  }
}

.jsondiffpatch-added {
  .jsondiffpatch-value pre {
    background: var(--p-green-100);
  }

  .jsondiffpatch-property-name {
    background: var(--p-green-100);
  }
}

/* Dark theme styles */
.hrd-dark {
  .jsondiffpatch-deleted {
    pre {
      background: var(--p-red-950);
      text-decoration: none;
    }

    .jsondiffpatch-property-name {
      background: var(--p-red-950);
      text-decoration: none;
    }
  }

  .jsondiffpatch-modified {
    .jsondiffpatch-left-value pre {
      background: var(--p-red-950);
      text-decoration: none;
    }

    .jsondiffpatch-right-value pre {
      background: var(--p-green-950);
    }
  }

  .jsondiffpatch-added {
    .jsondiffpatch-value pre {
      background: var(--p-green-950);
    }

    .jsondiffpatch-property-name {
      background: var(--p-green-950);
    }
  }
}
</style>
