'use strict'

const { throwError } = require('../../../errors')

// Retrieve `task.parameters.path`
const addPath = function({ url, rawRequest: { path = '' } }) {
  validatePath({ path })

  return `${url}${path}`
}

const validatePath = function({ path }) {
  if (path === '' || path.startsWith('/')) {
    return
  }

  throwError('Request path must start with a slash', { property: 'path', actual: path })
}

module.exports = {
  addPath,
}
