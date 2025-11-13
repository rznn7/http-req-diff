import type { HarEntry } from './harSchema'

export interface HttpTransaction {
  id: string
  request: {
    method: string
    url: string
    host: string
    path: string
  }
  response: {
    statusCode: number
  }
  timestamp: Date
  rawData: HarEntry
}
