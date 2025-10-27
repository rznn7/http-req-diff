import type { Result } from '~/models/utils'
import { type HarFile, harSchema } from '~/models/har-schema'

export async function loadHarFromFile(file: File): Promise<Result<HarFile>> {
  try {
    const textContent = await file.text()
    const jsonContent: unknown = JSON.parse(textContent)
    const result = harSchema.parse(jsonContent)
    return { ok: true, value: result }
  }
  catch (err) {
    return { ok: false, error: asError(err) }
  }
}

export async function loadHarFromString(str: string): Promise<Result<HarFile>> {
  try {
    const jsonContent: unknown = JSON.parse(str)
    const result = harSchema.parse(jsonContent)
    return { ok: true, value: result }
  }
  catch (err) {
    return { ok: false, error: asError(err) }
  }
}

function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}
