import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { loadHarFromFile } from './harFile'

describe('harFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadFromFile', () => {
    it('read valid HAR file', async () => {
      const mockHarContent = { log: { entries: [] } }
      const mockFile = createMockFile(JSON.stringify(mockHarContent))

      const result = await loadHarFromFile(mockFile)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual(mockHarContent)
      }
    })

    it('read invalid HAR file', async () => {
      const mockHarContent = { log: { creator: { name: 'Test' } } }
      const mockFile = createMockFile(JSON.stringify(mockHarContent))

      const result = await loadHarFromFile(mockFile)

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ZodError)
      }
    })
  })
})

function createMockFile(content: string, filename = 'test.har'): File {
  const file = {
    name: filename,
    size: content.length,
    type: 'application/json',
    text: vi.fn().mockResolvedValue(content),
    arrayBuffer: vi.fn(),
    slice: vi.fn(),
    stream: vi.fn(),
    lastModified: Date.now(),
  } as unknown as File

  return file
}
