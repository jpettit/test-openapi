'use strict'

const { difference, capitalize } = require('lodash')

// Validation error
const throwError = function(type, message, props = {}) {
  const unknownProps = difference(Object.keys(props), PROPS[type])
  if (unknownProps.length > 0) {
    throwError('bug', `Unknown error properties ${unknownProps.join(', ')}`)
  }

  const error = new Error(message)

  // We need to directly assign to keep `Error` prototype
  Object.assign(error, { type, [ERROR_SYM]: true }, props)

  throw error
}

// Allowed properties for each error type
const PROPS = {
  bug: [],
  config: ['config', 'property'],
  specification: ['config', 'property'],
  task: ['config', 'task', 'property'],
  connect: ['config', 'task', 'request'],
  response: ['config', 'task', 'property', 'expected', 'actual', 'request', 'response'],
}

// Allow distinguishing between bugs and validation errors
const ERROR_SYM = Symbol('isValidationError')

// Return `getConfigError()`, etc. that call `throwError()` with a specific `type`
const getThrowErrors = function() {
  const funcs = Object.keys(PROPS).map(getThrowError)
  return Object.assign({}, ...funcs)
}

const getThrowError = function(type) {
  const name = `throw${capitalize(type)}Error`
  const func = throwError.bind(null, type)
  return { [name]: func }
}

const throwErrors = getThrowErrors()

module.exports = {
  ...throwErrors,
  ERROR_SYM,
}
