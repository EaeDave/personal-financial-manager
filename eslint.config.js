//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['.agent/**', '.gemini/**', '.output/**', 'dist/**', 'node_modules/**', '.next/**'],
  },
  ...tanstackConfig,
]
