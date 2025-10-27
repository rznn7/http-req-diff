export function useDarkMode() {
  const isDark = ref(false)
  const icon = computed(() => isDark.value ? 'pi pi-moon' : 'pi pi-sun')

  function toggle() {
    isDark.value = document.documentElement.classList.toggle('hrd-dark')
  }

  function initialize() {
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isActiveDarkMode = document.documentElement.classList.contains('hrd-dark')

    if (prefersDarkTheme && !isActiveDarkMode) {
      toggle()
    }
    else {
      isDark.value = isActiveDarkMode
    }
  }

  initialize()

  return {
    darkModeIcon: icon,
    toggleDarkMode: toggle,
  }
}
