'use strict'

const { omitBy } = require('lodash')

const { TestOpenApiError } = require('../errors')
const { getPath } = require('../utils')
const { parseInput } = require('../serialize')

const { validateConfig } = require('./validate')
const DEFAULT_CONFIG = require('./defaults')

// Load and normalize configuration
const loadConfig = function({ config }) {
  validateConfig({ config })

  const configA = parseInput(config, throwParseError)

  // Apply default values
  const configB = omitBy(configA, value => value === undefined)
  const configC = { ...DEFAULT_CONFIG, ...configB }

  return configC
}

// Validate configuration is JSON and turn `undefined` strings into
// actual `undefined`
const throwParseError = function({ message, value, path }) {
  const property = getPath(['config', ...path])
  throw new TestOpenApiError(`Configuration ${message}`, { value, property })
}

module.exports = {
  loadConfig,
}
