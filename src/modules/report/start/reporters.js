'use strict'

const { validateFromSchema } = require('../../../validation')

const { loadReporter } = require('./load')
const REPORTER_SCHEMA = require('./reporter_schema')

// Get `startData.report.reporters`
const getReporters = function({ config }) {
  const names = getNames({ config })

  const reporters = names.map(getReporter)
  return reporters
}

// Reporters are specified by using their name in `config.report.REPORTER`
const getNames = function({ config: { report = {} } }) {
  const names = Object.keys(report)

  // When `config.report` is `undefined` or an empty object
  if (names.length === 0) {
    return DEFAULT_REPORTERS
  }

  return names
}

const DEFAULT_REPORTERS = ['pretty']

const getReporter = function(name) {
  const reporter = loadReporter({ name })

  validateModule({ reporter })

  return reporter
}

// Validate reporter is valid module
const validateModule = function({ reporter, reporter: { name } }) {
  const { error } = validateFromSchema({ schema: REPORTER_SCHEMA, value: reporter })
  if (error === undefined) {
    return
  }

  // Throw a `bug` error
  const errorA = new Error(`Reporter '${name}' is invalid: ${error}`)
  errorA.plugin = `reporter-${name}`
  throw errorA
}

module.exports = {
  getReporters,
}
