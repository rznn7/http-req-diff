import type { HarEntry, NameValuePair } from '~/models/harSchema'

export function normalizeHarEntry(harEntry: HarEntry) {
  const normalizedRequest = {
    ...harEntry.request,
    headers: sortNameValuePairs(harEntry.request.headers),
    cookies: sortNameValuePairs(harEntry.request.cookies),
    queryString: sortNameValuePairs(harEntry.request.queryString),
    postData: harEntry.request.postData
      ? {
          ...harEntry.request.postData,
          params: sortNameValuePairs(harEntry.request.postData.params),
          text: tryTextToJson(harEntry.request.postData.text),
        }
      : harEntry.request.postData,
  }

  const normalizedResponse = {
    ...harEntry.response,
    headers: sortNameValuePairs(harEntry.response.headers),
    cookies: sortNameValuePairs(harEntry.response.cookies),
    content: {
      text: tryTextToJson(harEntry.response.content?.text),
    },
  }

  const normalizedEntry = {
    time: harEntry.time,
    startedDateTime: harEntry.startedDateTime,

    request: {
      method: normalizedRequest.method,
      url: normalizedRequest.url,
      headers: normalizedRequest.headers,
      queryString: normalizedRequest.queryString,
      cookies: normalizedRequest.cookies,
      postData: normalizedRequest.postData,
      httpVersion: normalizedRequest.httpVersion,
      bodySize: normalizedRequest.bodySize,
      headersSize: normalizedRequest.headersSize,
    },

    response: {
      status: normalizedResponse.status,
      statusText: normalizedResponse.statusText,
      headers: normalizedResponse.headers,
      cookies: normalizedResponse.cookies,
      content: normalizedResponse.content,
      httpVersion: normalizedResponse.httpVersion,
      bodySize: normalizedResponse.bodySize,
      headersSize: normalizedResponse.headersSize,
      redirectURL: normalizedResponse.redirectURL,
    },

    timings: harEntry.timings,
    serverIPAddress: harEntry.serverIPAddress,
    connection: harEntry.connection,
    _securityState: harEntry._securityState,
    pageref: harEntry.pageref,
  }

  return normalizedEntry
}

function sortNameValuePairs(pairs: NameValuePair[] | undefined): NameValuePair[] | undefined {
  if (!pairs || pairs.length === 0) {
    return pairs
  }

  return [...pairs].sort((a, b) => a.name.localeCompare(b.name))
}

function tryTextToJson(text?: string) {
  if (!text)
    return text

  try {
    const parsedJson: unknown = JSON.parse(text)
    return parsedJson
  }
  catch {
    return text
  }
}
