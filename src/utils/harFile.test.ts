import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { loadHarFromFile, loadHarFromString } from './harFile'

describe('harFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadHarFromFile', () => {
    it('read valid HAR file', async () => {
      const mockHarContent = getValidHarContent()
      const mockFile = createMockFile(JSON.stringify(mockHarContent))

      const result = await loadHarFromFile(mockFile)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.log.entries).toEqual(mockHarContent.log.entries)
      }
    })

    it('read invalid HAR file', async () => {
      const mockHarContent = getInvalidHarContent()
      const mockFile = createMockFile(JSON.stringify(mockHarContent))

      const result = await loadHarFromFile(mockFile)

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ZodError)
      }
    })
  })

  describe('loadHarFromString', () => {
    it('read valid HAR string', async () => {
      const mockHarContent = getValidHarContent()
      const mockHarString = JSON.stringify(mockHarContent)

      const result = await loadHarFromString(mockHarString)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.log.entries).toEqual(mockHarContent.log.entries)
      }
    })

    it('read invalid HAR string', async () => {
      const mockHarContent = getInvalidHarContent()
      const mockHarString = JSON.stringify(mockHarContent)

      const result = await loadHarFromString(mockHarString)

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ZodError)
      }
    })

    it('handles invalid JSON string gracefully', async () => {
      const invalidJson = '{"log": { "version": "1.2" '
      const result = await loadHarFromString(invalidJson)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(SyntaxError)
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

function getValidHarContent() {
  return { log: { version: '1.2', creator: { name: 'Demo HAR Generator', version: '2.0' }, entries: [{ startedDateTime: '2024-11-12T10:15:30.123Z', time: 145, request: { method: 'POST', url: 'https://api.shop.example.com/v1/products', httpVersion: 'HTTP/2.0', headers: [{ name: 'Host', value: 'api.shop.example.com' }, { name: 'Content-Type', value: 'application/json' }, { name: 'Accept', value: 'application/json' }, { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }, { name: 'X-Request-ID', value: 'req-001-abc' }, { name: 'User-Agent', value: 'ShopApp/2.1.0 (iOS 17.0)' }], queryString: [], cookies: [{ name: 'session_id', value: 'sess_abc123xyz' }], postData: { mimeType: 'application/json', text: '{"name":"Premium Wireless Headphones","description":"High-quality noise-cancelling headphones with 30-hour battery life","price":299.99,"currency":"USD","category":{"id":"electronics","subcategory":"audio"},"specifications":{"brand":"AudioTech","model":"AT-5000","color":"Matte Black","weight":"250g","features":["Active Noise Cancellation","Bluetooth 5.2","USB-C Charging","Foldable Design"]},"inventory":{"stock":150,"warehouse":"US-EAST-1","available":true},"images":[{"url":"https://cdn.example.com/products/at5000-front.jpg","type":"main"},{"url":"https://cdn.example.com/products/at5000-side.jpg","type":"gallery"}],"metadata":{"created_by":"admin@example.com","tags":["wireless","premium","audio"],"seo":{"title":"Premium Wireless Headphones - AudioTech AT-5000","description":"Shop the best wireless headphones","keywords":["headphones","wireless","noise-cancelling"]}}}' }, headersSize: 345, bodySize: 987 }, response: { status: 201, statusText: 'Created', httpVersion: 'HTTP/2.0', headers: [{ name: 'Content-Type', value: 'application/json; charset=utf-8' }, { name: 'Location', value: '/v1/products/prod_5a8f9b2c' }, { name: 'X-RateLimit-Limit', value: '1000' }, { name: 'X-RateLimit-Remaining', value: '999' }, { name: 'X-Request-ID', value: 'req-001-abc' }, { name: 'ETag', value: 'W/"abc123def456"' }], cookies: [], content: { size: 1124, mimeType: 'application/json', text: '{"id":"prod_5a8f9b2c","name":"Premium Wireless Headphones","description":"High-quality noise-cancelling headphones with 30-hour battery life","price":299.99,"currency":"USD","category":{"id":"electronics","subcategory":"audio"},"specifications":{"brand":"AudioTech","model":"AT-5000","color":"Matte Black","weight":"250g","features":["Active Noise Cancellation","Bluetooth 5.2","USB-C Charging","Foldable Design"]},"inventory":{"stock":150,"warehouse":"US-EAST-1","available":true},"images":[{"url":"https://cdn.example.com/products/at5000-front.jpg","type":"main"},{"url":"https://cdn.example.com/products/at5000-side.jpg","type":"gallery"}],"metadata":{"created_by":"admin@example.com","tags":["wireless","premium","audio"],"seo":{"title":"Premium Wireless Headphones - AudioTech AT-5000","description":"Shop the best wireless headphones","keywords":["headphones","wireless","noise-cancelling"]}},"created_at":"2024-11-12T10:15:30Z","updated_at":"2024-11-12T10:15:30Z","status":"active"}' }, redirectURL: '', headersSize: 298, bodySize: 1124 }, cache: {}, timings: { blocked: 2, dns: 15, connect: 25, send: 3, wait: 92, receive: 8, ssl: 22 } }] } }
}

function getInvalidHarContent() {
  return { log: { creator: { name: 'Test' } } }
}
