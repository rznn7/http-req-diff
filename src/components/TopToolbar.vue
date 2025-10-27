<script setup lang="ts">
import { useResetDiff } from '~/composables/useResetDiff'

const { darkModeIcon, toggleDarkMode } = useDarkMode()
const { resetDiff } = useResetDiff()

const endButtons = computed<{ id: string, icon: string, ariaLabel: string, onClick: () => void }[]>(() => [
  {
    id: 'dark-mode-btn',
    icon: darkModeIcon.value,
    ariaLabel: 'Dark mode button',
    onClick: toggleDarkMode,
  },
  {
    id: 'github-button',
    icon: 'pi pi-github',
    ariaLabel: 'Github button',
    onClick: () => {
      window.open('https://github.com/rznn7/http-req-diff', '_blank')
    },
  },
])
</script>

<template>
  <Toolbar
    class="sticky top-0 z-50 rounded-none! border-0! border-b! border-surface-200! dark:border-surface-700! backdrop-blur-md! bg-surface-0/70! dark:bg-surface-950/70!"
  >
    <template #start>
      <div class="inline-flex items-center gap-8">
        <div class="inline-flex items-center gap-2">
          <i class="pi pi-wave-pulse text-primary text-xl!" />
          <h1 class="text-xl">
            HTTP Request Diff
          </h1>
        </div>
        <Button label="New diff" size="small" @click="resetDiff" />
      </div>
    </template>
    <template #center>
      <div />
    </template>
    <template #end>
      <ul class="inline-flex gap-2">
        <li v-for="button in endButtons" :key="button.id">
          <Button
            :aria-label="button.ariaLabel" :icon="button.icon" severity="secondary" size="small"
            @click="button.onClick"
          />
        </li>
      </ul>
    </template>
  </Toolbar>
</template>
