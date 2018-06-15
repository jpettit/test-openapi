'use strict'

const { isSimpleSchema } = require('../../../utils')

// Add core `reportProps`
const addCoreReportProps = function({ reportProps, task, noCore }) {
  if (noCore) {
    return reportProps
  }

  const coreReportProps = getCoreReportProps(task)
  // Merged with lower priority, and appear at beginning
  return [coreReportProps, ...reportProps]
}

// Core `reportProps` always present on error
const getCoreReportProps = function({ error = {}, error: { message, property, schema } = {} }) {
  const expected = getCoreValue(error, 'expected')
  const actual = getCoreValue(error, 'actual')

  const schemaA = getJsonSchema({ schema })

  return {
    message,
    'expected value': expected,
    'actual value': actual,
    property,
    'JSON schema': schemaA,
  }
}

const getCoreValue = function(error, name) {
  // When `error.expected|actual` is `undefined` but its key is defined, we still
  // want to report it, so we make it a string
  if (error.propertyIsEnumerable(name) && error[name] === undefined) {
    return 'undefined'
  }

  return error[name]
}

const getJsonSchema = function({ schema }) {
  // Do not print JSON schemas which are simplistic, as they do not provide extra
  // information over `Expected value`
  if (isSimpleSchema(schema)) {
    return
  }

  return schema
}

module.exports = {
  addCoreReportProps,
}
