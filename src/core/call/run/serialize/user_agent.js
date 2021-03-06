'use strict'

const { version, homepage } = require('../../../../../package')

// Add `User-Agent` request header
// Can be overriden
const normalizeUserAgent = function({
  call,
  call: { 'headers.user-agent': userAgent = DEFAULT_USER_AGENT },
}) {
  return { ...call, 'headers.user-agent': userAgent }
}

const DEFAULT_USER_AGENT = `test-openapi/${version} (${homepage})`

module.exports = {
  normalizeUserAgent,
}
