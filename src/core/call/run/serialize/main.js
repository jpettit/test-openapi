'use strict'

const { mapValues, omitBy } = require('lodash')

const { keyToLocation, stringifyFlat } = require('../../../../utils')
const { findBodyHandler } = require('../../body')

const { normalizeContentType } = require('./content_type')
const { normalizeMethod } = require('./method')
const { normalizeUserAgent } = require('./user_agent')
const { addFetchRequestHeaders, addContentLength } = require('./extra_headers')

// Serialize request parameters
// Request headers name are only allowed lowercase:
//  - it makes matching them easier, both for other plugins and for the
//    return value.
//  - this implies server must ignore headers case
//  - other plugins modifying `request.call` must use lowercase headers
const serialize = function({ call }) {
  if (call === undefined) {
    return
  }

  const callA = normalizeCall({ call })

  const request = addFetchRequestHeaders({ call: callA })

  const requestA = omitBy(request, value => value === undefined)

  const rawRequest = mapValues(requestA, stringifyParam)

  const { request: requestB, rawRequest: rawRequestA } = addContentLength({
    request: requestA,
    rawRequest,
  })

  return { call: { ...call, request: requestB, rawRequest: rawRequestA } }
}

const normalizeCall = function({ call }) {
  const callA = normalizeContentType({ call })

  const callB = normalizeMethod({ call: callA })

  const callC = normalizeUserAgent({ call: callB })

  const callD = normalizeTimeout({ call: callC })

  return callD
}

const normalizeTimeout = function({
  call: { timeout = DEFAULT_TIMEOUT, ...call },
}) {
  return { ...call, timeout }
}

const DEFAULT_TIMEOUT = 1e6

const stringifyParam = function(value, key, call) {
  const { location } = keyToLocation({ key })
  return PARAM_STRINGIFIERS[location]({ value, call })
}

// `url`, `query` and `header` values might not be strings.
// In which case they are JSON stringified
const stringifyParamFlat = function({ value }) {
  return stringifyFlat(value)
}

// Stringify the request body according to HTTP request header `Content-Type`
const stringifyBody = function({
  value,
  call: { 'headers.content-type': contentType },
}) {
  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat } = findBodyHandler({ mime: contentType })

  return stringify(value)
}

// Keep `timeout` as an integer, and assign default value
const keepAsIs = function({ value }) {
  return value
}

const PARAM_STRINGIFIERS = {
  method: stringifyParamFlat,
  server: stringifyParamFlat,
  path: stringifyParamFlat,
  url: stringifyParamFlat,
  query: stringifyParamFlat,
  headers: stringifyParamFlat,
  body: stringifyBody,
  timeout: keepAsIs,
}

module.exports = {
  serialize,
}
