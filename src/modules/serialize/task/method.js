'use strict'

const METHODS = require('methods')

const { TestOpenApiError } = require('../../../errors')

// Validate `task.call.method` and add default value
const normalizeMethod = function({ call, call: { method = DEFAULT_METHOD } }) {
  validateMethod({ method })

  return { ...call, method }
}

const DEFAULT_METHOD = 'GET'

const validateMethod = function({ method }) {
  if (METHODS.includes(method.toLowerCase())) {
    return
  }

  throw new TestOpenApiError(`HTTP method '${method}' does not exist`, {
    property: 'call.method',
    actual: method,
  })
}

module.exports = {
  normalizeMethod,
}