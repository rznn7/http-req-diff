import type { HarFile } from '~/models/harSchema'
import type { HttpTransaction } from '~/models/httpTransaction'
import { v4 as uuidv4 } from 'uuid'

export function createHttpTransactionsFromHar(har: HarFile): HttpTransaction[] {
  return har.log.entries.map((harEntry) => {
    const { request, response, startedDateTime } = harEntry
    const url = new URL(request.url)
    const host = request.headers.find(
      ({ name }) => name.toLowerCase() === 'host',
    )?.value ?? url.host

    return {
      id: uuidv4(),
      request: {
        method: request.method,
        url: request.url,
        path: url.pathname + url.search,
        host,
        headers: request.headers,
      },
      response: {
        statusCode: response.status,
      },
      timestamp: new Date(startedDateTime),
      rawData: harEntry,
    }
  })
}
