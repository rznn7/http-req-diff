import type { HarFile } from '~/models/har-schema'
import { describe, expect, it } from 'vitest'
import { createHttpTransactionsFromHar } from './httpTransactionFactory'

describe('useRequestFactory', () => {
  it('fromHarFile', () => {
    const mockHarFile: HarFile = {
      log: {
        entries: [],
      },
    }

    const result = createHttpTransactionsFromHar(mockHarFile)
    expect(result).toHaveLength(0)
  })
})
