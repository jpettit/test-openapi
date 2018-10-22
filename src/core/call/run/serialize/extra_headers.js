'use strict'

const {
  Buffer: { byteLength },
} = require('buffer')

const {
  template: { $$env },
} = require('../../../template')

const { mapKeys } = require('lodash')

// The `node-fetch` library adds few HTTP request headers, so we add them
// to `rawRequest`
// Unfortunately the library does not allow accessing them, so we need to repeat
// its logic here and recalculate them.
const addFetchRequestHeaders = function({ call }) {
  const headers = getFetchRequestHeaders({ call })
  const headersA = mapKeys(headers, (value, name) => `headers.${name}`)
  return { ...call, ...headersA }
}

const getFetchRequestHeaders = function({
  call: {
    'headers.accept': accept = DEFAULT_ACCEPT,
    'headers.accept-encoding': acceptEncoding = DEFAULT_ACCEPT_ENCODING,
    'headers.connection': connection = DEFAULT_CONNECTION,
    'headers.authorization': authorization = $$env.AUTHORIZATION,
  },
}) {
  return { accept, 'accept-encoding': acceptEncoding, connection, authorization }
}

const DEFAULT_ACCEPT = '*/*'
const DEFAULT_ACCEPT_ENCODING = 'gzip,deflate'
const DEFAULT_CONNECTION = 'close'

// Same for `Content-Length` (must be done after body has been serialized)
const addContentLength = function({ request, rawRequest }) {
  const contentLength = getContentLength({ rawRequest })

  if (contentLength === undefined) {
    return { request, rawRequest }
  }

  const requestA = { ...request, 'headers.content-length': contentLength }
  const rawRequestA = {
    ...rawRequest,
    'headers.content-length': String(contentLength),
  }
  return { request: requestA, rawRequest: rawRequestA }
}

const getContentLength = function({ rawRequest: { method, body } }) {
  if (body != null) {
    return byteLength(body)
  }

  if (!['put', 'post'].includes(method)) {
    return
  }

  return 0
}

module.exports = {
  addFetchRequestHeaders,
  addContentLength,
}
