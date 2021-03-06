'use strict'

const { assert } = require('./assert')
const { checkArgument } = require('./check')

// TAP test, i.e. group of asserts
const test = function(state, testName, asserts = []) {
  checkArgument(testName, 'string')

  const testHeader = getTestHeader({ state, testName, asserts })

  const assertsString = asserts.map(assertOpts => assert(state, assertOpts))

  const testString = [testHeader, ...assertsString].join('\n\n')
  return testString
}

const getTestHeader = function({ state: { colors }, testName, asserts }) {
  const category = getCategory({ asserts })
  return colors[category](`# ${testName}`)
}

const getCategory = function({ asserts }) {
  const failed = asserts.some(({ ok }) => !ok)

  if (failed) {
    return 'fail'
  }

  return 'pass'
}

module.exports = {
  test,
}
