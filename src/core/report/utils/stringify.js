'use strict'

const { dump: yamlDump } = require('js-yaml')

// Stringify value, prettifying it to YAML if it's an object or an array
const stringifyValue = function(value) {
  if (typeof value !== 'object' || value === null) {
    return String(value)
  }

  const string = yamlDump(value, YAML_OPTS)
  const stringA = string.replace(/\n$/u, '')

  // Value should be on next line, even if it's a single property
  // unless it's an empty object or array
  if (['{}', '[]'].includes(stringA)) {
    return stringA
  }

  return `\n${stringA}`
}

const YAML_OPTS = { noRefs: true }

module.exports = {
  stringifyValue,
}
