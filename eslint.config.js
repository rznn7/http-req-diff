import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    formatters: true,
    pnpm: true,
    vue: {
      overrides: {
        'vue/attributes-order': ['warn', { alphabetical: true }],
        'vue/max-attributes-per-line': ['off'],
      },
    },
  },
  {
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      ...tailwind.configs['flat/recommended'].rules,
      'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
      tailwindcss: {
        config: 'tailwind.config.js',
      },
    },
  },
)
