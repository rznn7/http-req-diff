import { z } from 'zod'

const nameValuePair = z.object({
  name: z.string(),
  value: z.string(),
})

const harEntrySchema = z.object({
  startedDateTime: z.string(),
  request: z.object({
    bodySize: z.number().optional(),
    method: z.string(),
    url: z.string(),
    httpVersion: z.string().optional(),
    headers: z.array(nameValuePair),
    cookies: z.array(nameValuePair).optional(),
    queryString: z.array(nameValuePair).optional(),
    headersSize: z.number().optional(),
    postData: z.object({
      mimeType: z.string(),
      params: z.array(nameValuePair).optional(),
      text: z.string().optional(),
    }).optional(),
  }),
  response: z.object({
    status: z.number(),
    statusText: z.string(),
    httpVersion: z.string().optional(),
    headers: z.array(nameValuePair),
    cookies: z.array(nameValuePair).optional(),
    content: z.object({
      mimeType: z.string().optional(),
      size: z.number().optional(),
      text: z.string().optional(),
      encoding: z.string().optional(),
    }).optional(),
    redirectURL: z.string().optional(),
    headersSize: z.number().optional(),
    bodySize: z.number().optional(),
  }),
  cache: z.object({}).optional(),
  timings: z.object({
    blocked: z.number().optional(),
    dns: z.number().optional(),
    connect: z.number().optional(),
    ssl: z.number().optional(),
    send: z.number().optional(),
    wait: z.number().optional(),
    receive: z.number().optional(),
  }).optional(),
  time: z.number().optional(),
  _securityState: z.string().optional(),
  serverIPAddress: z.string().optional(),
  connection: z.string().optional(),
  pageref: z.string().optional(),
})

export const harSchema = z.object({
  log: z.object({
    entries: z.array(harEntrySchema),
  }),
})

export type HarEntry = z.infer<typeof harEntrySchema>
export type HarFile = z.infer<typeof harSchema>
export type NameValuePair = z.infer<typeof nameValuePair>
