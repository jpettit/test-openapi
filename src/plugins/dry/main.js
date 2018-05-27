'use strict'

const { handleDryRun } = require('./start')

module.exports = {
  name: 'dry',
  dependencies: [],
  conf: {
    general: {
      schema: {
        type: 'boolean',
      },
      default: false,
    },
  },
  handlers: [
    {
      type: 'start',
      handler: handleDryRun,
      order: 1500,
    },
  ],
}
