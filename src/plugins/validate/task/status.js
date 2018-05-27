'use strict'

const { throwError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

// Validates response status code against OpenAPI specification
const validateStatus = function({ validate: { status: vStatus }, response: { status } }) {
  const { error } = validateFromSchema({ schema: vStatus, value: status })

  if (error === undefined) {
    return
  }

  const property = 'response.status'
  throwError(`Status code${error}.`, { property, expected: vStatus, actual: status })
}

module.exports = {
  validateStatus,
}
