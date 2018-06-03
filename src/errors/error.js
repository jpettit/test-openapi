'use strict'

// Validation error
// Properties often assigned:
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `plugin` `{string}`: plugin that triggered the error.
//    Will be `bug` if it was a bug in the library.
//    Will be `config` if it was outside of any plugin
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in `task`, `actual` or `config`
//  - `actual` `{value}`: actual value
//  - `expected` `{value}`: expected value
//  - `schema` `{object}`: JSON schema v4 matched against `actual`
class TestOpenApiError extends Error {
  constructor(message, properties = {}) {
    super(message)

    Object.assign(this, properties, { name: 'TestOpenApiError' })

    addExpected({ obj: this, properties })
  }
}

// Tries to guess `error.expected` from simple `error.schema`
const addExpected = function({ obj, properties: { schema, expected } }) {
  if (schema === undefined || expected !== undefined) {
    return
  }

  const { enum: enumVal } = schema
  if (!Array.isArray(enumVal) || enumVal.length !== 1) {
    return
  }

  const [expectedA] = enumVal
  obj.expected = expectedA
}

module.exports = {
  TestOpenApiError,
}
